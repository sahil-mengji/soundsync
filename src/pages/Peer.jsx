import React, { useState, useRef, useEffect } from "react";
import Peer from "peerjs";

const PeerClient = () => {
	const [peerId, setPeerId] = useState("");
	const remoteAudioRef = useRef(null);
	const peerRef = useRef(null);

	useEffect(() => {
		peerRef.current = new Peer();

		peerRef.current.on("call", (call) => {
			call.answer(); // Answer the call with an empty stream
			call.on("stream", (remoteStream) => {
				remoteAudioRef.current.srcObject = remoteStream;
			});
			call.on("error", (err) => console.error("Call error:", err));
		});

		return () => {
			if (peerRef.current) {
				peerRef.current.destroy();
			}
		};
	}, []);

	const connectToHost = (hostPeerId) => {
		const conn = peerRef.current.connect(hostPeerId);
		conn.on("error", (err) => console.error("Connection error:", err));
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Client Audio Receiver</h1>
			<input
				type="text"
				placeholder="Enter Host Peer ID"
				className="border p-2 mr-2"
				onChange={(e) => setPeerId(e.target.value)}
			/>
			<button
				onClick={() => connectToHost(peerId)}
				className="bg-green-500 text-white px-4 py-2 rounded"
			>
				Connect
			</button>
			<audio ref={remoteAudioRef} autoPlay controls />
		</div>
	);
};

export default PeerClient;
