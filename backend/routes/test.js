const express = require("express");

const testControllers = require("../controllers/test");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/create", checkAuth, testControllers.createTest);
router.put("/update/:id", checkAuth, testControllers.updateTest);
router.delete("/delete/:id", checkAuth, testControllers.deleteTest);
router.put("/adduserresponse/:id", checkAuth, testControllers.addUserResponse);
router.get("/gettest/:id", checkAuth, testControllers.getTest);
router.get("/gettestids/:id", checkAuth, testControllers.getTestClassid);

module.exports = router;
