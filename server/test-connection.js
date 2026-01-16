// Quick test script to check if server is running
import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('📊 Response:', json);
    } catch (e) {
      console.log('📄 Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Server is NOT running or not accessible');
  console.error('   Error:', error.message);
  console.log('\n💡 To start the server:');
  console.log('   cd server && npm start');
});

req.end();

