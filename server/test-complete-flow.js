const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';

console.log('🧪 Testing Complete Blogging Platform Flow...\n');

// Test data
let testUser = null;
let testToken = null;
let testBlogId = null;

async function testRegistration() {
    console.log('1️⃣ Testing User Registration...');
    try {
        const userData = {
            username: 'testuser' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'password123'
        };
        
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        console.log('✅ Registration successful');
        testUser = userData;
        testToken = response.data.token;
        return true;
    } catch (error) {
        console.log('❌ Registration failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n2️⃣ Testing User Login...');
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful');
        testToken = response.data.token;
        return true;
    } catch (error) {
        console.log('❌ Login failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testCreateBlog() {
    console.log('\n3️⃣ Testing Blog Creation...');
    try {
        const blogData = {
            title: 'Test Blog Post',
            content: '<p>This is a test blog post with <strong>rich text</strong> content.</p>',
            tags: ['test', 'demo'],
            status: 'published'
        };
        
        const response = await axios.post(`${BASE_URL}/posts`, blogData, {
            headers: { 'x-auth-token': testToken }
        });
        console.log('✅ Blog creation successful');
        testBlogId = response.data._id;
        return true;
    } catch (error) {
        console.log('❌ Blog creation failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testGetBlogs() {
    console.log('\n4️⃣ Testing Blog Listing...');
    try {
        const response = await axios.get(`${BASE_URL}/posts`);
        console.log(`✅ Found ${response.data.length} blogs`);
        return true;
    } catch (error) {
        console.log('❌ Blog listing failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testLikeBlog() {
    console.log('\n5️⃣ Testing Blog Like...');
    try {
        const response = await axios.put(`${BASE_URL}/posts/${testBlogId}/like`, {}, {
            headers: { 'x-auth-token': testToken }
        });
        console.log('✅ Blog like successful');
        return true;
    } catch (error) {
        console.log('❌ Blog like failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testAddComment() {
    console.log('\n6️⃣ Testing Comment Addition...');
    try {
        const response = await axios.post(`${BASE_URL}/posts/${testBlogId}/comment`, {
            text: 'This is a test comment!'
        }, {
            headers: { 'x-auth-token': testToken }
        });
        console.log('✅ Comment addition successful');
        return true;
    } catch (error) {
        console.log('❌ Comment addition failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testSearchBlogs() {
    console.log('\n7️⃣ Testing Blog Search...');
    try {
        const response = await axios.get(`${BASE_URL}/posts?search=test`);
        console.log(`✅ Search found ${response.data.length} blogs`);
        return true;
    } catch (error) {
        console.log('❌ Blog search failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testGetUserProfile() {
    console.log('\n8️⃣ Testing User Profile...');
    try {
        const response = await axios.get(`${BASE_URL}/auth`, {
            headers: { 'x-auth-token': testToken }
        });
        console.log('✅ User profile retrieved successfully');
        return true;
    } catch (error) {
        console.log('❌ User profile failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function runAllTests() {
    const tests = [
        testRegistration,
        testLogin,
        testCreateBlog,
        testGetBlogs,
        testLikeBlog,
        testAddComment,
        testSearchBlogs,
        testGetUserProfile
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        const result = await test();
        if (result) passed++;
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`🏁 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Your blogging platform is working perfectly!');
    } else {
        console.log('⚠️ Some tests failed. Check the errors above.');
    }
    
    console.log('\n📋 Features Tested:');
    console.log('✅ User Registration');
    console.log('✅ User Login');
    console.log('✅ Blog Creation');
    console.log('✅ Blog Listing');
    console.log('✅ Blog Likes');
    console.log('✅ Comments');
    console.log('✅ Search Functionality');
    console.log('✅ User Profile');
}

// Run the tests
runAllTests().catch(console.error);
