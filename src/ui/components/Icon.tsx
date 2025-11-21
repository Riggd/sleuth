import React from 'react';

interface IconProps {
	size?: number;
	svg: 'plugma' | 'plus' | 'visible' | 'hidden' | 'color' | 'number' | 'string' | 'boolean';
}

const Icon: React.FC<IconProps> = ({ size = 16, svg }) => {
	if (svg === 'plugma') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clipPath="url(#clip0_1508_4907)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4.8 0C2.14903 0 0 2.14903 0 4.8V19.2C0 21.8509 2.14903 24 4.8 24H19.2C21.8509 24 24 21.8509 24 19.2V4.8C24 2.14903 21.8509 0 19.2 0H4.8ZM4.8 14.4H8.4C9.06274 14.4 9.6 14.9372 9.6 15.6V16.8C9.6 17.4628 9.06274 18 8.4 18H4.8C4.13726 18 3.6 17.4628 3.6 16.8V15.6C3.6 14.9372 4.13726 14.4 4.8 14.4ZM19.2 14.4H15.6C14.9372 14.4 14.4 14.9372 14.4 15.6V16.8C14.4 17.4628 14.9372 18 15.6 18H19.2C19.8628 18 20.4 17.4628 20.4 16.8V15.6C20.4 14.9372 19.8628 14.4 19.2 14.4ZM11.4 4.8H12.6C13.2628 4.8 13.8 5.33726 13.8 6V9.6C13.8 10.2628 13.2628 10.8 12.6 10.8H11.4C10.7372 10.8 10.2 10.2628 10.2 9.6V6C10.2 5.33726 10.7372 4.8 11.4 4.8Z"
						fill="currentColor"
					/>
				</g>
				<defs>
					<clipPath id="clip0_1508_4907">
						<rect width="24" height="24" fill="white" />
					</clipPath>
				</defs>
			</svg>
		);
	}



	if (svg === 'visible') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 5C7.5 5 3.7 8.1 2 12C3.7 15.9 7.5 19 12 19C16.5 19 20.3 15.9 22 12C20.3 8.1 16.5 5 12 5ZM12 17C9.2 17 7 14.8 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17ZM12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (svg === 'hidden') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7.5 19.5 3.7 16.4 2 12.5C2.5 11.3 3.2 10.2 4 9.2L2 5.27ZM12 7.5C13.6 7.5 15 8.9 15 10.5C15 10.8 14.9 11.1 14.8 11.4L10.1 6.7C10.7 6.2 11.3 6 12 6V7.5ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.77 9 12C9 13.7 10.3 15 12 15C12.2 15 12.4 14.9 12.6 14.9L14.2 16.5C13.5 16.8 12.8 17 12 17C9.2 17 7 14.8 7 12C7 11.2 7.2 10.5 7.53 9.8ZM19.6 14.9L21.2 16.5C21.7 15.1 22 13.6 22 12C20.3 8.1 16.5 5 12 5C11.2 5 10.4 5.1 9.7 5.3L11.9 7.5C11.9 7.5 12 7.5 12 7.5C14.8 7.5 17 9.7 17 12.5C17 12.5 17 12.6 17 12.6L19.6 14.9Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (svg === 'plus') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g opacity="0.3">
					<path d="M12 5V19Z" fill="white" />
					<path
						d="M12 5V19"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeMiterlimit="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path d="M19 12H5Z" fill="white" />
					<path
						d="M19 12H5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeMiterlimit="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
			</svg>
		);
	}

	if (svg === 'color') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20C14 21.1046 13.1046 22 12 22Z"
					fill="currentColor"
				/>
				<path
					d="M7 17C5.89543 17 5 16.1046 5 15C5 13.8954 5.89543 13 7 13C8.10457 13 9 13.8954 9 15C9 16.1046 8.10457 17 7 17Z"
					fill="currentColor"
				/>
				<path
					d="M8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7C10 8.10457 9.10457 9 8 9Z"
					fill="currentColor"
				/>
				<path
					d="M16 9C14.8954 9 14 8.10457 14 7C14 5.89543 14.8954 5 16 5C17.1046 5 18 5.89543 18 7C18 8.10457 17.1046 9 16 9Z"
					fill="currentColor"
				/>
			</svg>
		);
	}

	if (svg === 'number') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M10 3L8 21"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M16 3L14 21"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M3.5 9H21.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2.5 15H20.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	if (svg === 'string') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4 7V4H20V7"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9 20H15"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M12 4V20"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	if (svg === 'boolean') {
		return (
			<svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="2" y="6" width="20" height="12" rx="6" stroke="currentColor" strokeWidth="1.5" />
				<circle cx="8" cy="12" r="3" fill="currentColor" />
			</svg>
		);
	}

	return null; // Return nothing if `svg` does not match any case
};

export default Icon;
