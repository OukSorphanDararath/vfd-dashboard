import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
const apiBaseUrl = import.meta.env.VITE_API_KEY;
const socket = io(apiBaseUrl); // Replace with your server URL

const AdminCall = () => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [offer, setOffer] = useState(null);
  const remoteVideoRef = useRef(null); // Ref for the remote video element
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    // Listen for incoming offer
    socket.on("offer", (receivedOffer) => {
      setOffer(receivedOffer); // Store the offer
    });

    // Listen for ICE candidates
    socket.on("icecandidate", async (candidate) => {
      const pc = peerConnectionRef.current;
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      socket.off("offer");
      socket.off("icecandidate");
    };
  }, []);

  const handleAcceptCall = async () => {
    if (!offer) return;

    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    // Set up event for handling the remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("icecandidate", event.candidate);
      }
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", answer);

      setCallAccepted(true); // Update state to reflect the call is accepted
    } catch (error) {
      console.error("Error handling offer/answer", error);
    }
  };

  const handleCloseCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setCallAccepted(false);
    setOffer(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <h1>Admin Side</h1>
      <video ref={remoteVideoRef} autoPlay style={{ width: "500px" }} />
      {!callAccepted && offer && (
        <button onClick={handleAcceptCall}>Accept Call</button>
      )}
      {callAccepted && <button onClick={handleCloseCall}>Close Call</button>}
    </div>
  );
};

export default AdminCall;
