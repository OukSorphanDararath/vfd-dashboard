import React, { useState, useRef } from "react";
// import './style.css'; // Make sure to adjust the path as needed

// Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "rtcpuc.firebaseapp.com",
  projectId: "rtcpuc",
  storageBucket: "rtcpuc.appspot.com",
  messagingSenderId: "874247322664",
  appId: "1:874247322664:web:50eefe2040da46636f891d",
  measurementId: "G-R0KP2TRQTE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const AdminCall = () => {
  const [pc] = useState(new RTCPeerConnection()); // RTC peer connection
  const [localStream, setLocalStream] = useState(null); // Local media stream
  const [remoteStream] = useState(new MediaStream()); // Remote media stream

  // References to HTML elements
  const webcamVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callInputRef = useRef("");

  // Function to start webcam and initialize local media stream
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Push tracks from local stream to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Pull tracks from remote stream, add to video stream
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      // Set video elements' source objects
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Function to handle answering the call
  const answerCall = async () => {
    try {
      const sharedCallIdDoc = doc(firestore, "shared", "callId");

      // Retrieve the call ID from Firestore
      const docSnap = await getDoc(sharedCallIdDoc);
      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      const callId = docSnap.data().id;
      callInputRef.current.value = callId;

      // Reference the call document in Firestore
      const callDoc = doc(firestore, "calls", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      // Set up ICE candidate listener for answering the call
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          setDoc(answerCandidates.doc(), event.candidate.toJSON());
        }
      };

      // Listen for offer from caller
      onSnapshot(callDoc, async (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.offer) {
          const offerDescription = new RTCSessionDescription(data.offer);
          await pc.setRemoteDescription(offerDescription);

          // Create answer
          const answerDescription = await pc.createAnswer();
          await pc.setLocalDescription(answerDescription);

          const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
          };

          // Update call document with answer
          await updateDoc(callDoc, { answer });
        }
      });

      // Listen for ICE candidates sent by caller
      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } catch (error) {
      console.error("Error answering the call:", error);
    }
  };

  // Function to handle hanging up the call
  const hangUp = async () => {
    pc.close();
    setLocalStream(null);

    // Clear call ID from shared collection
    const sharedCallIdDoc = doc(firestore, "shared", "callId");
    await deleteDoc(sharedCallIdDoc);

    // Reset call input value
    if (callInputRef.current) {
      callInputRef.current.value = "";
    }

    // Reset video elements
    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <h1>Admin Call</h1>
      <div>
        <button id="webcamButton" onClick={startWebcam}>
          Start Webcam
        </button>
        <video
          id="webcamVideo"
          autoPlay
          playsInline
          ref={webcamVideoRef}
          style={{ width: "300px" }}
        />
      </div>
      <div>
        <input type="hidden" id="callInput" ref={callInputRef} />
        <button id="answerButton" onClick={answerCall} disabled={!localStream}>
          Answer Call
        </button>
        <button id="hangupButton" onClick={hangUp} disabled={!localStream}>
          Hang Up
        </button>
      </div>
      <div>
        <video
          id="remoteVideo"
          autoPlay
          playsInline
          ref={remoteVideoRef}
          style={{ width: "300px" }}
        />
      </div>
    </div>
  );
};

export default AdminCall;
