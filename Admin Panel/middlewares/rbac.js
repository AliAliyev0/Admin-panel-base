const UserRoles = require("../models/UserRoles");
const RolePrivileges = require("../models/RolePrivileges");
const CustomError = require("../lib/CustomError");
const Response = require("../lib/Response");

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json(Response.errorResponse(new CustomError(401, "User not authenticated")));
            }

            const userId = req.user.id; // from auth middleware

            // 1. Get User's Roles
            const userRoles = await UserRoles.find({ user_id: userId });
            const roleIds = userRoles.map(ur => ur.role_id);

            // 2. Check Privileges for these roles
            const privileges = await RolePrivileges.find({
                role_id: { $in: roleIds },
                permission: requiredPermission
            });

            if (privileges.length > 0) {
                next();
            } else {
                return res.status(403).json(Response.errorResponse(new CustomError(403, "Access Denied: Insufficient Permissions")));
            }

        } catch (err) {
            console.error("RBAC Error:", err);
            return res.status(500).json(Response.errorResponse(new CustomError(500, "Internal Server Error")));
        }
    }
}

module.exports = checkPermission;
