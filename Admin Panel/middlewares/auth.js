const jwt = require("jsonwebtoken");
const CustomError = require("../lib/CustomError");
const Response = require("../lib/Response");
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json(Response.errorResponse(new CustomError(401, "No token provided")));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json(Response.errorResponse(new CustomError(401, "Invalid Token")));
        }
        req.user = decoded;
        next();
    });
};

module.exports = auth;
