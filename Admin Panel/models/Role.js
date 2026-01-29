const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        role_name: { type: String, required: true, unique: true },
        is_active: { type: Boolean, default: true },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users" // referring to User model
        }
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

class Role extends mongoose.Model { }

schema.loadClass(Role);
module.exports = mongoose.model("roles", schema);
