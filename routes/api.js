const router = require("express").Router();

const { route } = require(".");
// controller
const apiController = require("../controllers/apiController");
const { uploadSingle } = require("../middlewares/multer");

// routing
router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailPage);
router.post("/booking-page", uploadSingle, apiController.bookingPage);

module.exports = router;
