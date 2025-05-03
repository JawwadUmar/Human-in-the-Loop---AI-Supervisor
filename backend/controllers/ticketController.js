const admin = require('../config/firebase')
const livekit = require('../config/livekit')
const {getAIResponse} = require('../services/openaiService')
const {generateTicketId} = require('../utils/idGenerator')
const db = admin.firestore();

exports.createTicket = async(req, res) =>{
    try {

        const { question, customerId } = req.body;
        const ticketId = generateTicketId();

        //Creating the ticket in the firebase

        await db.collection('tickets').doc(ticketId).set({
            ticket_id: ticketId,
            question,
            customerId,
            status: 'processing',
            created_at: new Date()
        })

        //Get the AI response
        const aiResponse = await getAIResponse(question);
        if(aiResponse.confidence > 0.7){
            await db.collection('tickets').doc(ticketId).update({
                status: 'resolved',
                ai_Response: aiResponse.text
            });

            return res.json({ticketId, response: aiResponse.text});
        }

        else{
            //AI couldn't answer it with confidence, create livekit room for human support
            await livekit.createRoom({name: ticketId});
            await db.collection('tickets').doc(ticketId).update({status: 'needs_human'});

            return res.json({ticketId, needsHuman: true});
        }
        
    } catch (error) {
        console.error('Ticket Creation Failed: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

exports.getTicketStatus = async (req, res) => {
    try{
        const ticket = await db.collection('tickets').doc(req.params.id).get();

        if(!ticket.exists){
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json(ticket.data());
    }

    catch (error) {
        res.status(500).json({ error: error.message });
      }
};