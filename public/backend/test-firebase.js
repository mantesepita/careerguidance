const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();

  async function testConnection() {
    try {
      console.log('🔄 Testing Firebase connection...');
      
      // Test by listing collections
      const collections = await db.listCollections();
      console.log('✅ Firebase connection successful!');
      console.log('📁 Available collections:', collections.map(col => col.id));
      
      // Try to create a test document
      const testRef = db.collection('test').doc('connection-test');
      await testRef.set({
        message: 'Firebase connection test',
        timestamp: new Date()
      });
      console.log('✅ Test document created successfully!');
      
      // Clean up
      await testRef.delete();
      console.log('✅ Test document cleaned up!');
      
    } catch (error) {
      console.error('❌ Firebase operation failed:', error);
    }
  }

  testConnection();

} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}