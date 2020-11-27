const Test = require("../models/test");

function findMarks(userAnswers, questions) {
  let correctAnswers = [];
  marks = 0;
  for (let i = 0; i < questions.length; i++) {
    correctAnswers.push(questions[i].answer);
  }
  for (let j = 0; j < userAnswers.length; j++) {
    if (userAnswers[j] == correctAnswers[j]) {
      marks += 1;
    }
  }
  return marks;
}

exports.createTest = (req, res, next) => {
  const testData = new Test({
    test_name: req.body.test_name,
    start_date: req.body.start_date,
    due_date: req.body.due_date,
    assign_by: req.userDataA.userId,
    classroom_name: req.body.classroom_name,
    classroom_id: req.body.classroom_id,
    test_question: req.body.test_question,
  });

  testData
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Test Created Successfully!",
        testId: result._id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't create Test!!!",
      });
    });
};
exports.updateTest = (req, res, next) => {
  Test.updateOne(
    {
      _id: req.params.id,
      assign_by: req.userDataA.userId,
    },
    {
      test_name: req.body.test_name,
      start_date: req.body.start_date,
      due_date: req.body.due_date,
      assign_by: req.userDataA.userId,
      test_question: req.body.test_question,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Test updated Successfully!",
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
        message: "Couldn't update Test!!!",
      });
    });
};

exports.deleteTest = (req, res, next) => {
  Test.deleteOne({
    _id: req.params.id,
    assign_by: req.userDataA.userId,
  })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Test deleted Successfully!",
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
        message: "Couldn't delete Test!!!",
      });
    });
};

exports.addUserResponse = (req, res, next) => {
  let testData;
  Test.findById(req.params.id)
    .then((test) => {
      if (!test) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      if (!test.test_responses) {
        testData = [];
        let testuData = {
          s_id: req.body.s_id,
          name: req.body.name,
          enrollment_no: req.body.enrollment_no,
          answers: req.body.answers,
          submit_time: Date.now(),
          marks: findMarks(req.body.answers, test.test_question),
        };
        testData.push(testuData);
      } else {
        testData = test.test_responses;
        let testuData = {
          s_id: req.body.s_id,
          name: req.body.name,
          enrollment_no: req.body.enrollment_no,
          answers: req.body.answers,
          marks: findMarks(req.body.answers, test.test_question),
          submit_time: Date.now(),
        };
        const index = testData.findIndex((data) => {
          if (
            data.s_id == checkData.s_id &&
            data.name == checkData.name &&
            data.enrollment_no == checkData.enrollment_no
          ) {
            return true;
          } else {
            return false;
          }
        }, (checkData = testuData));
        if (index > -1) {
          return res.status(400).json({
            message: "You have already attempt the Test!!!",
          });
        } else {
          testData.push(testuData);
        }
      }
    })
    .then(() => {
      Test.updateOne(
        { _id: req.params.id },
        {
          test_responses: testData,
        }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(200).json({
              message: "Test attempted Successfully!",
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
            message: "Couldn't add Testdata!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't add Testdata!!!",
      });
    });
};

exports.getTest = (req, res, next) => {
  Test.findById(req.params.id)
    .then((test) => {
      res.status(200).json({
        message: "Test fetched Successfully!",
        test: test,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Test!!!",
      });
    });
};

exports.getTestClassid = (req, res, next) => {
  Test.find({
    classroom_id: req.params.id,
  })
    .then((tests) => {
      res.status(200).json({
        message: "Tests fetched Successfully!",
        test: tests,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Tests!!!",
      });
    });
};
