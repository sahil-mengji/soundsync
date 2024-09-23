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
		const conn = peerRef.current.connect(hostPeerId.toLowerCase());
		conn.on("error", (err) => console.error("Connection error:", err));
	};

	return (
		<>
			<p className="text-white text-2xl sm:text-3xl font-bold w-full">
				Peer Mode
			</p>
			<p className="text-[#ffffffbb] text-base sm:text-lg w-full font-thin mt-2 mb-4">
				Choose whether you want to host a session or join an existing one.
			</p>

			<div className="bg-[#1c1c1e] mt-4 p-4 flex flex-col sm:flex-row rounded-2xl w-full">
				<p className="text-xl sm:text-2xl flex flex-col sm:flex-row  justify-between gap-4 w-full items-start flex-wrap">
					<input
						type="text"
						placeholder="Enter Host Peer ID"
						className="border-none focus:outline-none p-2 px-4 mb-2 sm:mb-0 rounded-xl text-base sm:text-lg bg-[#29292c] flex-1 sm:w-full"
						onChange={(e) => setPeerId(e.target.value)}
					/>
					<button
						onClick={() => connectToHost(peerId)}
						className="px-4 py-2 rounded-full bg-blue-500 text-white text-base sm:text-lg"
					>
						Connect
					</button>
				</p>
			</div>

			<audio ref={remoteAudioRef} autoPlay controls className="z-[-20]" />
		</>
	);
};

export default PeerClient;
