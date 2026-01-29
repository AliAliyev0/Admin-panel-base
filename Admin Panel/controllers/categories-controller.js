const Categories = require("../models/Categories");
const CustomError = require("../lib/CustomError");
const Response = require("../lib/Response");
const AuditLog = require("../lib/AuditLog");

class CategoriesController {
    async getAll(req, res, next) {
        try {
            const categories = await Categories.find({});
            res.json(Response.successResponse(categories));
        } catch (err) {
            next(err);
        }
    }

    async add(req, res, next) {
        const { name } = req.body;
        try {
            const category = await Categories.create({
                name,
                created_by: req.user.id
            });

            AuditLog.info(req.user.email, "Categories", "Add", category);

            res.status(201).json(Response.successResponse(category, 201));
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { name, is_active } = req.body;

        try {
            const category = await Categories.findByIdAndUpdate(id, { name, is_active }, { new: true });

            if (!category) throw new CustomError(404, "Category not found");

            AuditLog.info(req.user.email, "Categories", "Update", category);

            res.json(Response.successResponse(category));
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const category = await Categories.findByIdAndDelete(id);

            if (!category) throw new CustomError(404, "Category not found");

            AuditLog.info(req.user.email, "Categories", "Delete", { _id: id });

            res.json(Response.successResponse({ deleted: true }));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CategoriesController();
