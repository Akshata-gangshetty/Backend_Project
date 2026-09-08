import multer from "multer";
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/temp')
  },
  filename: function (req, file, cb) {
    const raw = crypto.randomBytes(16);
      cb(null, file.originalname)
    }
  
})

const upload = multer({ storage: storage })