-- CreateTable
CREATE TABLE "cinema" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bundleSizes" INTEGER[],

    CONSTRAINT "cinema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cinema_name_key" ON "cinema"("name");
