const { v4: uuidv4 } = require("uuid");

const Classroom = require("../models/classroom");

exports.createClassroom = (req, res, next) => {
  const classroomData = new Classroom({
    subject_name: req.body.subject_name,
    subject_code: req.body.subject_code,
    department: req.body.department,
    semester: req.body.semester,
    uuid: uuidv4(),
  });
  classroomData
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Classroom Created Successfully!",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't create Classroom",
      });
    });
};

exports.updateClassroom = (req, res, next) => {
  Classroom.updateOne(
    {
      _id: req.params.id,
      faculty: req.userDataA.userId,
    },
    {
      subject_name: req.body.subject_name,
      subject_code: req.body.subject_code,
      department: req.body.department,
      semester: req.body.semester,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Classroom updated Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't update Classroom!!!",
      });
    });
};
exports.assignFaculty = (req, res, next) => {
  Classroom.updateOne(
    {
      _id: req.body.classId,
    },
    {
      faculty: req.body.assignId,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Faculty Assigned Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't assign faculty!!!",
      });
    });
};
exports.unassignFaculty = (req, res, next) => {
  Classroom.updateOne(
    {
      _id: req.body.classId,
      faculty: req.userDataA.userId,
    },
    {
      faculty: null,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Faculty Unassigned Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't unassign faculty!!!",
      });
    });
};

exports.enrollStudent = (req, res, next) => {
  let studentData;
  let classId;
  Classroom.findOne({
    subject_name: req.body.subject_name,
    subject_code: req.body.subject_code,
  })
    .then((classroom) => {
      classId = classroom._id;
      if (!classroom.student_enrolled) {
        studentData = [
          {
            name: req.body.name,
            _id: req.body.studentId,
            enrollment_no: req.body.enrollment_no,
          },
        ];
      } else {
        studentData = classroom.student_enrolled;
        studentData.push({
          name: req.body.name,
          _id: req.body.studentId,
          enrollment_no: req.body.enrollment_no,
        });
      }
    })
    .then(() => {
      Classroom.updateOne(
        {
          subject_name: req.body.subject_name,
          subject_code: req.body.subject_code,
        },
        {
          student_enrolled: studentData,
        }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(200).json({
              message: "Student Enrolled Successfully!",
              classId: classId,
            });
          } else {
            res.status(401).json({
              message: "Not Authorized",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            message: "Couldn't enroll Student!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't enroll Student!!!",
      });
    });
};

exports.unenrollStudent = (req, res, next) => {
  let studentData;
  let classId;

  Classroom.findOne({ _id: req.params.id })
    .then((classroom) => {
      classId = classroom._id;
      if (!classroom) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      studentData = classroom.student_enrolled;
    })
    .then(() => {
      return studentData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(req.body);
      });
    })
    .then((index) => {
      console.log(index);
      if (index > -1) {
        studentData.splice(index, 1);
        Classroom.updateOne(
          {
            _id: req.params.id,
          },
          {
            student_enrolled: studentData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Unenrolled student Successfully!",
                classId: classId,
              });
            } else {
              res.status(401).json({
                message: "Not Authorized",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              message: "Couldn't unenroll student",
            });
          });
      } else {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't unenroll student",
      });
    });
};

exports.addAttendance = (req, res, next) => {
  let attendanceData;
  Classroom.findOne({
    subject_name: req.body.subject_name,
    subject_code: req.body.subject_code,
  })
    .then((classroom) => {
      if (!classroom.attendance_report) {
        attendanceData = [
          {
            date: req.body.date,
            attendee: req.body.attendee,
          },
        ];
      } else {
        attendanceData = classroom.attendance_report;
        attendanceData.push({
          date: req.body.date,
          attendee: req.body.attendee,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't add Attendance!!!",
      });
    });
  Classroom.updateOne(
    {
      subject_name: req.body.subject_name,
      subject_code: req.body.subject_code,
      faculty: req.userDataA.userId,
    },
    {
      attendance_report: attendanceData,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Attendance added Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't add Attendance!!!",
      });
    });
};

exports.scheduleLecture = (req, res, next) => {
  Classroom.updateOne(
    {
      _id: req.body.classId,
      subject_code: req.body.subject_code,
      faculty: req.userDataA.userId,
    },
    {
      scheduled_lecture: req.body.scheduled_lecture,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Lecture scheduled Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't schedule Lecture!!!",
      });
    });
};

exports.unscheduleLecture = (req, res, next) => {
  Classroom.updateOne(
    {
      _id: req.body.classId,
      subject_code: req.body.subject_code,
      faculty: req.userDataA.userId,
    },
    {
      scheduled_lecture: null,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Lecture unscheduled Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't unschedule Lecture!!!",
      });
    });
};

