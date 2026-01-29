const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const UserRoles = require("../models/UserRoles");
const RolePrivileges = require("../models/RolePrivileges");
require("dotenv").config();

const BASE_URL = "http://localhost:3000";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
    } catch (err) {
        console.error("DB Connection Failed", err);
        process.exit(1);
    }
};

const setupData = async () => {
    // Clear Data
    await User.deleteMany({});
    await Role.deleteMany({});
    await UserRoles.deleteMany({});
    await RolePrivileges.deleteMany({});

    // Create Admin User
    const user = await User.create({
        email: "admin@example.com",
        password: "$2b$10$hashedpassword", // Mock hash
        first_name: "Admin",
        last_name: "User"
    });

    // Create Role
    const role = await Role.create({
        role_name: "SuperAdmin",
        created_by: user._id
    });

    // Assign Role
    await UserRoles.create({
        user_id: user._id,
        role_id: role._id
    });

    // Assign Privileges
    await RolePrivileges.create({ role_id: role._id, permission: "category_add" });
    await RolePrivileges.create({ role_id: role._id, permission: "category_update" });
    await RolePrivileges.create({ role_id: role._id, permission: "category_delete" });
    await RolePrivileges.create({ role_id: role._id, permission: "category_view" });

    // Login to get token (Real login needs real password hash match, let's use the real register flow or a helper)
    // Actually, I can just create a "login" manually by generating token if I import jwt.
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
};

const testCategories = async () => {
    await connectDB();
    const token = await setupData();
    const headers = { Authorization: `Bearer ${token}` };

    try {
        console.log("1. Add Category");
        const addRes = await axios.post(`${BASE_URL}/api/categories`, { name: "Test Category" }, { headers });
        console.log("Add Result:", addRes.data);
        const catId = addRes.data.data._id;

        console.log("2. Get Categories");
        const getRes = await axios.get(`${BASE_URL}/api/categories`, { headers });
        console.log("Get Result:", getRes.data.data.length > 0 ? "Success" : "Empty");

        console.log("3. Update Category");
        const updateRes = await axios.put(`${BASE_URL}/api/categories/${catId}`, { name: "Updated Category" }, { headers });
        console.log("Update Result:", updateRes.data.data.name);

        console.log("4. Delete Category");
        const deleteRes = await axios.delete(`${BASE_URL}/api/categories/${catId}`, { headers });
        console.log("Delete Result:", deleteRes.data);

        console.log("5. Audit Log Validation (Manual Check req)");
        // Could query AuditLogs here to verify
        const AuditLogs = require("../models/AuditLogs");
        const logs = await AuditLogs.find({ email: "admin@example.com" });
        console.log("Audit Logs found:", logs.length);
        if (logs.length >= 3) console.log("Audit Logging Verified!");

    } catch (err) {
        console.error("Test Failed:", err.response ? JSON.stringify(err.response.data) : err);
    } finally {
        await mongoose.connection.close();
    }
};

testCategories();
