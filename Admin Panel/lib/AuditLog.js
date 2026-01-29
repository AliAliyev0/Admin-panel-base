const AuditLogs = require("../models/AuditLogs");
// const Enum = require("../config/Enum");
// User didn't ask for generic Enum file but it's good practice. I'll stick to strings for now as per plan logic.

class AuditLog {
    constructor() {
        if (!AuditLog.instance) {
            AuditLog.instance = this;
        }
        return AuditLog.instance;
    }

    info(email, location, proc_type, log) {
        this.#saveToDB("INFO", email, location, proc_type, log);
    }

    error(email, location, proc_type, log) {
        this.#saveToDB("ERROR", email, location, proc_type, log);
    }

    warn(email, location, proc_type, log) {
        this.#saveToDB("WARN", email, location, proc_type, log);
    }

    async #saveToDB(level, email, location, proc_type, log) {
        try {
            await AuditLogs.create({
                level,
                email,
                location,
                proc_type,
                log
            });
        } catch (err) {
            console.error("AuditLog Error:", err);
        }
    }
}

module.exports = new AuditLog();
