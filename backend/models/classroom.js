const mongoose = require("mongoose");

const classroomSchema = mongoose.Schema({
  subject_name: {
    type: String,
  },
  subject_code: {
    type: Number,
  },
  department: {
    type: String,
  },
  semester: {
    type: Number,
  },
  uuid: {
    type: String,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  student_enrolled: {
    type: [
      {
        name: String,
        _id: String,
        enrollment_no: Number,
      },
    ],
  },
  attendance_report: {
    type: [
      {
        date: Date,
        attendee: [
          {
            _id: String,
            name: String,
          },
        ],
      },
    ],
  },
  scheduled_lecture: {
    type: {
      date: Date,
      time: Date | String,
    },
  },
  notifications: {
    type: [
      {
        date: Date,
        content: String,
      },
    ],
  },
});

module.exports = mongoose.model("Classroom", classroomSchema);
