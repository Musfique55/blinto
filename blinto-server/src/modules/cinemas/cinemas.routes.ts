import { Router } from "express";
import { cinemaController } from "./cinemas.controller";

const router = Router();

router.get("/cinemas/:id/booking",cinemaController.bookingQuote);
router.post("/cinemas",cinemaController.createCinema);
router.get("/cinemas",cinemaController.getCinemas);

export const cinemaRoutes = router;