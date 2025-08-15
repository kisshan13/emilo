import rateLimit from 'express-rate-limit';
import express from "express"
import http from "http"
import morgan from "morgan";
import { Server } from "socket.io";
import helmet from "helmet";
import { config } from "dotenv"
import cors from "cors"

import logger from "./lib/pino.js";
import Config from "./config.js";

import authRoutes from "./routes/auth/index.js";
import postRoutes from "./routes/posts/index.js";
import ratesRoutes from "./routes/rates/index.js";
import claimsRoutes from "./routes/claims/index.js";
import cookieParser from "cookie-parser";
import mErrorHandler from "./middlewares/error.middleware.js";
import { getTokenInfo } from "./lib/jwt.js";
import claimLocks from "./io/locks.js";
import meRoutes from "./routes/me/index.js";
import tokensRouter from "./routes/tokens/index.js";
import settlementsRouter from "./routes/settlements/index.js"




config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [Config.ORIGIN]
    }
});
const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

app.use(limiter)
app.use((req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.startsWith("multipart/form-data")) {
        return next();
    }
    express.json()(req, res, next);
});
app.use(cookieParser(Config.COOKIE_SIGNING_SECRET || "cookie signing secret"));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
    credentials: true,
    origin: [Config.ORIGIN]
}));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/rates", ratesRoutes);
app.use("/api/claims", claimsRoutes);
app.use("/api/me", meRoutes);
app.use("/api/tokens", tokensRouter);
app.use("/api/settlements", settlementsRouter);

io.on("connection", (socket) => {
    const token = socket.handshake.auth.token

    try {
        const userId = getTokenInfo(token)
        let currentLockedId = ""
        socket.join("locks");

        socket.emit("currentLocks", claimLocks.getLocks())

        socket.on("addLock", (claimId) => {
            if (!claimLocks.lock().get(claimId)) {
                claimLocks.removeLock(currentLockedId);
                claimLocks.addLock(claimId, userId)
                currentLockedId = claimId
                socket.to("locks").emit("lockAdded", { claimId, userId })
            }
        });

        socket.on("removeLock", (claimId) => {
            claimLocks.removeLock(claimId)
            currentLockedId = ""
            socket.to("locks").emit("lockRemoved", { claimId })
        })

        socket.on("disconnect", () => {
            if (currentLockedId) {

                claimLocks.removeLock(currentLockedId)
            }
            logger.info(`${userId} disconnected from the server`)
        })

    } catch (error) {
        logger.error({ err: error }, "Connection send invalid token")
    }
})

app.use(mErrorHandler())

const port = Config.PORT || 4000
server.listen(port, () => {
    logger.info(`App is running on port ${port}`)
})