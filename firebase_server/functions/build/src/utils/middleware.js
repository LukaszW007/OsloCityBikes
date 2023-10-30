/* eslint-disable max-len */
import { info } from './logger.js'; //.js file extensions are now allowed
export const requestLogger = (request, response, next) => {
    info('Method:', request.method);
    info('Path:  ', request.path);
    info('Body:  ', request.body);
    info('Params:', request.params);
    info('---', '');
    next();
};
export const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
export const errorHandler = (error, request, response, next) => {
    error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};
