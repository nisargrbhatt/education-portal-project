const Submission = require("../models/submission");

exports.createSubmission = (req, res, next) => {
  const submissionData = new Submission({
    submission_name: req.body.submission_name,
    context: req.body.context,
    start_date: req.body.start_date,
    due_date: req.body.due_date,
    assign_by: req.userDataA.userId,
    classroom_name: req.body.classroom_name,
    classroom_id: req.body.classroom_id,
  });
  submissionData
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Submission Created Successfully!",
        subId: result._id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't create Submission",
      });
    });
};

exports.updateSubmission = (req, res, next) => {
  Submission.updateOne(
    {
      _id: req.params.id,
      assign_by: req.userDataA.userId,
    },
    {
      submission_name: req.body.submission_name,
      context: req.body.context,
      start_date: req.body.start_date,
      due_date: req.body.due_date,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Submission updated Successfully!",
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
        message: "Couldn't update Submission!!!",
      });
    });
};

exports.deleteSubmission = (req, res, next) => {
  Submission.deleteOne({
    _id: req.params.id,
    assign_by: req.userDataA.userId,
  })

    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Submission Deleted Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't delete Submission!!!",
      });
    });
};

exports.uploadSubmission = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let submissionData;
  Submission.findById(req.params.id)
    .then((submission) => {
      if (!submission) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      if (!submission.uploaded) {
        submissionData = [
          {
            id: req.userDataA.userId,
            name: req.body.name,
            enrollment_no: Number(req.body.enrollment_no),
            file: url + "/pdfs/" + req.file.filename,
            upload_time: Date.now(),
          },
        ];
      } else {
        submissionData = submission.uploaded;
        let subs = {
          id: req.userDataA.userId,
          name: req.body.name,
          enrollment_no: Number(req.body.enrollment_no),
          file: url + "/pdfs/" + req.file.filename,
          upload_time: Date.now(),
        };
        const index = submissionData.findIndex((data) => {
          if (
            data.id == checkData.id &&
            data.name == checkData.name &&
            data.enrollment_no == checkData.enrollment_no
          ) {
            return true;
          } else {
            return false;
          }
        }, (checkData = subs));
        if (index > -1) {
          return res.status(400).json({
            message: "You have already uploaded the submission!!!",
          });
        } else {
          submissionData.push(subs);
        }
      }
    })
    .then(() => {
      Submission.updateOne(
        {
          _id: req.params.id,
        },
        {
          uploaded: submissionData,
        }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(200).json({
              message: "Submission uploaded Successfully!",
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
            message: "Couldn't upload submission!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't upload submission!!!",
      });
    });
};

exports.deleteUpload = (req, res, next) => {
  let submissionData;
  Submission.findById(req.params.id)
    .then((submission) => {
      if (!submission) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      submissionData = submission.uploaded;
    })
    .then(() => {
      let subs = {
        id: req.userDataA.userId,
        name: req.body.name,
        enrollment_no: req.body.enrollment_no,
        file: req.body.file,
        upload_time: req.body.upload_time,
      };
      const index = submissionData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(checkData);
      }, (checkData = subs));
      if (index > -1) {
        submissionData.splice(index, 1);
        Submission.updateOne(
          {
            _id: req.params.id,
          },
          {
            uploaded: submissionData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Submission deleted Successfully!",
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
              message: "Couldn't delete submission!!!",
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
        message: "Couldn't delete submission!!!",
      });
    });
};

exports.getSubmission = (req, res, next) => {
  Submission.findById(req.params.id)
    .then((submission) => {
      res.status(200).json({
        message: "Submission fetched Successfully!",
        submission: submission,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Submission!!!",
      });
    });
};
exports.getSubmissionUpload = (req, res, next) => {
  Submission.findById(req.params.id)
    .then((submission) => {
      res.status(200).json({
        message: "Submission fetched Successfully!",
        submission: submission.uploaded,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Submission!!!",
      });
    });
};
exports.getSubmissionClassid = (req, res, next) => {
  Submission.find({
    classroom_id: req.params.id,
  })
    .then((submissions) => {
      res.status(200).json({
        message: "Submissions fetched Successfully!",
        submission: submissions,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't fetched Submissions!!!",
      });
    });
};
