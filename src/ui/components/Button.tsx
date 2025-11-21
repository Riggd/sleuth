const Button = ({
	children,
	href,
	target,
	className,
	onClick,
}: {
	children: React.ReactNode;
	href?: string;
	target?: string;
	className?: string;
	onClick?: () => void;
}) => {
	const combinedClassName = `btn ${className || ''}`.trim();

	if (href) {
		return (
			<a href={href} target={target} className={combinedClassName} onClick={onClick}>
				{children}
			</a>
		);
	}

	return (
		<button className={combinedClassName} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
