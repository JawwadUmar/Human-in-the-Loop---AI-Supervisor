const { v4: uuidv4 } = require('uuid');

exports.generateTicketId = () => {
  return `ticket-${Date.now()}-${uuidv4().split('-')[0]}`;
};