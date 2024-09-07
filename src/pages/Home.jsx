import React from "react";
import { useNavigate } from "react-router";

export default function Home() {
	const navigate = useNavigate();
	return (
		<>
			<p className="text-white text-3xl font-bold orbitron">AudioSync</p>
			<p className="text-gray-400 text-lg font-[sans-serif]  orbitron text-center mt-4">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos
				quisquam dolore similique vel sit doloribus officia, necessitatibus
			</p>

			<div className="w-full mt-8 flex justify-evenly gap-4">
				<div
					onClick={() => navigate("/host")}
					style={{ aspectRatio: 1 }}
					className="flex-1 cursor-pointer flex justify-center flex-col bg-gray-800 hover:bg-gray-700 transition-[200ms] p-4 gap-2  items-center rounded-lg max-w-[200px]"
				>
					<img src="monitor-speaker.svg" className="w-12 h-12" alt="" />
					<h3 className="text-2xl font-semibold text-gray-400"> Host</h3>
				</div>
				<div
					onClick={() => navigate("/peer")}
					style={{ aspectRatio: 1 }}
					className="flex-1 cursor-pointer flex justify-center flex-col bg-gray-800 hover:bg-gray-700 transition-[200ms] p-4  gap-2 items-center rounded-lg max-w-[200px]"
				>
					<img src="screen-share.svg" className="w-12 h-12" alt="" />
					<h3 className="text-2xl font-semibold text-gray-400"> Peer</h3>
				</div>
			</div>
		</>
	);
}
