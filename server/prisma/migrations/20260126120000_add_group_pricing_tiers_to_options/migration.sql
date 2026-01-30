-- Add group_pricing_tiers column to tour_options table (safe for production)
-- This migration is idempotent - safe to run even if column already exists

-- Add group_pricing_tiers if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tour_options' 
        AND column_name = 'group_pricing_tiers'
    ) THEN
        ALTER TABLE "tour_options" ADD COLUMN "group_pricing_tiers" TEXT;
    END IF;
END $$;
