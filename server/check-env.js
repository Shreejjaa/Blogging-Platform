require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('================================');

const requiredVars = [
  'MONGO_URI',
  'JWT_SECRET'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '[HIDDEN]' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allGood = false;
  }
});

console.log('\n================================');
if (allGood) {
  console.log('🎉 All required environment variables are set!');
} else {
  console.log('⚠️  Some environment variables are missing. Please check your .env file.');
}

// Check if MongoDB URI is valid
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  if (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://')) {
    console.log('✅ MongoDB URI format looks valid');
  } else {
    console.log('❌ MongoDB URI format might be invalid');
  }
} 