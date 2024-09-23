import React, { useState } from "react";

// Base62 character set
const base62chars =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Convert hex string to Base62 (no length restriction)
function hexToBase62(hexString) {
	let decimalValue = BigInt("0x" + hexString); // Convert hex to BigInt
	let base62String = "";
	while (decimalValue > 0) {
		base62String = base62chars[decimalValue % 62n] + base62String; // Convert to Base62
		decimalValue = decimalValue / 62n;
	}
	return base62String; // Return full Base62 string
}

// Convert Base62 string back to hex
function base62ToHex(base62String) {
	let decimalValue = BigInt(0);
	for (let i = 0; i < base62String.length; i++) {
		decimalValue =
			decimalValue * 62n + BigInt(base62chars.indexOf(base62String[i]));
	}
	return decimalValue.toString(16).toUpperCase();
}

const EncoderDecoder = () => {
	const [hexInput, setHexInput] = useState(""); // Input for hexadecimal
	const [encoded, setEncoded] = useState(""); // Encoded Base62 output
	const [decoded, setDecoded] = useState(""); // Decoded Hex output
	const [base62Input, setBase62Input] = useState(""); // Input for decoding from Base62

	// Handle Encode button click
	const handleEncode = () => {
		try {
			const result = hexToBase62(hexInput);
			setEncoded(result);
		} catch (error) {
			alert("Invalid hexadecimal input");
		}
	};

	// Handle Decode button click
	const handleDecode = () => {
		try {
			const result = base62ToHex(base62Input);
			setDecoded(result);
		} catch (error) {
			alert("Invalid Base62 input");
		}
	};

	return (
		<div style={{ padding: "20px", fontFamily: "Arial" }}>
			<h2>Hex to Base62 Encoder/Decoder</h2>

			<div style={{ marginBottom: "20px" }}>
				<h3>Encode Hex to Base62</h3>
				<input
					type="text"
					value={hexInput}
					className="text-black"
					onChange={(e) => setHexInput(e.target.value)}
					placeholder="Enter Hex String"
					style={{ padding: "10px", width: "300px", marginRight: "10px" }}
				/>
				<button onClick={handleEncode} style={{ padding: "10px" }}>
					Encode
				</button>
				<p>
					Encoded (Base62): <strong>{encoded}</strong>
				</p>
			</div>

			<div>
				<h3>Decode Base62 to Hex</h3>
				<input
					type="text"
					value={base62Input}
					className="text-black"
					onChange={(e) => setBase62Input(e.target.value)}
					placeholder="Enter Base62 String"
					style={{ padding: "10px", width: "300px", marginRight: "10px" }}
				/>
				<button onClick={handleDecode} style={{ padding: "10px" }}>
					Decode
				</button>
				<p>
					Decoded (Hex): <strong>{decoded}</strong>
				</p>
			</div>
		</div>
	);
};

export default EncoderDecoder;
