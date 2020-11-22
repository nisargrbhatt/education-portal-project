const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  utype: {
    type: String,
  },
  department: {
    type: String,
  },
  enrollment_no: {
    type: Number,
  },
  subjects: {
    type: [String],
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  semester: {
    type: Number,
  },
  photo: {
    type: String,
  },
  contact_no: {
    type: Number,
  },
  uuid: {
    type: String,
  },
  dateofjoining: {
    type: Date,
  },
  profile_setup: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
  last_login: {
    type: Date,
  },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
