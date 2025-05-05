const express = require('express')
const router = express.Router();
const admin = require('../config/firebase')
const {createTicket, getTicketStatus, resolveTicket} = require('../controllers/ticketController')
const generateOperatorToken = require('../services/authService');
const db = admin.firestore();

router.post('/tickets', createTicket);
router.post('/tickets/:id', getTicketStatus);
router.post('/tickets/:id/resolve', resolveTicket);

// To test if the firebase is working man
router.get('/test-firestore', async (req, res) => {
    try {
      const docRef = db.collection('test').doc('test');
      await docRef.set({ test: new Date().toISOString() });
      res.send("Firestore connection successful!");
    } catch (err) {
      res.status(500).send(`Firestore error: ${err.message}`);
    }
  });


// Updated route to use query parameters
router.get('/operator-token', async (req, res) => {
  const { participantName, roomName = 'support' } = req.query; // Extract from URL params

  if (!participantName) {
    return res.status(400).json({ error: 'participantName is required in URL (e.g., ?participantName=admin)' });
  }

  const token = await generateOperatorToken(participantName, roomName);
  res.json({ token });
});

module.exports = router;