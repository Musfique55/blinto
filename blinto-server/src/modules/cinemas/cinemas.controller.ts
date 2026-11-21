import { asyncHandler } from "@/helper/asyncHandler";
import { Request, Response } from "express";
import { cinemaServices } from "./cinemas.services";
import AppError from "@/helper/AppError";

const bookingQuote = asyncHandler(async (req: Request, res: Response) => {
  const groupSize = req.query.groupSize;
  const result = await cinemaServices.bookingQuote(Number(groupSize));
  res.status(200).json(result);
});

const createCinema = asyncHandler(async(req: Request, res: Response) => {
    const {name,bundleSizes} = req.body;
    if(bundleSizes.length === 0 || bundleSizes.length > 10){
        throw new AppError("AT_MOST_10_BUNDLES_CAN_BE_ADDED",400);
    }
    for(const b of bundleSizes){
        if(b <= 0 || b > 500){
            throw new AppError("A_BUNDLES_CAN_HOLD_BETWEEN_1-500_SEATS_MOST",400);
        }
    }

    const result = await cinemaServices.createCinema({name,bundleSizes});
    res.status(201).json(result);
});

const getCinemas = asyncHandler(async(req: Request, res: Response) =>{
    const result = await cinemaServices.getCinemas();
    res.status(200).json(result);
})

export const cinemaController = {
  bookingQuote,
  createCinema,
  getCinemas
};
