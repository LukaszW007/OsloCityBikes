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

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err);
	return res.status(HTTP_SERVER_ERROR).send({ errors: [{ message: "Something went wrong" }] });
};

export const apiKeyChecker = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers["x-api-key"];
	if (apiKey === process.env.CRON_JOB_API_KEY) {
		next(); // API key is valid, proceed to the route
	} else {
		console.log("Forbidden: Invalid API Key");
		res.status(403).send({ errors: [{ message: "Forbidden: Invalid API Key" }] });
	}
};

export const ipWhitelistMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const allowedIPs = ["116.203.134.67", "116.203.129.16", "23.88.105.37", "128.140.8.200"]; // Replace with actual IP range
	const clientIP: string = req.ip || "";
	if (allowedIPs.includes(clientIP)) {
		next(); // IP is allowed, proceed to the route
	} else {
		console.log("Forbidden: Unauthorized IP");
		res.status(403).send({ errors: [{ message: "Forbidden: Unauthorized IP" }] });
	}
};
