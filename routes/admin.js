const router = require("express").Router();

const { route } = require(".");
// controller
const adminController = require("../controllers/adminController");
const { upload } = require("../middlewares/multer");

// routing
// dashobard
router.get("/dashboard", adminController.viewDashboard);

// endpoint category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// endpoint bank
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

// item
router.get("/item", adminController.viewItem);

// booking
router.get("/booking", adminController.viewBooking);

module.exports = router;
