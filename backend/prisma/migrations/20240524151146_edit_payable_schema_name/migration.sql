/*
  Warnings:

  - You are about to drop the `Payable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Payable";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "payables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "emissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignorId" TEXT NOT NULL,
    CONSTRAINT "payables_assignorId_fkey" FOREIGN KEY ("assignorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
