import { info } from "./logger.js";
export const requestLogger = (request, response, next) => {
    info("This is Request Logger:", "");
    info("Method:", request.method);
    info("Path:  ", request.path);
    info("Body:  ", request.body);
    info("Params:", request.params);
    info("---", "");
    next();
};
export const unknownEndpoint = (request, response) => {
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
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    return res.status(HTTP_SERVER_ERROR).send({ errors: [{ message: "Something went wrong" }] });
};
export const apiKeyChecker = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    console.log("API Key: ", apiKey);
    if (apiKey === process.env.CRON_JOB_API_KEY) {
        next(); // API key is valid, proceed to the route
    }
    else {
        console.log("Forbidden: Invalid API Key");
        res.status(403).send({ errors: [{ message: "Forbidden: Invalid API Key" }] });
    }
};
export const ipWhitelistMiddleware = (req, res, next) => {
    const allowedIPs = ["116.203.134.67", "116.203.129.16", "23.88.105.37", "128.140.8.200"]; // Replace with actual IP range
    const clientIP = (req.headers["x-forwarded-for"] || "").split(",").shift()?.trim() || req.socket.remoteAddress || "";
    const actualClientIP = clientIP.includes("::ffff:") ? clientIP.split("::ffff:")[1] : clientIP;
    console.log("clientIP: ", clientIP);
    console.log("clientIP: ", actualClientIP);
    if (allowedIPs.includes(actualClientIP)) {
        next(); // IP is allowed, proceed to the route
    }
    else {
        console.log("Forbidden: Unauthorized IP");
        res.status(403).send({ errors: [{ message: "Forbidden: Unauthorized IP" }] });
    }
};
