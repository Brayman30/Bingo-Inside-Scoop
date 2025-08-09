import { clsx } from "clsx";
import { forwardRef } from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ className, error, ...props },
	ref,
) {
	return (
		<input
			ref={ref}
			className={clsx(
				"w-full rounded-md border bg-white/70 backdrop-blur-sm px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-grayson-gold/60 focus:border-grayson-gold/70 placeholder:text-grayson-navy/40",
				"border-border-subtle/60",
				error && "border-red-400 focus:ring-red-400/40 focus:border-red-500",
				className,
			)}
			{...props}
		/>
	);
});
