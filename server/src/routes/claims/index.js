import { Router } from "express";
import { mAuth } from "../../middlewares/auth.middleware.js";
import {
  controllerClaimCreate,
  controllerAccountantApplyDeduction,
  controllerUserSettleDeduction,
  controllerAdminApproveClaim,
  controllerGetClaims,
  controllerGetClaimById,
  controllerAccountantApproved,
} from "./controller.js";
import uploader from "../../lib/multer.js";
import { mLock } from "../../middlewares/lock.middleware.js";

const claimsRoute = Router();

claimsRoute.post(
  "/",
  mAuth(["user"]),
  uploader.single("media"),
  controllerClaimCreate
);
claimsRoute.patch(
  "/:id/settle",
  mAuth(["user"]),
  controllerUserSettleDeduction
);

claimsRoute.patch(
  "/:id/deduct",
  mAuth(["accountant"]),
  mLock(),
  controllerAccountantApplyDeduction
);
claimsRoute.post(
  "/:id/acc-approved",
  mAuth(["accountant"]),
  mLock(),
  controllerAccountantApproved
);

claimsRoute.patch(
  "/:id/approve",
  mAuth(["admin"]),
  mLock(),
  controllerAdminApproveClaim
);

claimsRoute.get(
  "/",
  mAuth(["user", "accountant", "admin"]),
  controllerGetClaims
);
claimsRoute.get(
  "/:id",
  mAuth(["user", "accountant", "admin"]),
  controllerGetClaimById
);

export default claimsRoute;
