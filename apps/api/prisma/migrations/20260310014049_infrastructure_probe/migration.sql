-- CreateTable
CREATE TABLE "_infrastructure_probe" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_infrastructure_probe_pkey" PRIMARY KEY ("id")
);
