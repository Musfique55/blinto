import { asyncHandler } from "@/helper/asyncHandler";
import { moviesService } from "./movies.services";
import { Request, Response } from "express";
import AppError from "@/helper/AppError";

const createMovie = asyncHandler(async (req: Request, res: Response) => {
  const { title, releaseYear, duration, prerequisites = [] } = req.body;

  if (!title || typeof title !== "string")
    throw new AppError("title required", 400);
  if (!Number.isInteger(duration) || duration < 1 || duration > 300)
    throw new AppError("duration must be 1–300", 400);
  if (!Number.isInteger(releaseYear))
    throw new AppError("releaseYear invalid", 400);

  const newMovie = await moviesService.createMovie({
    title,
    releaseYear,
    duration,
    prerequisites,
  });

  res.status(201).json(newMovie);
});

const updateMovie = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, releaseYear, duration, prerequisites } = req.body;
  const updatedMovie = await moviesService.updateMovie(id as string, {
    title,
    releaseYear,
    duration,
    prerequisites,
  });
  res.status(200).json(updatedMovie);
});

const rewatchOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const rewatch = await moviesService.rewatchOrder(id as string);
  res.status(200).json(rewatch);
});

const getAllMovies = asyncHandler(async (req: Request, res: Response) =>{
    const result = await moviesService.getAllMovies();
    return result;
})

export const moviesController = {
  createMovie,
  updateMovie,
  rewatchOrder,
  getAllMovies
};
