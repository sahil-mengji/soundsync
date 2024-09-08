import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Host from "./pages/Host";
import Peer from "./pages/Peer";
import WebRTCAudioShare from "./pages/test";
import PeerClient from "./pages/Peer";

export default function App() {
	return (
		<div className="w-full min-h-screen bg-gray-950  flex items-center justify-center p-4">
			<div className="w-full max-w-[600px] bg-gray-900 min-h-[90vh] rounded-3xl flex flex-col items-center p-8 ">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/host" element={<Host />} />
					<Route path="/peer" element={<PeerClient />} />
					<Route path="/test" element={<WebRTCAudioShare />} />
				</Routes>
			</div>
		</div>
	);
}
