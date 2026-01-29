const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../lib/CustomError");
const Response = require("../lib/Response");

class AuthController {
    async register(req, res) {
        const { email, password, first_name, last_name, phone_number } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json(Response.errorResponse(new CustomError(400, "Email already exists")));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                email,
                password: hashedPassword,
                first_name,
                last_name,
                phone_number
            });

            res.status(201).json(Response.successResponse({ user_id: user._id }, 201));

        } catch (err) {
            console.error(err);
            res.status(500).json(Response.errorResponse(err));
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json(Response.errorResponse(new CustomError(401, "Invalid credentials")));
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json(Response.errorResponse(new CustomError(401, "Invalid credentials")));
            }

            if (!user.is_active) {
                return res.status(403).json(Response.errorResponse(new CustomError(403, "User is not active")));
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY }
            );

            res.json(Response.successResponse({ token, user }));

        } catch (err) {
            console.error(err);
            res.status(500).json(Response.errorResponse(err));
        }
    }
}

module.exports = new AuthController();
