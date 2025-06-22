const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test registration
async function testRegistration() {
  try {
    console.log('Testing registration...');
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    };
    
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', response.data);
    return testUser;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
}

// Test login
async function testLogin(email, password) {
  try {
    console.log('Testing login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    console.log('✅ Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Test auth verification
async function testAuthVerification(token) {
  try {
    console.log('Testing auth verification...');
    const response = await axios.get(`${BASE_URL}/auth`, {
      headers: { 'x-auth-token': token }
    });
    console.log('✅ Auth verification successful:', response.data);
  } catch (error) {
    console.error('❌ Auth verification failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting authentication tests...\n');
  
  const testUser = await testRegistration();
  if (testUser) {
    console.log('\n---\n');
    const token = await testLogin(testUser.email, testUser.password);
    if (token) {
      console.log('\n---\n');
      await testAuthVerification(token);
    }
  }
  
  console.log('\n🏁 Tests completed!');
}

runTests(); 