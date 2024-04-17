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
    return res
        .status(HTTP_SERVER_ERROR)
        .send({ errors: [{ message: "Something went wrong" }] });
};
