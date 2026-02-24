const tourModelFields = [
  'supplierId', 'title', 'slug', 'country', 'city', 'category', 'locations',
  'duration', 'pricePerPerson', 'currency', 'shortDescription', 'fullDescription',
  'highlights', 'included', 'notIncluded', 'meetingPoint', 'guideType', 'tourTypes',
  'images', 'languages', 'reviews', 'status', 'options',
  'itineraryItems', 'detailedItinerary', 'visitorInfo', 'checklistItems',
  // ADDED missing fields from schema
  'maxGroupSize', 'groupPrice', 'groupPricingTiers', 'unavailableDates', 'unavailableDaysOfWeek'
];
console.log(tourModelFields);
