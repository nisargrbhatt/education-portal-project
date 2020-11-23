const multer = require("multer");

const MIME_TYPE_MAP = {
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mimetype");
    if (isValid) {
      error = null;
    }

    cb(error, "pdfs"); // the Route should be relative to server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: storage }).single("pdf");
