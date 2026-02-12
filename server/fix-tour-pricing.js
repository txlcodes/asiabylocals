// One-time script to fix existing tours by adding groupPricingTiers to their main tour options
// Run with: node server/fix-tour-pricing.js

import prisma from './db.js';

async function fixTourPricing() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔧 FIXING TOUR PRICING - Adding groupPricingTiers to options');
  console.log('═══════════════════════════════════════════════════════════');
  
  try {
    // Find all tours
    const tours = await prisma.tour.findMany({
      include: {
        options: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    console.log(`📊 Found ${tours.length} tours to check`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    for (const tour of tours) {
      // Check if main tour option (sortOrder: -1) exists and has groupPricingTiers
      const mainTourOption = tour.options.find(opt => opt.sortOrder === -1) || tour.options[0];
      
      if (mainTourOption && mainTourOption.groupPricingTiers) {
        console.log(`✅ Tour ${tour.id} (${tour.title}): Already has groupPricingTiers`);
        skippedCount++;
        continue;
      }
      
      // Check if tour has pricePerPerson and maxGroupSize to reconstruct tiers
      if (!tour.pricePerPerson || tour.pricePerPerson <= 0) {
        console.log(`⚠️ Tour ${tour.id} (${tour.title}): No pricePerPerson, skipping`);
        skippedCount++;
        continue;
      }
      
      const maxGroupSize = tour.maxGroupSize || 10;
      const pricePerPerson = tour.pricePerPerson;
      
      // Create simple pricing tiers: same price for all group sizes
      // This is a basic reconstruction - suppliers should edit tours for proper tiered pricing
      const groupPricingTiers = [{
        minPeople: 1,
        maxPeople: maxGroupSize,
        price: pricePerPerson.toString()
      }];
      
      const tiersJson = JSON.stringify(groupPricingTiers);
      
      // Update or create main tour option
      if (mainTourOption) {
        // Update existing option
        await prisma.tourOption.update({
          where: { id: mainTourOption.id },
          data: {
            groupPricingTiers: tiersJson,
            price: pricePerPerson // Ensure price matches first tier
          }
        });
        console.log(`✅ Tour ${tour.id} (${tour.title}): Updated main tour option with groupPricingTiers`);
      } else {
        // Create new main tour option
        await prisma.tourOption.create({
          data: {
            tourId: tour.id,
            optionTitle: tour.title,
            optionDescription: tour.shortDescription || tour.fullDescription?.substring(0, 200) || 'Main tour option',
            durationHours: parseFloat(tour.duration?.replace(/[^0-9.]/g, '')) || 3,
            price: pricePerPerson,
            currency: tour.currency || 'INR',
            language: 'English',
            pickupIncluded: false,
            entryTicketIncluded: false,
            guideIncluded: true,
            carIncluded: false,
            groupPricingTiers: tiersJson,
            sortOrder: -1
          }
        });
        console.log(`✅ Tour ${tour.id} (${tour.title}): Created main tour option with groupPricingTiers`);
      }
      
      fixedCount++;
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ FIX COMPLETE');
    console.log(`   Fixed: ${fixedCount} tours`);
    console.log(`   Skipped: ${skippedCount} tours`);
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error fixing tour pricing:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixTourPricing()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
