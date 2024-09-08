import React, { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { useSearchParams } from "react-router-dom";

const PeerClient = () => {
	const [peerId, setPeerId] = useState("");
	const remoteAudioRef = useRef(null);
	const peerRef = useRef(null);
	const [searchParams] = useSearchParams();
	const hasConnected = useRef(false); // Ref to track if the connection attempt has been made

	useEffect(() => {
		// Initialize Peer instance
		peerRef.current = new Peer();

		// Handle incoming calls
		peerRef.current.on("call", (call) => {
			call.answer(); // Answer the call with an empty stream
			call.on("stream", (remoteStream) => {
				remoteAudioRef.current.srcObject = remoteStream;
			});
			call.on("error", (err) => console.error("Call error:", err));
		});

		// Clean up Peer instance on component unmount
		return () => {
			if (peerRef.current) {
				peerRef.current.destroy();
			}
		};
	}, []);

	useEffect(() => {
		// Extract peerId from query params on initial load
		const id = searchParams.get("peerId");
		if (id && !hasConnected.current) {
			setPeerId(id);
			connectToHost(id); // Automatically connect to the host if peerId is available
			hasConnected.current = true; // Set flag to true after attempting to connect
		}
	}, [searchParams]);

	const connectToHost = (hostPeerId) => {
		const conn = peerRef.current.connect(hostPeerId);
		conn.on("error", (err) => console.error("Connection error:", err));
	};

	return (
		<>
			<p className="font-semibold text-2xl orbitron w-full text-center mb-8">
				Host mode
			</p>
			<input
				type="text"
				placeholder="Enter Host Peer ID "
				className=" p-4 mr-2 bg-gray-700 focus:outline-none focus:border-none w-full rounded-lg"
				value={peerId} // Keep the input value controlled
				onChange={(e) => setPeerId(e.target.value)}
			/>
			<button
				onClick={() => connectToHost(peerId)}
				className="bg-green-500 text-white px-4 py-2 rounded mt-4"
			>
				Connect
			</button>
			<audio ref={remoteAudioRef} autoPlay controls className="opacity-0" />
		</>
	);
};

export default PeerClient;
