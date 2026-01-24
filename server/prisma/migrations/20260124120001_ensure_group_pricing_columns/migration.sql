-- Ensure group_price and max_group_size columns exist (safe for production)
-- This migration is idempotent - safe to run even if columns already exist

-- Add max_group_size if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tour_options' 
        AND column_name = 'max_group_size'
    ) THEN
        ALTER TABLE "tour_options" ADD COLUMN "max_group_size" INTEGER;
    END IF;
END $$;

-- Add group_price if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tour_options' 
        AND column_name = 'group_price'
    ) THEN
        ALTER TABLE "tour_options" ADD COLUMN "group_price" DOUBLE PRECISION;
    END IF;
END $$;

-- Remove pricing_type if it exists (from our previous fix)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tour_options' 
        AND column_name = 'pricing_type'
    ) THEN
        ALTER TABLE "tour_options" DROP COLUMN "pricing_type";
    END IF;
END $$;

