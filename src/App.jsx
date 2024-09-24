import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Host from "./pages/Host";
import Peer from "./pages/Peer";
import WebRTCAudioShare from "./pages/test";
import PeerClient from "./pages/Peer";
import EncoderDecoder from "./pages/EncoderDecoder";
import { Volume, Volume1, Volume2 } from "lucide-react";

export default function App() {
	return (
		<div className=" relative w-full min-h-screen bg-black  flex flex-col items-center justify-center p-4 overflow-x-hidden">
			<div className="absolute top-[-22%] sm:top-[-30%]  left-1/2 transform -translate-x-1/2 w-[200%] h-[500px] bg-gradient-radial from-[#6fd4ff] via-transparent to-transparent opacity-40 blur-2xl z-40"></div>

			<p className="text-xl sm:text-3xl  grotesk my-8 bg-[#1c1c1e] p-4 rounded-full px-8 relative rounded-bl-[0px] mx-8 mb-16 ">
				Sound<span className="text-[#6fd4ff]">Synk</span>
				<Volume2
					className="absolute top-[-16px] right-[-24px] rotate-[-16deg] bg-[#37373b] rounded-full p-2"
					size={50}
				/>
			</p>
			<div className=" w-full max-w-[800px]  min-h-[90vh] rounded-3xl flex flex-col items-center p-2 ">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/host" element={<Host />} />
					<Route path="/peer" element={<PeerClient />} />
					<Route path="/test" element={<WebRTCAudioShare />} />
					<Route path="ee" element={<EncoderDecoder />} />
				</Routes>
			</div>
		</div>
	);
}
