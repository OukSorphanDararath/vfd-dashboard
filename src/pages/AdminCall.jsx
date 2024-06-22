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
import { FaPhoneSlash } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { PiWebcamDuotone, PiWebcamSlashDuotone } from "react-icons/pi";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAdl8RxTB2X4E4PdR6lUNw0YCOVBPFgo8w",
//   authDomain: "rtcpuc.firebaseapp.com",
//   projectId: "rtcpuc",
//   storageBucket: "rtcpuc.appspot.com",
//   messagingSenderId: "874247322664",
//   appId: "1:874247322664:web:50eefe2040da46636f891d",
//   measurementId: "G-R0KP2TRQTE",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);

const AdminCall = () => {
  // const [localStream, setLocalStream] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  // const [callId, setCallId] = useState("");
  // const [isCallActive, setIsCallActive] = useState(false);
  // const [cameraOn, setCameraOn] = useState(true);
  // const pc = useRef(
  //   new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: [
  //           "stun:stun1.l.google.com:19302",
  //           "stun:stun2.l.google.com:19302",
  //         ],
  //       },
  //     ],
  //     iceCandidatePoolSize: 10,
  //   })
  // );

  // const localVideoRef = useRef(null);
  // const remoteVideoRef = useRef(null);

  // useEffect(() => {
  //   if (localStream) {
  //     localVideoRef.current.srcObject = localStream;
  //   }
  //   if (remoteStream) {
  //     remoteVideoRef.current.srcObject = remoteStream;
  //   }
  // }, [localStream, remoteStream]);

  // const startWebcam = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setLocalStream(stream);

  //     stream.getTracks().forEach((track) => {
  //       pc.current.addTrack(track, stream);
  //     });

  //     pc.current.ontrack = (event) => {
  //       const remoteStream = event.streams[0];
  //       setRemoteStream(remoteStream);
  //     };
  //   } catch (error) {
  //     console.error("Error accessing media devices.", error);
  //   }
  // };

  // const answerCall = async () => {
  //   try {
  //     const callDocRef = doc(firestore, "shared", "callId");
  //     const callSnapshot = await getDoc(callDocRef);
  //     if (!callSnapshot.exists()) {
  //       console.log("No such document!");
  //       return;
  //     }

  //     const callData = callSnapshot.data();
  //     setCallId(callData.id);
  //     const callDoc = doc(firestore, "calls", callData.id);
  //     const answerCandidates = collection(callDoc, "answerCandidates");
  //     const offerCandidates = collection(callDoc, "offerCandidates");

  //     pc.current.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         addDoc(answerCandidates, event.candidate.toJSON());
  //       }
  //     };

  //     const callDetails = await getDoc(callDoc);
  //     const offerDescription = callDetails.data().offer;
  //     await pc.current.setRemoteDescription(
  //       new RTCSessionDescription(offerDescription)
  //     );

  //     const answerDescription = await pc.current.createAnswer();
  //     await pc.current.setLocalDescription(answerDescription);

  //     await updateDoc(callDoc, {
  //       answer: { type: answerDescription.type, sdp: answerDescription.sdp },
  //     });

  //     onSnapshot(offerCandidates, (snapshot) => {
  //       snapshot.docChanges().forEach((change) => {
  //         if (change.type === "added") {
  //           const candidate = new RTCIceCandidate(change.doc.data());
  //           pc.current.addIceCandidate(candidate);
  //         }
  //       });
  //     });

  //     setIsCallActive(true);
  //   } catch (error) {
  //     console.error("Error answering call:", error);
  //   }
  // };

  // const hangupCall = async () => {
  //   try {
  //     if (callId) {
  //       const callDoc = doc(firestore, "calls", callId);

  //       // Reset the shared call ID in Firestore
  //       await setDoc(doc(firestore, "shared", "callId"), { id: "" });

  //       // Close the peer connection
  //       pc.current.close();

  //       // Reset states
  //       setCallId("");
  //       setIsCallActive(false);
  //       setRemoteStream(null);

  //       // Stop all local media tracks
  //       if (localStream) {
  //         localStream.getTracks().forEach((track) => track.stop());
  //         setLocalStream(null);
  //       }

  //       // Create a new peer connection for a new call
  //       pc.current = new RTCPeerConnection({
  //         iceServers: [
  //           {
  //             urls: [
  //               "stun:stun1.l.google.com:19302",
  //               "stun:stun2.l.google.com:19302",
  //             ],
  //           },
  //         ],
  //         iceCandidatePoolSize: 10,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error hanging up call:", error);
  //   }
  // };

  // const toggleCamera = () => {
  //   if (localStream) {
  //     localStream
  //       .getVideoTracks()
  //       .forEach((track) => (track.enabled = !track.enabled));
  //     setCameraOn(!cameraOn);
  //   }
  // };

  return <></>;
  // return (
  //   <div className="flex p-10 gap-10 h-full bg-black/50 rounded-3xl">
  //     <div className="relative basis-4/6 w-full text-center flex justify-center h-full rounded-2xl border-2 border-gray-500 bg-black overflow-hidden">
  //       {!remoteStream && isCallActive && (
  //         <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
  //           Calling...
  //         </div>
  //       )}
  //       <div>
  //         <video
  //           ref={remoteVideoRef}
  //           autoPlay
  //           playsInline
  //           className="w-[80%] h-[100%] object-cover"
  //         />
  //       </div>
  //     </div>
  //     <div className="basis-2/6 w-full h-full ">
  //       <div className="border-2 border-gray-500 rounded-2xl h-80 overflow-hidden">
  //         <video
  //           ref={localVideoRef}
  //           autoPlay
  //           playsInline
  //           muted
  //           className="w-full h-full object-cover"
  //         />
  //       </div>
  //       <div className="flex flex-col gap-2 mt-10">
  //         {!isCallActive ? (
  //           <div className="gap-4 flex flex-col justify-center items-center">
  //             <button
  //               onClick={startWebcam}
  //               className="px-4 py-2 bg-green-600 w-56 text-white rounded flex items-center justify-center gap-2 hover:bg-green-700"
  //             >
  //               <PiWebcamDuotone size={26} />
  //               Start Webcam
  //             </button>
  //             <button
  //               onClick={answerCall}
  //               className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2 w-56 hover:bg-blue-600"
  //             >
  //               <IoCall size={26} />
  //               Answer Call
  //             </button>
  //           </div>
  //         ) : (
  //           <div className="gap-4 flex flex-col justify-center items-center">
  //             <button
  //               onClick={toggleCamera}
  //               className={`px-4 py-2 bg-gray-500 text-white rounded flex items-center justify-center gap-2 w-56 hover:bg-gray-600`}
  //             >
  //               {cameraOn ? (
  //                 <>
  //                   <PiWebcamSlashDuotone size={26} />
  //                   Turn Off Camera
  //                 </>
  //               ) : (
  //                 <>
  //                   <PiWebcamDuotone size={26} />
  //                   Turn On Camera
  //                 </>
  //               )}
  //             </button>
  //             <button
  //               onClick={hangupCall}
  //               className="px-4 py-2 bg-red-500 text-white rounded flex items-center justify-center gap-2 w-56 hover:bg-red-600"
  //             >
  //               <FaPhoneSlash size={26} />
  //               Hang Up
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default AdminCall;
