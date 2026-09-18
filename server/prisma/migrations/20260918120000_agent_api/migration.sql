-- CreateTable
CREATE TABLE "agent_keys" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "daily_quota" INTEGER NOT NULL DEFAULT 300,
    "hold_quota" INTEGER NOT NULL DEFAULT 20,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "agent_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_requests" (
    "id" SERIAL NOT NULL,
    "key_id" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_holds" (
    "id" SERIAL NOT NULL,
    "hold_id" TEXT NOT NULL,
    "key_id" INTEGER NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "pax" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "amount_usd" DOUBLE PRECISION NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_holds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_keys_key_key" ON "agent_keys"("key");

-- CreateIndex
CREATE INDEX "agent_requests_key_id_day_kind_idx" ON "agent_requests"("key_id", "day", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "agent_holds_hold_id_key" ON "agent_holds"("hold_id");

-- CreateIndex
CREATE INDEX "agent_holds_key_id_idx" ON "agent_holds"("key_id");

-- AddForeignKey
ALTER TABLE "agent_requests" ADD CONSTRAINT "agent_requests_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "agent_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_holds" ADD CONSTRAINT "agent_holds_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "agent_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

