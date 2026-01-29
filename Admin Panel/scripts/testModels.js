require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const UserRoles = require("../models/UserRoles");
const RolePrivileges = require("../models/RolePrivileges");
const Categories = require("../models/Categories");
const AuditLogs = require("../models/AuditLogs");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected for Testing");
    } catch (err) {
        console.error("DB Connection Failed", err);
        process.exit(1);
    }
};

const testModels = async () => {
    await connectDB();

    try {
        // Create User
        const user = await User.create({
            email: "test@example.com",
            password: "hashedpassword",
            first_name: "Test",
            last_name: "User"
        });
        console.log("User Created:", user._id);

        // Create Role
        const role = await Role.create({
            role_name: "Admin",
            created_by: user._id
        });
        console.log("Role Created:", role._id);

        // Assign Role to User
        const userRole = await UserRoles.create({
            user_id: user._id,
            role_id: role._id
        });
        console.log("UserRole Created:", userRole._id);

        // Add Privilege to Role
        const privilege = await RolePrivileges.create({
            role_id: role._id,
            permission: "manage_users",
            created_by: user._id
        });
        console.log("RolePrivilege Created:", privilege._id);

        // Create Category
        const category = await Categories.create({
            name: "Electronics",
            created_by: user._id
        });
        console.log("Category Created:", category._id);

        // Create Audit Log
        const log = await AuditLogs.create({
            level: "INFO",
            email: user.email,
            location: "127.0.0.1",
            proc_type: "CREATE_USER",
            log: { userId: user._id }
        });
        console.log("AuditLog Created:", log._id);

        console.log("All Models Verified Successfully!");

    } catch (err) {
        console.error("Model Verification Failed:", err);
    } finally {
        await mongoose.connection.dropDatabase(); // Cleanup
        await mongoose.connection.close();
    }
};

testModels();
