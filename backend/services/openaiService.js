const { OpenAI } = require('openai');
const calculateConfidence = require('../utils/confidenceCalculator');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


exports.getAIResponse = async(question) =>{

    // FOR TESTING: Force human escalation
    const MOCK_MODE = true; // Set to false when you have OpenAI key
    if (MOCK_MODE) {
        return { 
          text: null, 
          confidence: 0 // Always escalates to human
        };
    }

    try{

        const systemPrompt = `
        You are an AI assistant for a hair and beauty salon called "Glamour Studio". Here are key details about the salon:
        
        - Location: 123 Beauty Street, Downtown (next to City Mall)
        - Hours: Monday-Friday 9am-8pm, Saturday 10am-6pm, Closed Sunday
        - Services & Prices:
          * Haircut: $40-$60 (depending on stylist)
          * Coloring: $80-$150
          * Highlights: $90-$120
          * Manicure: $25-$40
          * Pedicure: $35-$50
          * Facial: $60-$90
        - Team: 5 professional stylists specializing in different techniques
        - Special Offers: 10% discount for first-time customers
        
        Be friendly, professional, and only answer questions you're confident about based on this information. 
        For complex questions (like specific styling advice or complaints), politely suggest contacting the salon directly.
        `;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: question}],
            temperature: 0.7
        });

        return{

            text: response.choices[0].message.content,
            confidence: calculateConfidence(response)
        };
    }

    catch(error){
        return {text: null, confidence: 0};
    }
};