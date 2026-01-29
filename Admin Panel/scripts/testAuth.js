require("dotenv").config();
const mongoose = require("mongoose");
// const request = require("supertest");
// I will use built-in fetch or installing axios would be better, but let's stick to node's fetch (since Node 18+)
// Or I can just write a script that uses the models directly? No, I need to test endpoints.
// I'll install axios for testing script.

// Wait, I can just use a simple script with verify.
const axios = require("axios");

const BASE_URL = "http://localhost:3000";

const testAuth = async () => {
    try {
        console.log("Testing Registration...");
        const email = `test_auth_${Date.now()}@example.com`;
        const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, {
            email,
            password: "password123",
            first_name: "Auth",
            last_name: "Tester"
        });
        console.log("Register Response:", registerRes.data);

        console.log("Testing Login...");
        const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
            email,
            password: "password123"
        });
        console.log("Login Response:", loginRes.data);
        const token = loginRes.data.data.token;

        if (!token) throw new Error("Token not received");

        console.log("Auth Flow Verified Successfully!");

    } catch (err) {
        console.error("Test Failed:", err.response ? JSON.stringify(err.response.data) : err);
    }
};

// I need to make sure server is running. I will run server in background and then run this script.
// Or I can assume user is running it? No, I should run it.

testAuth();
