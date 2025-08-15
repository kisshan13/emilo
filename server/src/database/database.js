import { createConnection } from "mongoose";
import Config from "../config.js";

const connectionUrl = Config.DATABASE_URL || "mongodb://localhost:27017/emilo"

const database = createConnection(connectionUrl)

export default database