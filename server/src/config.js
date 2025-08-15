import { config } from "dotenv";
import logger from "./lib/pino.js";

config()

const Config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    SIGNING_SECRET: process.env.SIGNING_SECRET,
    COOKIE_SIGNING_SECRET: process.env.COOKIE_SIGNING_SECRET,

    AWS_CLIENT_ID: process.env.AWS_CLIENT_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
    ORIGIN: process.env.ORIGIN,
}

logger.info({...Config}, 'Loaded Envs')

export default Config;
