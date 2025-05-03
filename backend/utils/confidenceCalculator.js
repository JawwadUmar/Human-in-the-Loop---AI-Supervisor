// Salon-specific confidence calculation
module.exports = function calculateConfidence(openaiResponse) {
  const content = openaiResponse.choices[0].message.content.toLowerCase();
  
  // Low confidence indicators
  const uncertainPhrases = [
    "i'm not sure", "i don't know", "contact the salon",
    "please ask", "unable to answer", "no information"
  ];

  // High confidence markers
  const confidentPhrases = [
    "we offer", "our price", "the cost is", "available at",
    "you can book", "our policy", "typically takes"
  ];

  // Scoring logic
  if (uncertainPhrases.some(phrase => content.includes(phrase))) {
    return 0.3; // Low confidence
  }
  
  if (confidentPhrases.some(phrase => content.includes(phrase))) {
    return 0.9; // High confidence
  }

  return 0.6; // Medium confidence
};