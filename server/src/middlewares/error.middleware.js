import { ZodError } from "zod"
import logger from "../lib/pino.js"

/**
 * 
 * @returns {(err: Error, req: import("express").Request, res:import("express").Response, next:import("express").NextFunction) => void}
 */
export default function mErrorHandler() {
    return (err, req, res, next) => {
        logger.error({ err: err }, err.message)

        if (err instanceof ZodError) {
            return res.status(422).json({ message: "invalid payload", error: err.message })
        }

        return res.status(500).json({ message: "internal server error" })
    }
}