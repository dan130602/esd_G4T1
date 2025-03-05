const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with the service account
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
