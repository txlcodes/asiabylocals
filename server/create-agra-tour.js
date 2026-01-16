import prisma from './db.js';

// Create a new tour for Agra with options
const createAgraTour = async () => {
  try {
    console.log('🏗️ Creating new tour for Agra...\n');
    
    // Get first supplier
    const supplier = await prisma.supplier.findFirst();
    if (!supplier) {
      console.error('❌ No suppliers found. Please create a supplier first.');
      process.exit(1);
    }
    
    console.log('✅ Found supplier:', supplier.email, '(ID:', supplier.id, ')\n');
    
    // Tour data for Agra
    const tourData = {
      supplierId: supplier.id,
      title: 'Agra Heritage Walk: Taj Mahal & Agra Fort with Expert Guide',
      slug: 'agra-heritage-walk-taj-mahal-fort-expert-guide',
      country: 'India',
      city: 'Agra',
      category: 'Guided Tour',
      locations: JSON.stringify(['Taj Mahal', 'Agra Fort', 'Mehtab Bagh']),
      duration: '8 hours',
      pricePerPerson: 1200,
      currency: 'INR',
      shortDescription: 'Explore the iconic Taj Mahal and majestic Agra Fort with a licensed local guide. Discover Mughal history, architecture, and culture on this comprehensive heritage walk.',
      fullDescription: `Experience the grandeur of Agra's Mughal heritage on this comprehensive full-day tour. Your licensed local guide will take you through two of India's most iconic UNESCO World Heritage Sites: the magnificent Taj Mahal and the imposing Agra Fort.

**Taj Mahal Visit:**
Begin your journey at the Taj Mahal, one of the Seven Wonders of the World. Built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this white marble mausoleum is a masterpiece of Mughal architecture. Your expert guide will share fascinating stories about its construction, the love story behind it, and the intricate details of its design. Capture stunning photographs of this architectural marvel from various angles, including the famous reflection pool.

**Agra Fort Exploration:**
After the Taj Mahal, proceed to the majestic Agra Fort, a UNESCO World Heritage Site that served as the main residence of the Mughal emperors. Explore its palaces, halls, and gardens while learning about the fort's rich history, from its construction by Akbar to its use by subsequent Mughal rulers. Visit key structures like the Diwan-i-Aam (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience), and the beautiful Jahangir Palace.

**Mehtab Bagh (Moonlight Garden):**
Complete your tour with a visit to Mehtab Bagh, a beautiful garden complex across the Yamuna River that offers stunning views of the Taj Mahal, especially during sunset.

**What Makes This Tour Special:**
- Licensed local guide with deep knowledge of Mughal history
- Skip-the-line entry tickets (if option selected)
- Small group size for personalized attention
- Flexible timing to avoid crowds
- Photography tips and best spots
- Cultural insights and local stories

Perfect for history enthusiasts, architecture lovers, and anyone wanting to experience the best of Agra's heritage in one comprehensive tour.`,
      highlights: JSON.stringify([
        'Licensed local guide',
        'Skip-the-line entry tickets available',
        'Small group experience',
        'Photography tips',
        'Cultural insights'
      ]),
      included: `• Licensed local guide
• Entry tickets to Taj Mahal and Agra Fort
• Hotel pickup and drop-off (if option selected)
• Transportation in air-conditioned vehicle (if option selected)
• Bottled water
• All taxes and service charges`,
      notIncluded: `• Food and drinks
• Gratuities (optional)
• Personal expenses
• Camera fees (if applicable)`,
      meetingPoint: 'East Gate of Taj Mahal (or hotel pickup if option selected)',
      guideType: 'Tour Guide',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        'https://images.unsplash.com/photo-1585506942814-e0b6c8c7c2b6?w=800',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        'https://images.unsplash.com/photo-1585506942814-e0b6c8c7c2b6?w=800',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        'https://images.unsplash.com/photo-1585506942814-e0b6c8c7c2b6?w=800'
      ]),
      languages: JSON.stringify(['English', 'Hindi']),
      status: 'draft'
    };
    
    // Tour options
    const tourOptions = [
      {
        optionTitle: 'Basic Tour with Guide',
        optionDescription: 'Includes licensed guide and entry tickets to Taj Mahal and Agra Fort. Meet at Taj Mahal East Gate.',
        durationHours: 8,
        price: 1200,
        currency: 'INR',
        language: 'English',
        pickupIncluded: false,
        carIncluded: false,
        entryTicketIncluded: true,
        guideIncluded: true,
        sortOrder: 0
      },
      {
        optionTitle: 'Tour with Hotel Pickup',
        optionDescription: 'Includes everything in Basic Tour plus hotel pickup and drop-off in air-conditioned vehicle.',
        durationHours: 8,
        price: 1800,
        currency: 'INR',
        language: 'English',
        pickupIncluded: true,
        carIncluded: true,
        entryTicketIncluded: true,
        guideIncluded: true,
        sortOrder: 1
      },
      {
        optionTitle: 'Premium Tour with Private Car',
        optionDescription: 'Full-day private tour with dedicated guide, private air-conditioned car, hotel pickup/drop-off, and entry tickets.',
        durationHours: 8,
        price: 2500,
        currency: 'INR',
        language: 'English',
        pickupIncluded: true,
        carIncluded: true,
        entryTicketIncluded: true,
        guideIncluded: true,
        sortOrder: 2
      }
    ];
    
    console.log('📦 Tour data:');
    console.log('  - Title:', tourData.title);
    console.log('  - City:', tourData.city);
    console.log('  - Category:', tourData.category);
    console.log('  - Duration:', tourData.duration);
    console.log('  - Price:', tourData.currency, tourData.pricePerPerson);
    console.log('  - Options:', tourOptions.length);
    console.log('');
    
    // Create tour with options
    const tour = await prisma.tour.create({
      data: {
        supplierId: tourData.supplierId,
        title: tourData.title,
        slug: tourData.slug,
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
        status: tourData.status,
        options: {
          create: tourOptions
        }
      },
      include: {
        options: true
      }
    });
    
    console.log('✅ Tour created successfully!');
    console.log('   ID:', tour.id);
    console.log('   Title:', tour.title);
    console.log('   Slug:', tour.slug);
    console.log('   Status:', tour.status);
    console.log('   Options created:', tour.options.length);
    console.log('');
    console.log('📋 Tour Options:');
    tour.options.forEach((option, index) => {
      console.log(`   ${index + 1}. ${option.optionTitle}`);
      console.log(`      Price: ${option.currency}${option.price}`);
      console.log(`      Duration: ${option.durationHours} hours`);
      console.log(`      Language: ${option.language}`);
    });
    console.log('');
    console.log('🌐 URLs:');
    console.log(`   City Page: http://localhost:3000/india/agra`);
    console.log(`   Tour Page: http://localhost:3000/india/agra/${tour.slug}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Go to supplier dashboard');
    console.log('   2. Find this tour in "My Tours"');
    console.log('   3. Click "Submit" to submit for review');
    console.log('   4. Once approved, it will be live on the site!');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error creating tour:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

createAgraTour();


