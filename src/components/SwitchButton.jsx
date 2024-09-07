import React, { useState } from "react";
// Make sure to include your CSS file
import "../index.css";

const SwitchButton = ({ onClick, ...props }) => {
	const [isChecked, setIsChecked] = useState(false);

	const handleClick = () => {
		setIsChecked(!isChecked);
		if (onClick) {
			onClick(!isChecked);
		}
	};

	return (
		<label className="switch-button" {...props} onClick={handleClick}>
			<div className="switch-outer">
				<input type="checkbox" checked={isChecked} readOnly />
				<div className="button">
					<span className="button-toggle"></span>
					<span className="button-indicator"></span>
				</div>
			</div>
		</label>
	);
};

export default SwitchButton;
