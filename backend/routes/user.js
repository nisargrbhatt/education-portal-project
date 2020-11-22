const express = require("express");

const userControllers = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/signup", userControllers.createUser);
router.put(
  "/changeprofile/:id",
  checkAuth,
  extractFile,
  userControllers.changeProfile
);
router.put("/setupuser/:id", checkAuth, extractFile, userControllers.setupUser);
router.put(
  "/setprofilephoto/:id",
  checkAuth,
  extractFile,
  userControllers.setProfilePhoto
);
router.put("/addsubject/:id", checkAuth, userControllers.addSubject);
router.put("/clearsubject/:id", checkAuth, userControllers.clearSubject);
router.put("/clearallsubject/:id", checkAuth, userControllers.clearAllSubject);
router.put("/changepassword", checkAuth, userControllers.passwordChange);
router.post("/login", userControllers.userLogin);
router.get("/getprofile", checkAuth, userControllers.getProfile);

module.exports = router;
