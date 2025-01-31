/*
  Warnings:

  - You are about to drop the `RefundTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "acceptingReplies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refundTxHash" TEXT;

-- DropTable
DROP TABLE "RefundTransactions";
