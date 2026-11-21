import { Router } from "express";
import { moviesController } from "./movies.controller";

const router = Router();

router.post("/movies",moviesController.createMovie);
router.get("/movies",moviesController.getAllMovies);
router.get("/movies/:id/rewatch-order",moviesController.rewatchOrder);
router.patch("/movies/:id",moviesController.updateMovie);

export const moviesRoutes = router;