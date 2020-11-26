const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  test_name: {
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
  test_question: {
    type: [
      {
        question: String,
        options: [String],
        answer: String,
      },
    ],
  },
  test_responses: {
    type: [
      {
        s_id: String,
        name: String,
        enrollment_no: Number,
        answers: [String],
        marks: Number,
        submit_time: Date,
      },
    ],
  },
});
module.exports = mongoose.model("Test", testSchema);
