import React, { useEffect, useState } from "react";

export enum snackbarTypeEnum {
	info = "INFO",
	error = "ERROR",
}
interface ISnackbarProps {
	snackbarText: string;
	snackbarType: snackbarTypeEnum;
}

export function Snackbar(props: ISnackbarProps) {
	const [snackbarText, setSnackbarText] = useState(props.snackbarText);
	const [snackbarType, setSnackbarType] = useState(props.snackbarType);
	// const [isVisible, setIsVisible] = useState(true)

	// useEffect(()=> {

	// },[isVisible])
	switch (props.snackbarType) {
		case snackbarTypeEnum.info: {
			setSnackbarType(snackbarTypeEnum.info);
			break;
		}
		case snackbarTypeEnum.error: {
			setSnackbarType(snackbarTypeEnum.error);
			break;
		}
	}

	const colorVariants = {
		INFO: "fixed bottom-4 end-4 z-50 flex items-center justify-center gap-4 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 text-white",
		ERROR: "fixed bottom-4 end-4 z-50 flex items-center justify-center gap-4 rounded-lg bg-red-600 hover:bg-red-500 px-5 py-3 text-white",
	};
	return (
		<aside className={`${colorVariants[snackbarType]} ...`}>
			<a
				href="#"
				target="_blank"
				rel="noreferrer"
				className="text-sm font-medium hover:opacity-75"
			>
				{snackbarText}
			</a>

			<button className="rounded bg-white/20 p-1 hover:bg-white/10">
				<span className="sr-only">Close</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="size-4"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</aside>
	);
}
