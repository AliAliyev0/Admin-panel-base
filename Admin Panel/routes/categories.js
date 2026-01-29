const router = require("express").Router();
const CategoriesController = require("../controllers/categories-controller");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

router.use(auth); // All routes require auth

router.get("/", checkPermission("category_view"), CategoriesController.getAll);
router.post("/", checkPermission("category_add"), CategoriesController.add);
router.put("/:id", checkPermission("category_update"), CategoriesController.update);
router.delete("/:id", checkPermission("category_delete"), CategoriesController.delete);

module.exports = router;
