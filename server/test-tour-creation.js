import prisma from './db.js';

// Test tour creation with sample data
const testTourCreation = async () => {
  try {
    console.log('🧪 Testing tour creation...\n');
    
    // Get first supplier
    const supplier = await prisma.supplier.findFirst();
    if (!supplier) {
      console.error('❌ No suppliers found. Please create a supplier first.');
      process.exit(1);
    }
    
    console.log('✅ Found supplier:', supplier.email, '(ID:', supplier.id, ')\n');
    
    // Sample tour data (matching what frontend sends)
    const tourData = {
      supplierId: String(supplier.id),
      title: 'Test Taj Mahal Tour',
      country: 'India',
      city: 'Agra',
      category: 'Guided Tour',
      locations: JSON.stringify(['Taj Mahal', 'Agra Fort']),
      duration: '4 hours',
      pricePerPerson: 900,
      currency: 'INR',
      shortDescription: 'A wonderful tour of the Taj Mahal',
      fullDescription: 'This is a comprehensive tour of the Taj Mahal, one of the seven wonders of the world. You will explore the beautiful architecture and learn about its history.',
      highlights: JSON.stringify(['Skip the line', 'Expert guide', 'Small group']),
      included: 'Entry ticket, Guide, Transportation',
      notIncluded: 'Food and drinks',
      meetingPoint: 'Hotel pickup',
      guideType: 'Tour Guide',
      images: JSON.stringify([
        'data:image/jpeg;base64,/9j/4AAQSkZJRg==', // Dummy base64
        'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
        'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
        'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      ]),
      languages: JSON.stringify(['English'])
    };
    
    console.log('📦 Tour data to create:');
    console.log('  - Title:', tourData.title);
    console.log('  - City:', tourData.city);
    console.log('  - Category:', tourData.category);
    console.log('  - Images count:', JSON.parse(tourData.images).length);
    console.log('  - Locations count:', JSON.parse(tourData.locations).length);
    console.log('  - Languages count:', JSON.parse(tourData.languages).length);
    console.log('  - Has fullDescription:', !!tourData.fullDescription);
    console.log('  - Has included:', !!tourData.included);
    console.log('');
    
    // Test validation (same as server)
    const missing = [];
    if (!tourData.supplierId) missing.push('supplierId');
    if (!tourData.title) missing.push('title');
    if (!tourData.country) missing.push('country');
    if (!tourData.city) missing.push('city');
    if (!tourData.category) missing.push('category');
    if (!tourData.fullDescription) missing.push('fullDescription');
    if (!tourData.included) missing.push('included');
    if (!tourData.images) missing.push('images');
    
    if (missing.length > 0) {
      console.error('❌ Missing fields:', missing);
      process.exit(1);
    }
    
    // Parse JSON fields
    let locationsArray = [];
    let imagesArray = [];
    let languagesArray = [];
    let highlightsArray = [];
    
    try {
      locationsArray = typeof tourData.locations === 'string' ? JSON.parse(tourData.locations) : (Array.isArray(tourData.locations) ? tourData.locations : []);
      imagesArray = typeof tourData.images === 'string' ? JSON.parse(tourData.images) : (Array.isArray(tourData.images) ? tourData.images : []);
      languagesArray = typeof tourData.languages === 'string' ? JSON.parse(tourData.languages) : (Array.isArray(tourData.languages) ? tourData.languages : []);
      highlightsArray = tourData.highlights ? (typeof tourData.highlights === 'string' ? JSON.parse(tourData.highlights) : (Array.isArray(tourData.highlights) ? tourData.highlights : [])) : [];
      
      console.log('✅ JSON parsing successful:');
      console.log('  - Locations:', locationsArray.length);
      console.log('  - Images:', imagesArray.length);
      console.log('  - Languages:', languagesArray.length);
      console.log('  - Highlights:', highlightsArray.length);
      console.log('');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      process.exit(1);
    }
    
    // Validate images
    if (!Array.isArray(imagesArray) || imagesArray.length < 4) {
      console.error('❌ Insufficient images:', imagesArray.length, 'provided, need at least 4');
      process.exit(1);
    }
    
    // Validate category
    const validCategories = ['Entry Ticket', 'Guided Tour'];
    if (!validCategories.includes(tourData.category)) {
      console.error('❌ Invalid category:', tourData.category);
      process.exit(1);
    }
    
    console.log('✅ All validations passed!\n');
    console.log('🎯 Ready to create tour in database...\n');
    
    // Actually create the tour (commented out to avoid creating test data)
    // Uncomment to test actual creation:
    /*
    const tour = await prisma.tour.create({
      data: {
        supplierId: parseInt(tourData.supplierId),
        title: tourData.title,
        country: tourData.country,
        city: tourData.city,
        category: tourData.category,
        locations: tourData.locations,
        duration: tourData.duration,
        pricePerPerson: tourData.pricePerPerson,
        currency: tourData.currency,
        shortDescription: tourData.shortDescription,
        fullDescription: tourData.fullDescription,
        highlights: tourData.highlights,
        included: tourData.included,
        notIncluded: tourData.notIncluded,
        meetingPoint: tourData.meetingPoint,
        guideType: tourData.guideType,
        images: tourData.images,
        languages: tourData.languages,
        status: 'draft'
      }
    });
    
    console.log('✅ Tour created successfully!');
    console.log('   ID:', tour.id);
    console.log('   Title:', tour.title);
    */
    
    console.log('✅ Test completed - all validations passed!');
    console.log('   (Tour creation commented out to avoid test data)');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
};

testTourCreation();


