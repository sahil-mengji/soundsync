import React from "react";
import { useNavigate, useParams } from "react-router";

export default function Home() {
	const navigate = useNavigate();
	const { peerId } = useParams();
	return (
		<>
			<p className="text-white text-3xl font-bold orbitron w-full">
				Select Mode
			</p>
			<p className="text-[#ffffffbb] text-lg  w-full  font-thin  mt-4">
				Choose whether you want to host a session or join an existing one.
			</p>

			<div className="w-full mt-8 flex gap-4">
				<div
					onClick={() => navigate("/host")}
					className=" flex-1 cursor-pointer flex justify-center flex-col bg-[#1c1c1e] hover:bg-[#323235] transition-[200ms] p-8 gap-2  items-center rounded-2xl "
				>
					<img src="monitor-speaker.svg" className="w-8 h-8" alt="" />
					<h3 className="text-2xl font-semibold text-white"> Host Mode</h3>
					<p className="text-sm  text-[#98989F] text-center">
						As a host, you can share your audio with connected devices.
					</p>
				</div>
				<div
					onClick={() => navigate(`/peer?peerId=${peerId}`)}
					className="py-8 flex-1 cursor-pointer flex justify-center flex-col bg-[#1c1c1e] hover:bg-[#323235] transition-[200ms] p-8  gap-2 items-center rounded-2xl "
				>
					<img src="screen-share.svg" className="w-8 h-8" alt="" />
					<h3 className="text-2xl font-semibold text-white"> Peer Mode</h3>
					<p className="text-sm  text-[#98989F] text-center">
						As a peer, you can connect to a host and listen to the shared audio.
					</p>
				</div>
			</div>
		</>
	);
}
