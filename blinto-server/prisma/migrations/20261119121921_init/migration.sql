-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "prerequisites" TEXT[],

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);
