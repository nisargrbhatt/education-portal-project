const express = require("express");

const submissionControllers = require("../controllers/submission");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file-pdf");

const router = express.Router();

router.post("/create", checkAuth, submissionControllers.createSubmission);
router.put("/update/:id", checkAuth, submissionControllers.updateSubmission);
router.delete("/delete/:id", checkAuth, submissionControllers.deleteSubmission);
router.put(
  "/uploadsubmission/:id",
  checkAuth,
  extractFile,
  submissionControllers.uploadSubmission
);
router.put(
  "/deletesubmission/:id",
  checkAuth,
  submissionControllers.deleteUpload
);
router.get(
  "/getsubmission/:id",
  checkAuth,
  submissionControllers.getSubmission
);
router.get(
  "/getsubmissionf/:id",
  checkAuth,
  submissionControllers.getSubmissionUpload
);
router.get(
  "/getsubmissionids/:id",
  checkAuth,
  submissionControllers.getSubmissionClassid
);

module.exports = router;
