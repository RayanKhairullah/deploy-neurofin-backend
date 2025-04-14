-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT,
    "verified" BOOLEAN,
    "verificationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "expenseid" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "uangmasuk" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "uangkeluar" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "uangakhir" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("expenseid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
