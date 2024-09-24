import React, { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { useLocation } from "react-router";

const PeerClient = () => {
	const [peerId, setPeerId] = useState(""); // Host peer ID
	const [connected, setConnected] = useState(false); // Track connection status
	const [connectionMessage, setConnectionMessage] = useState(""); // Show status messages
	const [messageColor, setMessageColor] = useState("text-yellow-500"); // Manage color state
	const remoteAudioRef = useRef(null);
	const peerRef = useRef(null); // PeerJS instance
	const connectionRef = useRef(null); // Connection instance

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const id = queryParams.get("peerId");

	useEffect(() => {
		// Initialize Peer on mount
		peerRef.current = new Peer();

		// Handle incoming calls
		peerRef.current.on("call", (call) => {
			call.answer(); // Answer the call with an empty stream
			call.on("stream", (remoteStream) => {
				remoteAudioRef.current.srcObject = remoteStream;
			});
			call.on("error", (err) => console.error("Call error:", err));
		});

		// Cleanup Peer on unmount
		return () => {
			if (peerRef.current) {
				peerRef.current.destroy();
			}
		};
	}, []);

	useEffect(() => {
		// Automatically connect if peerId exists in query params on initial load
		if (id) {
			setPeerId(id);
			connectToHost(id);
		}
	}, [id]); // Dependency on 'id' to run only when it changes

	const connectToHost = (hostPeerId) => {
		if (!hostPeerId) {
			setConnectionMessage("No Peer ID provided.");
			setMessageColor("text-red-500"); // Red for error
			return;
		}

		const lowerHostPeerId = hostPeerId.toLowerCase();

		setConnectionMessage(`Connecting to Peer ID: ${lowerHostPeerId}...`);
		setMessageColor("yellow"); // Yellow for loading

		const conn = peerRef.current.connect(lowerHostPeerId);

		conn.on("open", () => {
			setConnected(true);
			setConnectionMessage(`Connected to Peer ID: ${lowerHostPeerId}`);
			setMessageColor("green"); // Green for connected
			connectionRef.current = conn; // Save the connection instance
		});

		conn.on("close", () => {
			setConnected(false);
			setConnectionMessage(`Disconnected from Peer ID: ${lowerHostPeerId}`);
			setMessageColor("red"); // Red for disconnected
		});

		conn.on("error", (err) => {
			console.error("Connection error:", err);
			setConnectionMessage(`Failed to connect to Peer ID: ${lowerHostPeerId}`);
			setMessageColor("red"); // Red for error
		});
	};

	const disconnectFromHost = () => {
		if (connectionRef.current) {
			connectionRef.current.close();
			setConnected(false);
			setConnectionMessage("You have disconnected from the peer.");
			setMessageColor("red"); // Red for disconnected
		} else {
			setConnectionMessage("No active connection to disconnect.");
			setMessageColor("red"); // Red for error
		}
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
				<p className="text-xl sm:text-2xl flex flex-col sm:flex-row justify-between gap-4 w-full items-start flex-wrap">
					<input
						type="text"
						placeholder="Enter Host Peer ID"
						className="border-none focus:outline-none p-2 px-4 mb-2 sm:mb-0 rounded-xl text-base sm:text-lg bg-[#29292c] flex-1 sm:w-full"
						value={peerId}
						onChange={(e) => setPeerId(e.target.value)}
					/>
					{!connected ? (
						<button
							onClick={() => connectToHost(peerId)}
							className="px-4 py-2 rounded-full bg-blue-500 text-white text-base sm:text-lg"
							disabled={connected}
						>
							Connect
						</button>
					) : (
						<button
							onClick={disconnectFromHost}
							className="px-4 py-2 rounded-full bg-red-500 text-white text-base sm:text-lg"
							disabled={!connected}
						>
							Disconnect
						</button>
					)}
				</p>
			</div>
			{/* Connection status messages */}
			{connectionMessage && (
				<div
					className={`text-${messageColor}-500 bg-${messageColor}-800   font-medium mb-4 mt-4 px-8`}
				>
					{connectionMessage}
				</div>
			)}

			{/* Audio stream */}
			<audio ref={remoteAudioRef} autoPlay controls className="z-[-20]" />
		</>
	);
};

export default PeerClient;
