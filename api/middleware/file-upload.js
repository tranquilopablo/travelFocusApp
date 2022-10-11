const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'images');
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = MIME_TYPE_MAP[file.mimetype];
  //     cb(null, uuidv4() + '.' + ext);
  //   },
  // }),
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Nieprawidłowy typ danych zdjęcia!');
    cb(error, isValid);
  },
});

module.exports = fileUpload;
