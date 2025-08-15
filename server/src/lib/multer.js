import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

import s3 from "./aws.js";
import Config from "../config.js";
import { generateRandomFileHash } from "../utils/utils.js";
import ServerError from "../utils/server-error.js";

const uploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: Config.AWS_BUCKET,
        key: function (req, file, cb) {
            cb(null, `${generateRandomFileHash(Date.now().toString())}${path.extname(file.originalname)}`)
        }
    }),
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new ServerError(400, "Only image files are allowed."));
        }
        cb(null, true);
    }
})

export default uploader;