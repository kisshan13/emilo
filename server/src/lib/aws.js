import { S3Client } from "@aws-sdk/client-s3";
import Config from "../config.js";

const s3 = new S3Client({
    region: Config.AWS_REGION,
    credentials: {
        accessKeyId: Config.AWS_CLIENT_ID,
        secretAccessKey: Config.AWS_SECRET_KEY,
    }
})

export default s3;