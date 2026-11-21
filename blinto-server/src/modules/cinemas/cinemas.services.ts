import AppError from "@/helper/AppError";
import { prisma } from "@/lib/prisma";

interface Cinema {
  name : string;
  bundleSizes : number[]
}

const minimumBundles = (groupSize: number, bundles: number[]) => {
  const dp: number[] = Array(groupSize + 1).fill(Infinity);
  const choice: number[] = Array(groupSize + 1).fill(-1);

  dp[0] = 0;

  for (let i = 1; i <= groupSize; i++) {
    for (const bundle of bundles) {
      if (i >= bundle) {
        const previous = dp[i - bundle];
        const current = dp[i];
        if (
          previous !== undefined &&
          current !== undefined &&
          previous !== Infinity
        ) {
          if (previous + 1 < current) {
            dp[i] = previous + 1;
            choice[i] = bundle;
          }
        }
      }
    }
  }

  if (dp[groupSize] === Infinity) return { possible: false };
  const breakdown: Record<string, number> = {};
  let remaining = groupSize;
  while (remaining > 0) {
    const bundle = choice[remaining] as number;
    breakdown[bundle] = (breakdown[bundle] || 0) + 1;
    remaining -= bundle;
  }

  return {
    possible: true,
    breakdown,
    totalBundles: dp[groupSize],
  };
};

const bookingQuote = (groupSize: number) => {
  try {
    const bundles = [1, 3, 4];
    const result = minimumBundles(groupSize, bundles);
    return result;
  } catch (error) {
    throw error;
  }
};

const createCinema = async(DTO : Cinema) => {
  try {
    const isExist = await prisma.cinema.findUnique({
      where : {
        name : DTO.name
      }
    });

    if(isExist){
      throw new AppError("DUPLICATE_NAME",409);
    }

    return await prisma.cinema.create({
      data : DTO
    });
  } catch (error) {
    throw error;
  }
}

const getCinemas = async() => {
  try {
    const result = await prisma.cinema.findMany();
    return result;
  } catch (error) {
    throw error;
  }
}

export const cinemaServices = {
  bookingQuote,
  createCinema,
  getCinemas
};
