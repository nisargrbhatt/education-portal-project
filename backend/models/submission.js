const mongoose = require("mongoose");

const submissionSchema = mongoose.Schema({
  submission_name: {
    type: String,
  },
  context: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  due_date: {
    type: Date,
  },
  assign_by: {
    type: String,
  },
  classroom_name: {
    type: String,
  },
  classroom_id: {
    type: String,
  },
  uploaded: {
    type: [
      {
        id: String,
        name: String,
        enrollment_no: Number,
        file: String,
        upload_time: Date,
      },
    ],
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
