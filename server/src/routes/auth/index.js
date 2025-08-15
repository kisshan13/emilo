import { Router } from "express";
import { controllerAuthSignup, controllerAuthLogin, controllerAuthLogout } from "./controller.js";

const authRoutes = Router();

authRoutes.post("/signup", controllerAuthSignup);
authRoutes.post("/login", controllerAuthLogin);
authRoutes.post("/logout", controllerAuthLogout);

export default authRoutes;