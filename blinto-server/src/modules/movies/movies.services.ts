import AppError from "@/helper/AppError";
import { prisma } from "@/lib/prisma";

export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  duration: number;
  prerequisites: string[]; // titles of movies to watch first
  watched: boolean;
}

const wouldCreateCycle = (
  title: string,
  newPrereqs: string[],
  movies: Movie[],
) => {
  const visited = new Set<string>();
  const stack = [...newPrereqs];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === title) return true; // cycle detected
    if (visited.has(current)) continue;
    visited.add(current);
    const currentMovie = movies.find((m) => m.title === current);
    stack.push(...(currentMovie?.prerequisites ?? []));
  }
  return false;
};

const getRewatchOrder = (target : string,movies : Movie[]) => {
    const movieMap = new Map(
        movies.map((m) => [m.title,m])
    );
    const visited = new Set<string>();
    const result : Movie[] = [];

    function dfs(title : string){
        if(visited.has(title)) return;
        visited.add(title);

        const movie = movieMap.get(title);
        if(!movie) return;
        for(const p of movie.prerequisites){
            dfs(p);
        }

        if(title !== target) result.push(movie);
    }

    dfs(target);

    return result;
}

const createMovie = async (DTO: Omit<Movie, "id" | "watched">) => {
  try {
    const { title, releaseYear, duration, prerequisites = [] } = DTO;

    const movies = await prisma.movie.findMany();

    const isExist = movies.find((m) => m.title === title);
    if (isExist) throw new AppError("DUPLICATE_TITLE", 409);

    if (
      prerequisites.some(
        (prereqTitle: string) => !movies.some((m) => m.title === prereqTitle),
      )
    ) {
      throw new AppError("prerequisites must reference existing movies", 400);
    }

    if (wouldCreateCycle(title, prerequisites, movies)) {
      throw new AppError("CIRCULAR_DEPENDENCY", 409);
    }

    const newMovie = {
      title,
      releaseYear,
      duration,
      prerequisites: [...new Set(prerequisites)], // Ensure unique prerequisites
    };

    const movie = await prisma.movie.create({
      data: newMovie,
    });

    return movie;
  } catch (error : any) {
    throw error;
  }
};

const updateMovie = async (id: string, DTO: Partial<Omit<Movie, "id" | "watched">>) => {
  try {
    const movies = await prisma.movie.findMany();
    const movie = movies.find((m) => m.id === id);
    if (!movie) throw new AppError("MOVIE_NOT_FOUND", 404);
    if(DTO.prerequisites && wouldCreateCycle(movie.title, DTO.prerequisites, movies)) {
      throw new AppError("CIRCULAR_DEPENDENCY", 409);
    }
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: DTO,
    });

    return updatedMovie;
  }catch (error : any) {
    throw error;
  }
}

const rewatchOrder = async (id: string) => {
    try {
        const movies = await prisma.movie.findMany();
        const movie = movies.find((m) => m.id === id);
        if(!movie) throw new AppError("NO_MOVIE_FOUND",404);
        const result = getRewatchOrder(movie.title,movies);
        const watchedCount =  result.filter((m) => m.watched).length;
        const remainingTime = result.reduce((total,movie) => total + (movie.watched ? 0 : movie.duration),0);
        return {
            prerequisites : result,
            watchedCount,
            remainingTime
        }
    } catch (error : any) {
        throw error;
    }
}

const getAllMovies = async () => {
  try {
    const movies = await prisma.movie.findMany();
    return movies;
  } catch (error) {
    throw new AppError("FAILED_TO_FETCH_MOVIES", 500);
  }
};

export const moviesService = {
  createMovie,
  getAllMovies,
  updateMovie,
  rewatchOrder
};
