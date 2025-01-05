/**
 * Import function triggers from their respective submodules:
 *
 * const { onCall } = require("firebase-functions/v2/https");
 * const { onDocumentWritten } = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin SDK
admin.initializeApp();

// HTTP function
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Callable function to add admin role
exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // Ensure the request is from an authenticated user with admin privileges
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError("permission-denied",
        "Request not authorized");
  }

  const email = data.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, {admin: true});
    return {message: `Success! ${email} has been made an admin.`};
  } catch (error) {
    return error;
  }
});
