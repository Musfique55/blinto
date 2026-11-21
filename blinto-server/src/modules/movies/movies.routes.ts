import { Router } from "express";
import { moviesController } from "./movies.controller";

const router = Router();

router.post("/movies",moviesController.createMovie);
router.patch("/movies/:id",moviesController.updateMovie);
router.get("/movies/:id/rewatch-order",moviesController.rewatchOrder);

export const moviesRoutes = router;