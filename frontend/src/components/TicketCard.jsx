import React, { useState } from 'react';
import { format } from 'date-fns';
import TicketDetailsModal from './TicketDetailsModal';

const TicketCard = ({ ticket, statusColors }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format the timestamp
  const formattedDate = ticket.created_at?.toDate 
    ? format(ticket.created_at.toDate(), 'MMM dd, yyyy hh:mm a')
    : 'Date not available';

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-6">
          {/* Status and Date */}
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status] || 'bg-gray-100'}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className="text-gray-500 text-sm">
              {formattedDate}
            </span>
          </div>
          
          {/* Question Preview */}
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">
            {ticket.question}
          </h3>
          
          {/* Response Preview */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {ticket.ai_response || ticket.human_response || 'No response yet...'}
          </p>
          
          {/* Footer */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              ID: {ticket.ticket_id || ticket.id.substring(0, 8)}
            </span>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TicketDetailsModal 
          ticketId={ticket.id} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default TicketCard;