import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Peer from "peerjs";

const Host = () => {
	const [peerId, setPeerId] = useState("");
	const [connections, setConnections] = useState([]);
	const [isSharing, setIsSharing] = useState(false);
	const [audioSource, setAudioSource] = useState("microphone");
	const localAudioRef = useRef(null);
	const canvasRef = useRef(null);
	const peerRef = useRef(null);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);

	const [copySuccess, setCopySuccess] = useState("");
	const link = "https://designshack.net/resource/file-share-manager";

	const [isShare, setIsShare] = useState(false);

	const handleChange = () => {
		setIsShare((prevState) => !prevState);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(
			() => setCopySuccess("Link copied!"),
			() => setCopySuccess("Failed to copy link.")
		);
	};

	useEffect(() => {
		peerRef.current = new Peer();

		peerRef.current.on("open", (id) => {
			setPeerId(id);
		});

		peerRef.current.on("connection", (conn) => {
			handleConnection(conn);
		});

		peerRef.current.on("call", (call) => {
			call.answer(); // Answer with an empty stream
			call.on("error", (err) => console.error("Call error:", err));
		});

		return () => {
			if (peerRef.current) {
				peerRef.current.destroy();
			}
		};
	}, []);

	const handleConnection = (conn) => {
		conn.on("open", () => {
			setConnections((prevConnections) => [...prevConnections, conn]);
		});
		conn.on("close", () => {
			setConnections((prevConnections) =>
				prevConnections.filter((c) => c.peer !== conn.peer)
			);
		});
		conn.on("error", (err) => console.error("Connection error:", err));
	};

	const startSharing = async () => {
		try {
			let stream;
			if (audioSource === "microphone") {
				stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			} else {
				stream = await navigator.mediaDevices.getDisplayMedia({
					audio: true,
					video: true,
				});
			}
			localAudioRef.current.srcObject = stream;

			// Setup audio visualization
			setupAudioVisualization(stream);

			connections.forEach((conn) => {
				const call = peerRef.current.call(conn.peer, stream);
				call.on("error", (err) => console.error("Call error:", err));
			});

			setIsSharing(true);
		} catch (error) {
			console.error("Error accessing audio:", error);
		}
	};

	const stopSharing = () => {
		if (localAudioRef.current && localAudioRef.current.srcObject) {
			localAudioRef.current.srcObject
				.getTracks()
				.forEach((track) => track.stop());
		}
		setIsSharing(false);
	};

	const toggleSharing = () => {
		isSharing ? stopSharing() : startSharing();
	};

	const setupAudioVisualization = (stream) => {
		audioContextRef.current = new (window.AudioContext ||
			window.webkitAudioContext)();
		const source = audioContextRef.current.createMediaStreamSource(stream);
		analyserRef.current = audioContextRef.current.createAnalyser();
		source.connect(analyserRef.current);
		analyserRef.current.fftSize = 2048;
		const bufferLength = analyserRef.current.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		const canvas = canvasRef.current;
		const canvasCtx = canvas.getContext("2d");

		const draw = () => {
			requestAnimationFrame(draw);
			analyserRef.current.getByteTimeDomainData(dataArray);
			canvasCtx.fillStyle = "#111827";
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "#fff700";
			canvasCtx.beginPath();
			const sliceWidth = (canvas.width * 1.0) / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = (v * canvas.height) / 2;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}
				x += sliceWidth;
			}
			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
		};
		draw();
	};

	return (
		<div className="w-full">
			<p className="font-semibold text-2xl orbitron w-full text-center">
				Host mode
			</p>
			<p className="opacity-70 mt-4 text-center text-[12px] ">
				Select Host mode on other devices and scan the <br /> QR code or just
				share the link to other devices
			</p>

			<div
				style={{ aspectRatio: 1 }}
				className="rounded-lg bg-gray-800 p-4 mt-8 flex items-center justify-center max-w-[300px] mx-auto"
			>
				<QRCodeSVG
					bgColor="#1f2937"
					fgColor="#ffffff"
					size="100%"
					value={`https://soundsynk.netlify.app/?peerId=${encodeURIComponent(
						peerId
					)}`}
				/>
			</div>

			<p className="text-center mt-4">
				Your Peer ID: <br /> <b className="text-mono">{peerId}</b>{" "}
			</p>
			<div className="flex items-center  mt-2 py-2 px-4 rounded-full justify-center">
				<button
					className=" bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-950"
					onClick={() =>
						copyToClipboard(
							`https://soundsynk.netlify.app/?peerId=${encodeURIComponent(
								peerId
							)}`
						)
					}
				>
					Copy Link 🔗
				</button>
			</div>

			{copySuccess && (
				<p className="text-green-500  w-full text-center">{copySuccess}</p>
			)}

			{/* <QRCodeSVG value={peerId} size={200} className="my-4" /> */}
			<div className="mb-4 w-full items-center  bg-slate-800 rounded-xl p-4 mt-8 ">
				<label className="block text-lg font-medium mb-2">
					Choose Audio Source:
				</label>
				<select
					value={audioSource}
					onChange={(e) => setAudioSource(e.target.value)}
					className="p-2 border rounded bg-slate-800 w-full"
				>
					<option value="microphone">Microphone Audio</option>
					<option value="system">System Audio</option>
				</select>
				<button
					onClick={toggleSharing}
					className={`px-4 py-2 rounded mt-4 ${
						isSharing ? "bg-red-500" : "bg-green-500"
					} text-white`}
				>
					{isSharing ? "Stop Sharing Audio" : "Start Sharing Audio"}
				</button>
			</div>

			<audio ref={localAudioRef} muted />
			{isSharing && (
				<canvas ref={canvasRef} height="100" className="mt-4 w-full" />
			)}

			<div className="mt-4">
				<h3 className="text-lg font-semibold">Connected Devices:</h3>
				<div className="flex flex-col space-y-4 mt-4">
					{connections.length != 0 ? (
						connections.map((conn, index) => (
							<div
								key={index}
								className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md"
							>
								{/* Random color div */}
								<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
									<span>R</span> {/* Replace with random color or content */}
								</div>

								{/* Name */}
								<p className="text-xl font-medium text-gray-500 flex-grow">
									{conn.peer}
								</p>
							</div>
						))
					) : (
						<p className="text-gray-500 text-center flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md">
							No connected devices
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Host;

// import React, { useState } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import SwitchButton from "../components/SwitchButton";

// export default function Host() {
// 	const [copySuccess, setCopySuccess] = useState("");
// 	const link = "https://designshack.net/resource/file-share-manager";

// 	const [isSharing, setIsSharing] = useState(false);

// 	const handleChange = () => {
// 		setIsSharing((prevState) => !prevState);
// 	};

// 	const copyToClipboard = (text) => {
// 		navigator.clipboard.writeText(text).then(
// 			() => setCopySuccess("Link copied!"),
// 			() => setCopySuccess("Failed to copy link.")
// 		);
// 	};

// 	return (
// 		<>
// 			<p className="font-semibold text-2xl orbitron">Host mode</p>
// 			<p className="opacity-70 mt-4 text-center text-lg ">
// 				Select Host mode on other devices and scan the <br /> QR code or just
// 				share the link to other devices
// 			</p>
// 			<div
// 				style={{ aspectRatio: 1 }}
// 				className="rounded-lg bg-gray-800 p-4 mt-8 flex items-center justify-center max-w-[300px]"
// 			>
// 				<QRCodeSVG
// 					bgColor="#1f2937"
// 					fgColor="#ffffff"
// 					size="100%"
// 					value="https://reactjs.org/"
// 				/>
// 			</div>
// 			{/* <div className="flex items-center bg-gray-800 mt-4 py-2 px-4 rounded-full">
// 				<span className="flex-grow text-gray-200">{link}</span>
// 				<button
// 					className="ml-4 bg-blue-500 text-white py-1 px-3 rounded-full hover:bg-blue-600"
// 					onClick={() => copyToClipboard(link)}
// 				>
// 					Copy
// 				</button>
// 			</div>

// 			{copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>} */}

// 			<div className="flex items-center gap-4 my-4">
// 				<label className="relative inline-flex items-center cursor-pointer">
// 					<input
// 						type="checkbox"
// 						checked={isSharing}
// 						onChange={handleChange}
// 						className="sr-only"
// 					/>
// 					<div className="w-14 h-8 bg-gray-300 rounded-full flex items-center p-1 transition-colors duration-300 ease-in-out">
// 						<div
// 							className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
// 								isSharing ? "translate-x-6 bg-green-500" : ""
// 							}`}
// 						/>
// 					</div>
// 				</label>
// 				<span className="text-lg font-semibold text-gray-700">
// 					{isSharing ? "Stop Sharing Audio" : "Share Audio"}
// 				</span>
// 			</div>

<p className="font-semibold text-xl orbitron w-full  mt-8">
	Connected devices
	<div className="flex flex-col space-y-4 mt-4">
		<div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md">
			{/* Random color div */}
			<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
				<span>R</span> {/* Replace with random color or content */}
			</div>

			{/* Name */}
			<p className="text-xl font-medium text-gray-500 flex-grow">Name</p>
		</div>
		<div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md">
			{/* Random color div */}
			<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
				<span>R</span> {/* Replace with random color or content */}
			</div>

			{/* Name */}
			<p className="text-xl font-medium text-gray-500 flex-grow">Name</p>
		</div>
		<div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md">
			{/* Random color div */}
			<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
				<span>R</span> {/* Replace with random color or content */}
			</div>

			{/* Name */}
			<p className="text-xl font-medium text-gray-500 flex-grow">Name</p>
		</div>
		<div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md">
			{/* Random color div */}
			<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
				<span>R</span> {/* Replace with random color or content */}
			</div>

			{/* Name */}
			<p className="text-xl font-medium text-gray-500 flex-grow">Name</p>
		</div>
	</div>
</p>;
// 		</>
// 	);
// }
