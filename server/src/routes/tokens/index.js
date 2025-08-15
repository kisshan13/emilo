import { Router } from "express";
import { mAuth } from "../../middlewares/auth.middleware.js";
import { controllerGetToken } from "./controller.js";

const tokensRouter = Router();

tokensRouter.get("/", mAuth(), controllerGetToken)

export default tokensRouter;