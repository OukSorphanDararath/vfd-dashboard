import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../firebase"; // Adjust the path as needed

const AdminCall = () => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [callId, setCallId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isHangupDisabled, setIsHangupDisabled] = useState(true);

  console.log(callId, "CALL ID");

  // Ref for accessing video element
  const remoteVideoRef = useRef(null);

  // RTCPeerConnection configuration
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  let pc = null;

  useEffect(() => {
    const fetchCallId = async () => {
      try {
        const sharedCallIdDoc = await firestore
          .collection("shared")
          .doc("callId")
          .get();
        if (sharedCallIdDoc.exists) {
          setCallId(sharedCallIdDoc.data().id);
        } else {
          console.log("No call ID found");
        }
      } catch (error) {
        console.error("Error fetching call ID:", error);
      }
    };

    fetchCallId();

    // Clean up listeners if needed
    return () => {
      // Unsubscribe listeners or any other clean-up logic
    };
  }, []);

  const answerCall = async () => {
    try {
      // Reference the call document in Firestore
      const callDocRef = firestore.collection("calls").doc(callId);
      const answerCandidates = callDocRef.collection("answerCandidates");
      const offerCandidates = callDocRef.collection("offerCandidates");

      // Initialize RTCPeerConnection
      pc = new RTCPeerConnection(servers);

      // Listen for remote tracks
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // Listen for ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          answerCandidates.add(event.candidate.toJSON());
        }
      };

      // Listen for offer
      callDocRef.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.offer) {
          const offer = new RTCSessionDescription(data.offer);
          await pc.setRemoteDescription(offer);

          // Create answer
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          await callDocRef.update({ answer: answer.toJSON() });
        }
      });

      // Listen for ICE candidates sent by caller
      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });

      setIsConnected(true);
      setIsHangupDisabled(false);
    } catch (error) {
      console.error("Error answering the call:", error);
    }
  };

  const hangupCall = async () => {
    // Close RTCPeerConnection
    if (pc) {
      pc.close();
    }

    // Remove call ID from shared document
    await firestore.collection("shared").doc("callId").delete();

    setRemoteStream(null);
    setCallId("");
    setIsConnected(false);
    setIsHangupDisabled(true);
  };

  return (
    <div>
      <h1>Admin Call</h1>
      <div>
        {remoteStream && (
          <video id="remoteVideo" autoPlay ref={remoteVideoRef}></video>
        )}
      </div>
      {!isConnected && (
        <button onClick={answerCall} disabled={!callId}>
          Answer Call
        </button>
      )}
      {isConnected && (
        <button onClick={hangupCall} disabled={isHangupDisabled}>
          Hang Up
        </button>
      )}
      <p>Call ID: {callId}</p>
      {isConnected && <p>Connected!</p>}
    </div>
  );
};

export default AdminCall;
