// const { OpenAI } = require('openai')
// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

const { OpenAI } = require('openai');

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
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: question}],
            temperature: 0.7
        });

        return{

            text: response.choices[0].message.content,
            confidence: response.choices[0].finish_reason === 'stop' ? 1: 0.5
        };
    }

    catch(error){
        return {text: null, confidence: 0};
    }
};