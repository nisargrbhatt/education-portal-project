const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const enc = require("../middleware/encrption");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  let userData;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      if (req.body.utype == "Student") {
        userData = new User({
          name: req.body.name,
          utype: req.body.utype,
          department: req.body.department,
          email: req.body.email,
          password: hash,
          semester: req.body.semester,
          uuid: uuidv4(),
          dateofjoining: req.body.dateofjoining,
          created_at: Date.now(),
        });
      } else if (req.body.utype == "Teacher") {
        userData = new User({
          name: req.body.name,
          utype: req.body.utype,
          department: req.body.department,
          email: req.body.email,
          password: hash,
          uuid: uuidv4(),
          dateofjoining: req.body.dateofjoining,
          created_at: Date.now(),
        });
      } else if (req.body.utype == "Admin") {
        userData = new User({
          name: req.body.name,
          utype: req.body.utype,
          email: req.body.email,
          password: hash,
          uuid: uuidv4(),
          profile_setup: Date.now(),
          created_at: Date.now(),
        });
      } else {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      userData.save().then((result) => {
        res.status(201).json({
          message: "User Created Successfully!",
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Creation of User failed!!!",
      });
    });
};
// exports.changeProfile = (req, res, next) => {
//   if (req.userDataA.utype == "Student") {
//     User.updateOne(
//       {
//         _id: req.params.id,
//         email: req.userDataA.email,
//       },
//       {
//         name: req.body.name,
//         department: req.body.department,
//         enrollment_no: req.body.enrollment_no,
//         semester: req.body.semester,
//         contact_no: req.body.contact_no,
//         profile_setup: Date.now(),
//       }
//     )
//       .then((result) => {
//         if (result.n > 0) {
//           res.status(200).json({
//             message: "Profile has updated Successfully.",
//           });
//         } else {
//           res.status(401).json({
//             message: "Not Authorized",
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).json({ message: "Couldn't update Profile" });
//       });
//   } else if (req.userDataA.utype == "Teacher") {
//     User.updateOne(
//       {
//         _id: req.params.id,
//         email: req.userDataA.email,
//       },
//       {
//         name: req.body.name,
//         department: req.body.department,
//         contact_no: req.body.contact_no,
//         profile_setup: Date.now(),
//       }
//     )
//       .then((result) => {
//         if (result.n > 0) {
//           res.status(200).json({
//             message: "Profile has updated Successfully.",
//           });
//         } else {
//           res.status(401).json({
//             message: "Not Authorized",
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).json({ message: "Couldn't update Profile" });
//       });
//   } else {
//     res.status(400).json({
//       message: "Bad Request/Bad Data",
//     });
//   }
// };
exports.changeProfile = (req, res, next) => {
  let imagePath = req.body.photo;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  if (req.userDataA.utype == "Student") {
    User.updateOne(
      {
        _id: req.params.id,
        email: req.userDataA.email,
      },
      {
        name: req.body.name,
        department: req.body.department,
        enrollment_no: req.body.enrollment_no,
        semester: req.body.semester,
        photo: imagePath,
        contact_no: req.body.contact_no,
        profile_setup: Date.now(),
      }
    )
      .then((result) => {
        if (result.n > 0) {
          res.status(200).json({
            message: "Profile has been updated Successfully.",
          });
        } else {
          res.status(401).json({
            message: "Not Authorized",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Couldn't update Profile" });
      });
  } else if (req.userDataA.utype == "Teacher") {
    User.updateOne(
      {
        _id: req.params.id,
        email: req.userDataA.email,
      },
      {
        name: req.body.name,
        department: req.body.department,
        photo: imagePath,
        contact_no: req.body.contact_no,
        profile_setup: Date.now(),
      }
    )
      .then((result) => {
        if (result.n > 0) {
          res.status(200).json({
            message: "Profile has been updated Successfully.",
          });
        } else {
          res.status(401).json({
            message: "Not Authorized",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Couldn't update Profile" });
      });
  } else {
    res.status(400).json({
      message: "Bad Request/Bad Data",
    });
  }
};
exports.setupUser = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  if (req.userDataA.utype == "Student") {
    console.log("Here");
    User.updateOne(
      {
        _id: req.params.id,
        email: req.userDataA.email,
      },
      {
        name: req.body.name,
        department: req.body.department,
        enrollment_no: req.body.enrollment_no,
        semester: req.body.semester,
        photo: url + "/images/" + req.file.filename,
        contact_no: req.body.contact_no,
        profile_setup: Date.now(),
      }
    )
      .then((result) => {
        if (result.n > 0) {
          res.status(200).json({
            message: "Profile has been set Successfully.",
          });
        } else {
          res.status(401).json({
            message: "Not Authorized",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Couldn't Setup Profile" });
      });
  } else if (req.userDataA.utype == "Teacher") {
    console.log("Here1");
    User.updateOne(
      {
        _id: req.params.id,
        email: req.userDataA.email,
      },
      {
        name: req.body.name,
        department: req.body.department,
        photo: url + "/images/" + req.file.filename,
        contact_no: req.body.contact_no,
        profile_setup: Date.now(),
      }
    )
      .then((result) => {
        if (result.n > 0) {
          res.status(200).json({
            message: "Profile has been set Successfully.",
          });
        } else {
          res.status(401).json({
            message: "Not Authorized",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Couldn't Setup Profile" });
      });
  } else {
    res.status(400).json({
      message: "Bad Request/Bad Data",
    });
  }
};

exports.setProfilePhoto = (req, res, next) => {
  let imagePath = req.body.photoPath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  User.updateOne(
    {
      _id: req.params.id,
      email: req.userDataA.email,
    },
    {
      photo: imagePath,
      profile_setup: Date.now(),
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(201).json({
          message: "Profile Photo updated Successfully.",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Couldn't Update Profile Photo" });
    });
};

// exports.addSubject = (req, res, next) => {
//   User.updateOne(
//     {
//       _id: req.params.id,
//       email: req.userDataA.email,
//     },
//     {
//       subjects: req.body.subjects,
//     }
//   )
//     .then((result) => {
//       if (result.n > 0) {
//         res.status(201).json({
//           message: "Subject Added Successfully!",
//         });
//       } else {
//         res.status(401).json({
//           message: "Not Authorized!",
//         });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({
//         message: "Couldn't add Subjects",
//       });
//     });
// };

exports.addSubject = (req, res, next) => {
  let subjectData;
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user.subjects) {
        subjectData = [];
        subjectData.push(req.body.subject);
      } else {
        subjectData = user.subjects;
        subjectData.push(req.body.subject);
      }
    })
    .then(() => {
      User.updateOne(
        {
          _id: req.params.id,
        },
        {
          subjects: subjectData,
        }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(201).json({
              message: "Subject Added Successfully!",
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
            message: "Couldn't add Subject!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't add Subject!!!",
      });
    });
};

exports.clearSubject = (req, res, next) => {
  let subjectData;
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      subjectData = user.subjects;
    })
    .then(() => {
      const index = subjectData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(checkData);
      }, (checkData = req.body.subject));
      if (index > -1) {
        subjectData.splice(index, 1);
        User.updateOne(
          { _id: req.params.id },
          {
            subjects: subjectData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Subject cleared Successfully!",
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
              message: "Couldn't clear Subject",
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
        message: "Couldn't clear Subject",
      });
    });
};

exports.clearAllSubject = (req, res, next) => {
  User.updateOne(
    {
      _id: req.params.id,
      email: req.userDataA.email,
    },
    {
      subjects: null,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(201).json({
          message: "Subject Cleared Successfully!",
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
        message: "Couldn't clear Subjects",
      });
    });
};

exports.passwordChange = (req, res, next) => {
  User.findOne({
    _id: req.userDataA.userId,
    email: req.userDataA.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      return bcrypt.compare(req.body.oldpass, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      bcrypt.hash(req.body.newpass, 10).then((hash) => {
        User.updateOne(
          {
            _id: req.userDataA.userId,
            email: req.userDataA.email,
          },
          {
            password: hash,
          }
        ).then((result) => {
          if (result.n > 0) {
            res.status(201).json({
              message: "Password Changed Successfully!!",
            });
          } else {
            res.status(401).json({
              message: "Not Authorized",
            });
          }
        });
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't change the password",
      });
    });
};

exports.userLogin = (req, res, next) => {
  let decAuthData = enc.decryptData(req.body.authData);
  let fetchedUser;
  User.findOne({
    email: decAuthData.email,
  })
    .then((user) => {
      if (!user) {
        console.log("No user Exist");
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(decAuthData.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          utype: fetchedUser.utype,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );
      User.updateOne(
        {
          _id: fetchedUser._id,
          email: fetchedUser.email,
        },
        {
          last_login: Date.now(),
        }
      );
      res.status(200).json({
        token: token,
        expiresIn: 86400,
        userId: fetchedUser._id,
        userDetails: {
          name: fetchedUser.name,
          utype: fetchedUser.utype,
          email: fetchedUser.email,
          profile: fetchedUser.profile_setup,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      return res.staus(500).json({
        message: "Couldn't handle request",
      });
    });
};

exports.getProfile = (req, res, next) => {
  User.findOne({
    _id: req.userDataA.userId,
    email: req.userDataA.email,
  })
    .then((user) => {
      if (!user) {
        console.log("No user Exist");
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      // console.log(user);
      let userDetailss = {
        name: user.name,
        utype: user.utype,
        department: user.department,
        enrollment_no: user.enrollment_no,
        subjects: user.subjects,
        email: user.email,
        semester: user.semester || null,
        photo: user.photo,
        contact_no: user.contact_no,
        dateofjoining: user.dateofjoining,
        profile_setup: user.profile_setup,
      };
      // console.log(userDetailss);
      return res.status(200).json({
        message: "Profile Found",
        userDetails: userDetailss,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't find the profile",
      });
    });
};
