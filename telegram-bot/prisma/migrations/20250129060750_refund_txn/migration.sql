/*
  Warnings:

  - You are about to drop the column `refundTxHash` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "refundTxHash";

-- CreateTable
CREATE TABLE "RefundTransactions" (
    "txHash" TEXT NOT NULL,
    "refundTxHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundTransactions_pkey" PRIMARY KEY ("txHash")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefundTransactions_txHash_key" ON "RefundTransactions"("txHash");
