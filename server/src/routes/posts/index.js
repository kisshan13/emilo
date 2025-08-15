import { Router } from "express";
import { controllerPostCreate, controllerPostGet, controllerGetUserPosts, controllerToggleLike, controllerAddPostViews } from "./controller.js";
import { mAuth } from "../../middlewares/auth.middleware.js";
import uploader from "../../lib/multer.js";

const postRoutes = Router();

postRoutes.post(
    "/",
    mAuth(["user"]),
    uploader.single("media"),
    controllerPostCreate
);

postRoutes.get("/", mAuth(), controllerPostGet);
postRoutes.get("/user/:userId", mAuth(), controllerGetUserPosts);

postRoutes.get("/:id/toggle-like", mAuth(), controllerToggleLike)
postRoutes.post("/views", mAuth(), controllerAddPostViews)

export default postRoutes;
