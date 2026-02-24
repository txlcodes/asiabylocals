const finalTourData = {
  supplierId: 1,
  title: 'Test Tour',
  slug: 'test-tour',
  country: 'India',
  city: 'Agra',
  category: 'Culture',
  locations: '[]',
  duration: '2 hours',
  pricePerPerson: 10,
  currency: 'INR',
  shortDescription: 'Short',
  fullDescription: 'Full',
  highlights: '[]',
  included: 'Guide',
  notIncluded: 'Meals',
  meetingPoint: 'Hotel',
  guideType: 'Local',
  tourTypes: '[]',
  images: '[]',
  languages: '[]',
  reviews: null,
  status: 'draft',
  itineraryItems: 'hello',
  detailedItinerary: 'world',
  visitorInfo: 'info',
  checklistItems: '[]',
  groupPricingTiers: '[]',
  groupPrice: 0,
  maxGroupSize: 10
};

const tourModelFields = [
  'supplierId', 'title', 'slug', 'country', 'city', 'category', 'locations',
  'duration', 'pricePerPerson', 'currency', 'shortDescription', 'fullDescription',
  'highlights', 'included', 'notIncluded', 'meetingPoint', 'guideType', 'tourTypes',
  'images', 'languages', 'reviews', 'status', 'options',
  'itineraryItems', 'detailedItinerary', 'visitorInfo', 'checklistItems'
];

Object.keys(finalTourData).forEach(key => {
  if (!tourModelFields.includes(key)) {
    console.warn('⚠️  Unexpected field in finalTourData, removing it:', key);
    delete finalTourData[key];
  }
});
console.log(finalTourData);
