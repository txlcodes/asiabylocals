-- Where to actually reach the operator who runs an agent-model tour.
--
-- 96% of live tours sit under supplier 1 (AsiaByLocals acting as agent), so
-- booking.supplier.email is our own inbox: the "you have a booking" mail never
-- reached the person who has to show up. Operators repeat across tours, so the
-- contact is keyed by the operator name we already store on every tour
-- (tours.activity_provider) rather than duplicated per tour.
CREATE TABLE IF NOT EXISTS "operator_contacts" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "email" TEXT,
    "whatsapp" TEXT,
    "phone" TEXT,
    "website" TEXT,
    -- 'email' or 'whatsapp': which one the operator actually answers on.
    "preferred_channel" TEXT,
    "verified_at" TIMESTAMP(3),
    "source" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "operator_contacts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "operator_contacts_provider_key" ON "operator_contacts"("provider");
