import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Host from "./pages/Host";
import Peer from "./pages/Peer";
import WebRTCAudioShare from "./pages/test";
import PeerClient from "./pages/Peer";
import EncoderDecoder from "./pages/EncoderDecoder";

export default function App() {
	return (
		<div className="w-full min-h-screen bg-black  flex flex-col items-center justify-center p-4">
			<p className="text-3xl font-bold orbitron my-8 text-[#6fd4ff]">
				🔊SoundSynk
			</p>
			<div className=" w-full max-w-[800px]  min-h-[90vh] rounded-3xl flex flex-col items-center p-8 ">
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
