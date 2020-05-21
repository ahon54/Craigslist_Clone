const aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.IAM_KEY,
  region: "us-east-2",
});

const s3 = new aws.S3();
exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "//create a bucket and name",
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
