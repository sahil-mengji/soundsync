import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import SwitchButton from "../components/SwitchButton";

export default function Host() {
	const [copySuccess, setCopySuccess] = useState("");
	const link = "https://designshack.net/resource/file-share-manager";

	const [isSharing, setIsSharing] = useState(false);

	const handleChange = () => {
		setIsSharing((prevState) => !prevState);
	};
	
	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(
			() => setCopySuccess("Link copied!"),
			() => setCopySuccess("Failed to copy link.")
		);
	};

	return (
		<>
			<p className="font-semibold text-2xl orbitron">Host mode</p>
			<p className="opacity-70 mt-4 text-center text-lg ">
				Select Host mode on other devices and scan the <br /> QR code or just
				share the link to other devices
			</p>
			<div
				style={{ aspectRatio: 1 }}
				className="rounded-lg bg-gray-800 p-4 mt-8 flex items-center justify-center max-w-[300px]"
			>
				<QRCodeSVG
					bgColor="#1f2937"
					fgColor="#ffffff"
					size="100%"
					value="https://reactjs.org/"
				/>
			</div>
			{/* <div className="flex items-center bg-gray-800 mt-4 py-2 px-4 rounded-full">
				<span className="flex-grow text-gray-200">{link}</span>
				<button
					className="ml-4 bg-blue-500 text-white py-1 px-3 rounded-full hover:bg-blue-600"
					onClick={() => copyToClipboard(link)}
				>
					Copy
				</button>
			</div>

			{copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>} */}

			<div className="flex items-center gap-4 my-4">
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={isSharing}
						onChange={handleChange}
						className="sr-only"
					/>
					<div className="w-14 h-8 bg-gray-300 rounded-full flex items-center p-1 transition-colors duration-300 ease-in-out">
						<div
							className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
								isSharing ? "translate-x-6 bg-green-500" : ""
							}`}
						/>
					</div>
				</label>
				<span className="text-lg font-semibold text-gray-700">
					{isSharing ? "Stop Sharing Audio" : "Share Audio"}
				</span>
			</div>

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
			</p>
		</>
	);
}
