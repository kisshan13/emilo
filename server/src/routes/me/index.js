import { Router } from "express";
import { controllerGetMe } from "./controller.js";
import { mAuth } from "../../middlewares/auth.middleware.js";

const meRoutes = Router();

meRoutes.get("/", mAuth(), controllerGetMe);

export default meRoutes;