import jwt from "jsonwebtoken"
import Config from "../config.js"

export const signToken = (userId) => {
    return jwt.sign({ userId }, Config.SIGNING_SECRET || "signing-secret", { expiresIn: 60 * 2 * 1000 })
}

export const getTokenInfo = (token) => {
    return jwt.verify(token, Config.SIGNING_SECRET || "signing-secret")?.userId
}