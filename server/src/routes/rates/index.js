import { Router } from "express";
import {
    controllerGetActiveRate,
    controllerRatesCreate,
    controllerRatesUpdate,
    controllerRatesDelete,
    controllerGetRateHistory,
} from "./controller.js";
import { mAuth } from "../../middlewares/auth.middleware.js";

const ratesRoutes = Router();

ratesRoutes.get("/active", mAuth(), controllerGetActiveRate);
ratesRoutes.get("/history", mAuth(), controllerGetRateHistory);

ratesRoutes.post("/", mAuth(["admin"]), controllerRatesCreate);
ratesRoutes.put("/:id", mAuth(["admin"]), controllerRatesUpdate);
ratesRoutes.delete("/:id", mAuth(["admin"]), controllerRatesDelete);

export default ratesRoutes;