import "express";
import { LeanDocument } from "mongoose";
import User from "../database/schema/user.schema.js";
import Sessions from "../database/schema/sessions.schema.js";

type UserDocument = LeanDocument<InstanceType<typeof User>>;
type SessionDocument = LeanDocument<InstanceType<typeof Sessions>>;

declare module "express" {
    export interface Request {
        user?: Omit<UserDocument, "password">;
        session?: SessionDocument;
    }
}
