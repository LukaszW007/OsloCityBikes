export const info = (...params: [string, any]) => {
	if (process.env.NODE_ENV !== 'test') {
		console.log(...params)
	}
}

export const error = (...params: [string, any]) => {
	if (process.env.NODE_ENV !== 'test') {
		console.log(...params)
	}
}
