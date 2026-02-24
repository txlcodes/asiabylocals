const http = require('http');

const data = JSON.stringify({
  supplierId: 1, // Using first supplier
  title: "Test Tour with Itinerary Data Save",
  country: "India",
  city: "Agra",
  category: "Culture",
  locations: ["Taj Mahal"],
  durationValue: 2,
  durationUnit: "hours",
  duration: "2 hours",
  pricePerPerson: 10,
  currency: "INR",
  shortDescription: "Short desc",
  fullDescription: "Full desc",
  included: "Guide",
  images: ["img1", "img2", "img3", "img4"],
  itineraryItems: JSON.stringify([
    { title: "Stop 1", time: "10:00 PM", duration: "1h", description: "First stop", type: "visit", optional: false }
  ]),
  detailedItinerary: "This is a detailed itinerary.",
  tourOptions: [
    {
      optionTitle: "Option 1",
      optionDescription: "Option 1 desc",
      durationHours: 2,
      price: 10,
      groupPricingTiers: "[]"
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 5002, // assuming backend is on 5002
  path: '/api/tours',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
