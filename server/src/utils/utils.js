import crypto from "node:crypto"
import Config from "../config.js";

export function generateRandomFileHash(input) {
    const salt = crypto.randomBytes(8).toString('hex');
    const hash = crypto.createHash('sha256').update(input + salt).digest('base64url');
    return hash.slice(0, 15);
}

export function getS3Url(key) {
    return `https://${Config.AWS_BUCKET}.s3.${Config.AWS_REGION}.amazonaws.com/${key}`;
}

export function getBaseQuery(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.size, 10) || 10;
    return {
        page: page > 0 ? page : 1,
        limit: limit > 0 ? limit : 10
    };
}