exports.addNotification = (req, res, next) => {
  let notificationData;
  Classroom.findOne({
    _id: req.params.id,
    subject_code: req.body.subject_code,
  })
    .then((classroom) => {
      if (!classroom.notifications) {
        notificationData = [
          {
            date: req.body.date,
            content: req.body.content,
          },
        ];
      } else {
        notificationData = classroom.notifications;
        notificationData.push({
          date: req.body.date,
          content: req.body.content,
        });
      }
    })
    .then(() => {
      Classroom.updateOne(
        {
          _id: req.params.id,
          subject_code: req.body.subject_code,
          faculty: req.userDataA.userId,
        },
        {
          notifications: notificationData,
        }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(200).json({
              message: "Notification added Successfully!",
            });
          } else {
            res.status(401).json({
              message: "Not Authorized",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            message: "Couldn't add notification!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't add Notification",
      });
    });
};

exports.deleteNotification = (req, res, next) => {
  let notificationData;
  Classroom.findOne({ _id: req.params.id })
    .then((classroom) => {
      if (!classroom) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      notificationData = classroom.notifications;
    })
    .then(() => {
      return notificationData.findIndex((data) => {
        if (
          JSON.stringify(data.date) == JSON.stringify(checkNoti.date) &&
          data.content == checkNoti.content
        ) {
          return true;
        } else {
          return false;
        }
      }, (checkNoti = req.body));
    })
    .then((index) => {
      if (index > -1) {
        notificationData.splice(index, 1);
        Classroom.updateOne(
          {
            _id: req.params.id,
            faculty: req.userDataA.userId,
          },
          {
            notifications: notificationData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Notification deleted Successfully!",
              });
            } else {
              res.status(401).json({
                message: "Not Authorized",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              message: "Couldn't delete notification",
            });
          });
      } else {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't delete notification",
      });
    });
};

exports.getClassroomFaculty = (req, res, next) => {
  Classroom.find({ faculty: req.params.id })
    .then((classrooms) => {
      res.status(200).json({
        message: "Classrooms fetched Successfully!",
        classroom: classrooms,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetched Classrooms!!!",
      });
    });
};

exports.getClassroomStudent = (req, res, next) => {
  Classroom.find({
    department: req.params.department,
    semester: req.params.semester,
  })
    .then((classrooms) => {
      res.status(200).json({
        message: "Classrooms fetched Successfully!",
        classroom: classrooms,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetched Classrooms!!!",
      });
    });
};

exports.getClassroom = (req, res, next) => {
  Classroom.findById(req.params.id)
    .then((classroom) => {
      res.status(200).json({
        message: "Classroom fetched Successfully!",
        classroom: classroom,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch classroom",
      });
    });
};

exports.getLecture = (req, res, next) => {
  Classroom.findById(req.params.id)
    .then((classroom) => {
      res.status(200).json({
        message: "Lecture Data fetched Successfully!",
        lecture: {
          subject_name: classroom.subject_name,
          timing: classroom.scheduled_lecture,
          join: classroom.uuid,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Lecture Data",
      });
    });
};

exports.getNotification = (req, res, next) => {
  Classroom.findById(req.params.id)
    .then((classroom) => {
      res.status(200).json({
        message: "Notification fetched Successfully!",
        subject_name: classroom.subject_name,
        notification: classroom.notifications,
        faculty: classroom.faculty,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Notification",
      });
    });
};

exports.addSubmission = (req, res, next) => {
  let subData;
  Classroom.findById(req.params.id)
    .then((classroom) => {
      if (!classroom) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      if (!classroom.submissions) {
        subData = [];
        subData.push(req.body.submission_id);
      } else {
        subData = classroom.submissions;
        subData.push(req.body.submission_id);
      }
    })
    .then(() => {
      Classroom.updateOne(
        { _id: req.params.id, faculty: req.userDataA.userId },
        { submissions: subData }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(201).json({
              message: "Submission Added Successfully!",
            });
          } else {
            res.status(401).json({
              message: "Not Authorized!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "Couldn't add Submission!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't add Submission!!!",
      });
    });
};

exports.clearSubmission = (req, res, next) => {
  let subData;
  Classroom.findById(req.params.id)
    .then((classroom) => {
      if (!classroom) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      subData = classroom.submissions;
    })
    .then(() => {
      const index = subData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(checkData);
      }, (checkData = req.body.submission_id));
      if (index > -1) {
        subData.splice(index, 1);
        Classroom.updateOne(
          {
            _id: req.params.id,
            faculty: req.userDataA.userId,
          },
          {
            submissions: subData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Submission cleared Successfully!",
              });
            } else {
              res.status(401).json({
                message: "Not Authorized",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              message: "Couldn't clear Submission!!!",
            });
          });
      } else {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't clear Submission!!!",
      });
    });
};

exports.addTest = (req, res, next) => {
  let subData;
  Classroom.findById(req.params.id)
    .then((classroom) => {
      if (!classroom) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      if (!classroom.tests) {
        subData = [];
        subData.push(req.body.test_id);
      } else {
        subData = classroom.tests;
        subData.push(req.body.test_id);
      }
    })
    .then(() => {
      Classroom.updateOne(
        { _id: req.params.id, faculty: req.userDataA.userId },
        { submissions: subData }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(201).json({
              message: "Submission Added Successfully!",
            });
          } else {
            res.status(401).json({
              message: "Not Authorized!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "Couldn't add Submission!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't add Submission!!!",
      });
    });
};

exports.clearTest = (req, res, next) => {
  let subData;
  Classroom.findById(req.params.id)
    .then((classroom) => {
      if (!classroom) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      subData = classroom.tests;
    })
    .then(() => {
      const index = subData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(checkData);
      }, (checkData = req.body.test_id));
      if (index > -1) {
        subData.splice(index, 1);
        Classroom.updateOne(
          {
            _id: req.params.id,
            faculty: req.userDataA.userId,
          },
          {
            submissions: subData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Submission cleared Successfully!",
              });
            } else {
              res.status(401).json({
                message: "Not Authorized",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              message: "Couldn't clear Submission!!!",
            });
          });
      } else {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't clear Submission!!!",
      });
    });
};
