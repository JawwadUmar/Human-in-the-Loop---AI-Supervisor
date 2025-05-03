const admin = require('../config/firebase')
const livekit = require('../config/livekit')
const {getAIResponse} = require('../services/openaiService')
const {generateTicketId} = require('../utils/idGenerator')
const { DataPacket_Kind } = require('livekit-server-sdk');
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
                ai_response: aiResponse.text
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


exports.resolveTicket = async (req, res) => {
    try {
      const { response } = req.body;
      const ticketId = req.params.id;
      const { TextEncoder } = require('text-encoding');
  
      // 1. Update Firestore
      await db.collection('tickets').doc(ticketId).update({
        status: 'resolved',
        human_response: response,
        resolved_at: admin.firestore.FieldValue.serverTimestamp()
      });
  
      // 2. Send LiveKit message (FINAL WORKING VERSION)
    //   await livekit.sendData({
    //     room: String(ticketId),
    //     data: new TextEncoder().encode(JSON.stringify({
    //       type: 'admin_response',
    //       text: response,
    //       timestamp: Date.now()
    //     })),
    //     kind: 1 // RELIABLE as number
    //   });

    await livekit.sendData(
        String(ticketId),
        new TextEncoder().encode(JSON.stringify({
          type: 'admin_response',
          text: response,
          timestamp: Date.now()
        })),
        DataPacket_Kind.RELIABLE // use enum instead of raw number for clarity
      );
  
      // 3. Store in knowledge base
      const ticket = await db.collection('tickets').doc(ticketId).get();
      await db.collection('knowledge_base').add({
        question: ticket.data().question,
        answer: response,
        source: 'human',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
  
      res.status(200).json({ success: true });
  
    } catch (error) {
      console.error('Resolution failed:', error);
      res.status(500).json({ 
        error: 'Failed to resolve ticket',
        details: error.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*[0-9A-ORZcf-nqry=><])/g, '')
      });
    }
  };
