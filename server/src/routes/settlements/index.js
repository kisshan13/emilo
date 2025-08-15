import { Router } from "express";
import { controllerSettlementsGet } from "./controller.js";
import { mAuth } from "../../middlewares/auth.middleware.js";

const settlementsRouter = Router();

settlementsRouter.get("/", mAuth(["user", "admin"]), controllerSettlementsGet);

export default settlementsRouter;
