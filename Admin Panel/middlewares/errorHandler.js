const CustomError = require("../lib/CustomError");
const Response = require("../lib/Response");

module.exports = (err, req, res, next) => {
    console.error(err); // Log to console for dev

    if (err instanceof CustomError) {
        return res.status(err.code || 500).json(Response.errorResponse(err));
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        return res.status(400).json(Response.errorResponse(new CustomError(400, "Validation Error", err.message)));
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        return res.status(409).json(Response.errorResponse(new CustomError(409, "Duplicate Key Error", "Entry already exists")));
    }

    // Fallback
    res.status(500).json(Response.errorResponse(new CustomError(500, "Internal Server Error", err.message)));
};
