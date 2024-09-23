import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Peer from "peerjs";
import { Copy } from "lucide-react";
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
	const activeCalls = useRef([]);

	useEffect(() => {
		peerRef.current = new Peer();

		peerRef.current.on("open", (id) => {
			setPeerId(id);
		});

		peerRef.current.on("connection", (conn) => {
			handleConnection(conn);
		});

		peerRef.current.on("call", (call) => {
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

			// Initiate calls for each connected peer
			connections.forEach((conn) => {
				const call = peerRef.current.call(conn.peer, stream);
				call.on("error", (err) => console.error("Call error:", err));
				// Keep track of active calls
				activeCalls.current.push(call);
			});

			setIsSharing(true);
		} catch (error) {
			console.error("Error accessing audio:", error);
		}
	};

	const stopSharing = () => {
		// Stop all tracks
		if (localAudioRef.current && localAudioRef.current.srcObject) {
			localAudioRef.current.srcObject
				.getTracks()
				.forEach((track) => track.stop());
		}

		// Close all active calls
		activeCalls.current.forEach((call) => {
			call.close();
		});
		activeCalls.current = [];

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
			canvasCtx.fillStyle = "#000000";
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "#ffffff";
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
		<>
			<p className="text-white text-2xl sm:text-3xl font-bold w-full">
				Host Mode
			</p>
			<p className="text-[#ffffffbb] text-base sm:text-lg w-full font-thin mt-2 mb-4">
				Choose whether you want to host a session or join an existing one.
			</p>

			<div className="bg-[#1c1c1e] mt-4 p-4 sm:p-8 flex flex-col sm:flex-row rounded-2xl w-full flex-wrap">
				<p className="text-xl sm:text-2xl flex justify-between gap-4 w-full items-center">
					<div className="text-base sm:text-lg">PEER ID</div>
					<div className="text-[#ffffff9a] font-thin">
						{peerId.toUpperCase()}
					</div>
					<div className="text-sm sm:text-[16px] flex gap-2 items-center bg-[#29292c] px-3 sm:px-4 py-1 rounded-full cursor-pointer">
						<Copy size={18} />
						Copy
					</div>
				</p>
			</div>

			<div className="bg-[#1c1c1e] w-full mt-4 p-4 sm:p-8 flex flex-col sm:flex-row rounded-2xl">
				<div
					style={{ aspectRatio: 1 }}
					className="rounded-lg flex items-center justify-center mb-4 sm:mb-0 sm:mr-4"
				>
					<QRCodeSVG
						bgColor="#1f2937"
						fgColor="#ffffff"
						size="80%"
						value={peerId}
					/>
				</div>
				<div className="p-4 flex flex-col justify-center">
					<p className="text-white text-xl sm:text-2xl font-semibold w-full">
						Scan QR Code
					</p>
					<p className="text-[#ffffffbb] text-sm sm:text-md w-full font-thin mt-2">
						Scan the QR Code using any app or select peer mode and then scan QR
						from there.
					</p>
					<div className="mt-2 py-2 rounded-full">
						<button
							className="bg-[#29292c] text-white py-2 sm:py-4 px-4 sm:px-8 rounded-full hover:bg-[#38383b] transition-colors"
							onClick={() => copyToClipboard(peerId)}
						>
							Copy Link 🔗
						</button>
					</div>
				</div>
			</div>

			<div className="bg-[#1c1c1e] mt-4 p-4 sm:p-8 flex flex-col sm:flex-row rounded-2xl w-full flex-wrap justify-between">
				<div className="flex items-center justify-center mb-4 sm:mb-0">
					<button
						onClick={toggleSharing}
						className={`px-6 py-3 sm:px-8 sm:py-4 rounded-full ${
							isSharing ? "bg-red-900" : "bg-blue-500"
						} text-white text-base sm:text-lg`}
					>
						{isSharing ? "Stop Sharing Audio" : "Start Sharing Audio"}
					</button>
				</div>

				<div className="bg-[#29292c] rounded-full w-full sm:w-auto">
					<div className="flex justify-center sm:justify-start">
						<label className="flex items-center">
							<input
								type="radio"
								value="microphone"
								checked={audioSource === "microphone"}
								onChange={(e) => setAudioSource(e.target.value)}
								className="hidden"
							/>
							<div
								className={`p-3 sm:p-4 px-6 sm:px-8 rounded-full bg-[#29292c] cursor-pointer transition duration-200 ${
									audioSource === "microphone" ? "bg-[#535359]" : ""
								}`}
							>
								Microphone Audio
							</div>
						</label>
						<label className="flex items-center ml-2 sm:ml-4">
							<input
								type="radio"
								value="system"
								checked={audioSource === "system"}
								onChange={(e) => setAudioSource(e.target.value)}
								className="hidden"
							/>
							<div
								className={`p-3 sm:p-4 px-6 sm:px-8 rounded-full bg-[#29292c] cursor-pointer transition duration-200 ${
									audioSource === "system" ? "bg-[#535359]" : ""
								}`}
							>
								System Audio
							</div>
						</label>
					</div>
				</div>
			</div>

			<audio ref={localAudioRef} muted />
			<canvas ref={canvasRef} width="600" height="100" className="mt-4" />

			<div className="mt-4 bg-[#1c1c1e] p-4 sm:p-8 w-full rounded-2xl">
				<h3 className="text-lg sm:text-xl font-semibold">Connected Devices:</h3>
				<div className="flex flex-col space-y-4 mt-4 w-full">
					{connections.length ? (
						connections.map((conn, index) => (
							<div
								key={index}
								className="flex items-center space-x-4 p-4 rounded-2xl bg-[#29292c] shadow-md"
							>
								<div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
									<span>R</span>
								</div>
								<p className="text-base sm:text-xl font-medium text-white flex-grow">
									{conn.peer}
								</p>
							</div>
						))
					) : (
						<p className="text-white text-center p-4 rounded-2xl bg-[#29292c] shadow-md">
							No connected devices
						</p>
					)}
				</div>
			</div>
		</>
	);
};

export default Host;

// import React, { useState, useEffect, useRef } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import Peer from "peerjs";

// const Host = () => {
// 	const [peerId, setPeerId] = useState("");
// 	const [connections, setConnections] = useState([]);
// 	const [isSharing, setIsSharing] = useState(false);
// 	const [audioSource, setAudioSource] = useState("microphone");
// 	const localAudioRef = useRef(null);
// 	const canvasRef = useRef(null);
// 	const peerRef = useRef(null);
// 	const audioContextRef = useRef(null);
// 	const analyserRef = useRef(null);

// 	const [copySuccess, setCopySuccess] = useState("");
// 	const link = "https://designshack.net/resource/file-share-manager";

// 	const [isShare, setIsShare] = useState(false);

// 	const handleChange = () => {
// 		setIsShare((prevState) => !prevState);
// 	};

// 	const copyToClipboard = (text) => {
// 		navigator.clipboard.writeText(text).then(
// 			() => setCopySuccess("Link copied!"),
// 			() => setCopySuccess("Failed to copy link.")
// 		);
// 	};

// 	useEffect(() => {
// 		peerRef.current = new Peer();

// 		peerRef.current.on("open", (id) => {
// 			setPeerId(id);
// 		});

// 		peerRef.current.on("connection", (conn) => {
// 			handleConnection(conn);
// 		});

// 		peerRef.current.on("call", (call) => {
// 			call.answer(); // Answer with an empty stream
// 			call.on("error", (err) => console.error("Call error:", err));
// 		});

// 		return () => {
// 			if (peerRef.current) {
// 				peerRef.current.destroy();
// 			}
// 		};
// 	}, []);

// 	const handleConnection = (conn) => {
// 		conn.on("open", () => {
// 			setConnections((prevConnections) => [...prevConnections, conn]);
// 		});
// 		conn.on("close", () => {
// 			setConnections((prevConnections) =>
// 				prevConnections.filter((c) => c.peer !== conn.peer)
// 			);
// 		});
// 		conn.on("error", (err) => console.error("Connection error:", err));
// 	};

// 	const startSharing = async () => {
// 		try {
// 			let stream;
// 			if (audioSource === "microphone") {
// 				stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// 			} else {
// 				stream = await navigator.mediaDevices.getDisplayMedia({
// 					audio: true,
// 					video: true,
// 				});
// 			}
// 			localAudioRef.current.srcObject = stream;

// 			// Setup audio visualization
// 			setupAudioVisualization(stream);

// 			connections.forEach((conn) => {
// 				const call = peerRef.current.call(conn.peer, stream);
// 				call.on("error", (err) => console.error("Call error:", err));
// 			});

// 			setIsSharing(true);
// 		} catch (error) {
// 			console.error("Error accessing audio:", error);
// 		}
// 	};

// 	const stopSharing = () => {
// 		if (localAudioRef.current && localAudioRef.current.srcObject) {
// 			localAudioRef.current.srcObject
// 				.getTracks()
// 				.forEach((track) => track.stop());
// 		}
// 		setIsSharing(false);
// 	};

// 	const toggleSharing = () => {
// 		isSharing ? stopSharing() : startSharing();
// 	};

// 	const setupAudioVisualization = (stream) => {
// 		audioContextRef.current = new (window.AudioContext ||
// 			window.webkitAudioContext)();
// 		const source = audioContextRef.current.createMediaStreamSource(stream);
// 		analyserRef.current = audioContextRef.current.createAnalyser();
// 		source.connect(analyserRef.current);
// 		analyserRef.current.fftSize = 2048;
// 		const bufferLength = analyserRef.current.frequencyBinCount;
// 		const dataArray = new Uint8Array(bufferLength);
// 		const canvas = canvasRef.current;
// 		const canvasCtx = canvas.getContext("2d");

// 		const draw = () => {
// 			requestAnimationFrame(draw);
// 			analyserRef.current.getByteTimeDomainData(dataArray);
// 			canvasCtx.fillStyle = "#111827";
// 			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
// 			canvasCtx.lineWidth = 2;
// 			canvasCtx.strokeStyle = "#fff700";
// 			canvasCtx.beginPath();
// 			const sliceWidth = (canvas.width * 1.0) / bufferLength;
// 			let x = 0;

// 			for (let i = 0; i < bufferLength; i++) {
// 				const v = dataArray[i] / 128.0;
// 				const y = (v * canvas.height) / 2;

// 				if (i === 0) {
// 					canvasCtx.moveTo(x, y);
// 				} else {
// 					canvasCtx.lineTo(x, y);
// 				}
// 				x += sliceWidth;
// 			}
// 			canvasCtx.lineTo(canvas.width, canvas.height / 2);
// 			canvasCtx.stroke();
// 		};
// 		draw();
// 	};

// 	return (
// 		<div className="w-full">
// 			<p className="font-semibold text-2xl orbitron w-full text-center">
// 				Host mode
// 			</p>
// 			<p className="opacity-70 mt-4 text-center text-[12px] ">
// 				Select Host mode on other devices and scan the <br /> QR code or just
// 				share the link to other devices
// 			</p>

// 			<div
// 				style={{ aspectRatio: 1 }}
// 				className="rounded-lg bg-gray-800 p-4 mt-8 flex items-center justify-center max-w-[300px] mx-auto"
// 			>
// 				<QRCodeSVG
// 					bgColor="#1f2937"
// 					fgColor="#ffffff"
// 					size="100%"
// 					value={`https://soundsynk.netlify.app/?peerId=${encodeURIComponent(
// 						peerId
// 					)}`}
// 				/>
// 			</div>

// 			<p className="text-center mt-4">
// 				Your Peer ID: <br /> <b className="text-mono">{peerId}</b>{" "}
// 			</p>
// 			<div className="flex items-center  mt-2 py-2 px-4 rounded-full justify-center">
// 				<button
// 					className=" bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-950"
// 					onClick={() =>
// 						copyToClipboard(
// 							`https://soundsynk.netlify.app/?peerId=${encodeURIComponent(
// 								peerId
// 							)}`
// 						)
// 					}
// 				>
// 					Copy Link 🔗
// 				</button>
// 			</div>

// 			{copySuccess && (
// 				<p className="text-green-500  w-full text-center">{copySuccess}</p>
// 			)}

// 			{/* <QRCodeSVG value={peerId} size={200} className="my-4" /> */}
// 			<div className="mb-4 w-full items-center  bg-slate-800 rounded-xl p-4 mt-8 ">
// 				<label className="block text-lg font-medium mb-2">
// 					Choose Audio Source:
// 				</label>
// 				<select
// 					value={audioSource}
// 					onChange={(e) => setAudioSource(e.target.value)}
// 					className="p-2 border rounded bg-slate-800 w-full"
// 				>
// 					<option value="microphone">Microphone Audio</option>
// 					<option value="system">System Audio</option>
// 				</select>
// 				<button
// 					onClick={toggleSharing}
// 					className={`px-4 py-2 rounded mt-4 ${
// 						isSharing ? "bg-red-500" : "bg-green-500"
// 					} text-white`}
// 				>
// 					{isSharing ? "Stop Sharing Audio" : "Start Sharing Audio"}
// 				</button>
// 			</div>

// 			<audio ref={localAudioRef} muted />
// 			{<canvas ref={canvasRef} height="100" className="mt-4 w-full" />}

// 			<div className="mt-4">
// 				<h3 className="text-lg font-semibold">Connected Devices:</h3>
// 				<div className="flex flex-col space-y-4 mt-4">
// 					{connections.length != 0 ? (
// 						connections.map((conn, index) => (
// 							<div
// 								key={index}
// 								className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md"
// 							>
// 								{/* Random color div */}
// 								<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
// 									<span>R</span> {/* Replace with random color or content */}
// 								</div>

// 								{/* Name */}
// 								<p className="text-xl font-medium text-gray-500 flex-grow">
// 									{conn.peer}
// 								</p>
// 							</div>
// 						))
// 					) : (
// 						<p className="text-gray-500 text-center flex items-center space-x-4 p-4 rounded-2xl bg-gray-800  shadow-md">
// 							No connected devices
// 						</p>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Host;
