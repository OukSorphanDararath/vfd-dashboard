import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
// import { getAuth } from 'firebase/auth'; // If you need auth
// import './style.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdl8RxTB2X4E4PdR6lUNw0YCOVBPFgo8w",
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
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callId, setCallId] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const pc = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    })
  );

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      pc.current.addTrack(track, stream);
    });

    pc.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
    };
  };

  const answerCall = async () => {
    const callDocRef = doc(firestore, "shared", "callId");
    const callSnapshot = await getDoc(callDocRef);
    if (!callSnapshot.exists()) {
      console.log("No such document!");
      return;
    }

    const callData = callSnapshot.data();
    setCallId(callData.id);
    const callDoc = doc(firestore, "calls", callData.id);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callDetails = await getDoc(callDoc);
    const offerDescription = callDetails.data().offer;
    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    await updateDoc(callDoc, {
      answer: { type: answerDescription.type, sdp: answerDescription.sdp },
    });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current.addIceCandidate(candidate);
        }
      });
    });

    setIsCallActive(true);
  };

  const hangupCall = async () => {
    if (callId) {
      const callDoc = doc(firestore, "calls", callId);
      await updateDoc(callDoc, { answer: null });
      setCallId("");
      setIsCallActive(false);
      setRemoteStream(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    }
  };

  return (
    <div className="admin-call">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="local-video"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="remote-video"
      />
      <div>
        {!isCallActive ? (
          <button onClick={startWebcam}>Start Webcam</button>
        ) : (
          <button onClick={hangupCall}>Hang Up</button>
        )}
        <button onClick={answerCall} disabled={isCallActive}>
          Answer Call
        </button>
      </div>
    </div>
  );
};

export default AdminCall;
