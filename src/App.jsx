import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Host from "./pages/Host";
import Peer from "./pages/Peer";
import WebRTCAudioShare from "./pages/test";

export default function App() {
	return (
		<div className="w-full min-h-screen bg-gray-950  flex items-center justify-center p-8">
			<div className="w-full max-w-[600px] bg-gray-900 min-h-[90vh] rounded-3xl flex flex-col items-center p-10 ">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/host" element={<Host />} />
					<Route path="/peer" element={<WebRTCAudioShare />} />
					<Route path="/test" element={<WebRTCAudioShare />} />
				</Routes>
			</div>
		</div>
	);
}
