const admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ai-agent-app-bdc7a.firebaseio.com"
});

module.exports = admin;
