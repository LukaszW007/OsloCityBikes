import { info, error } from "./logger.js";
import express, { NextFunction, Request, Response } from "express";

export const requestLogger = (request: any, response: any, next: any) => {
	info("This is Request Logger:", "");
	info("Method:", request.method);
	info("Path:  ", request.path);
	info("Body:  ", request.body);
	info("Params:", request.params);
	info("---", "");
	next();
};

export const unknownEndpoint = (request: any, response: any) => {
	response.status(404).send({ error: "unknown endpoint" });
};

// export const errorHandler = (
// 	error: any,
// 	request: any,
// 	response: any,
// 	next: any
// ) => {
// 	error(error.message);

// 	if (error.name === "CastError") {
// 		return response.status(400).send({ error: "malformatted id" });
// 	} else if (error.name === "ValidationError") {
// 		return response.status(400).json({ error: error.message });
// 	}

// 	next(error);
// };

const HTTP_SERVER_ERROR = 500;

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err);
	return res
		.status(HTTP_SERVER_ERROR)
		.send({ errors: [{ message: "Something went wrong" }] });
};
