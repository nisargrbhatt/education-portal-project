const express = require("express");

const classroomControllers = require("../controllers/classroom");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/create", classroomControllers.createClassroom);
router.put("/update/:id", checkAuth, classroomControllers.updateClassroom);
router.put("/assignfaculty", classroomControllers.assignFaculty);
router.put("/unassignfaculty", classroomControllers.unassignFaculty);
router.put("/enrollstudent", checkAuth, classroomControllers.enrollStudent);
router.put(
  "/unenrollstudent/:id",
  checkAuth,
  classroomControllers.unenrollStudent
);
router.put("/addattendance", checkAuth, classroomControllers.addAttendance);
router.put("/schedulelecture", checkAuth, classroomControllers.scheduleLecture);
router.put(
  "/unschedulelecture",
  checkAuth,
  classroomControllers.unscheduleLecture
);
router.put(
  "/addnotification/:id",
  checkAuth,
  classroomControllers.addNotification
);
router.put(
  "/deletenotification/:id",
  checkAuth,
  classroomControllers.deleteNotification
);
router.get(
  "/classroomfaculty/:id",
  checkAuth,
  classroomControllers.getClassroomFaculty
);
router.get(
  "/classroomstudent/:department/:semester",
  checkAuth,
  classroomControllers.getClassroomStudent
);
router.get("/getclassroom/:id", checkAuth, classroomControllers.getClassroom);
router.get("/getlecture/:id", checkAuth, classroomControllers.getLecture);
router.get(
  "/getnotification/:id",
  checkAuth,
  classroomControllers.getNotification
);
router.put("/addsubmission/:id", checkAuth, classroomControllers.addSubmission);
router.put(
  "/clearsubmission/:id",
  checkAuth,
  classroomControllers.clearSubmission
);
module.exports = router;
