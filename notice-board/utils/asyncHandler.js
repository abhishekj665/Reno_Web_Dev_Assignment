import { globalErrorHandler } from "./globalErrorhandler";
export const asyncHandler = (fn) => {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (err) {
            globalErrorHandler(err, req, res);
        }
    };
};