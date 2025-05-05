import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TicketDetailsModal = ({ ticketId, onClose }) => {
    const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');

  // Status color mapping
  const statusColors = {
    processing: 'bg-blue-100 text-blue-800',
    needs_human: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'tickets', ticketId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setTicket({ id: docSnap.id, ...docSnap.data() });
          setResponseText(docSnap.data().human_response || '');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        toast.error("Failed to load ticket details");
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleResolveTicket = async () => {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: 'resolved',
        human_response: responseText,
        resolved_at: new Date()
      });
      toast.success("Ticket resolved successfully!");
      onClose();
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("Failed to resolve ticket");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Ticket Not Found</h2>
          <p className="mb-4">The requested ticket could not be loaded.</p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">Ticket Details</h2>
              <p className="text-gray-500">ID: {ticket.ticket_id || ticket.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[ticket.status]}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-1">Created</h3>
              <p>{format(ticket.created_at?.toDate(), 'MMM dd, yyyy hh:mm a')}</p>
            </div>
            {ticket.resolved_at && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Resolved</h3>
                <p>{format(ticket.resolved_at?.toDate(), 'MMM dd, yyyy hh:mm a')}</p>
              </div>
            )}
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Customer Question</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {ticket.question}
            </div>
          </div>

          {/* AI Response (if exists) */}
          {ticket.ai_response && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">AI Response</h3>
              <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
                {ticket.ai_response}
              </div>
            </div>
          )}

          {/* Agent Response Area */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Your Response</h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 min-h-32"
              placeholder="Type your response here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            {ticket.status === 'needs_human' && (
              <button
                onClick={() => {
                  // Add LiveKit room joining logic here
                  toast.info("Connecting to support room...");
                  navigate('/adminchat'); // This will redirect to /Customer
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Join Support Room
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleResolveTicket}
              disabled={!responseText.trim()}
              className={`px-4 py-2 rounded-md ${responseText.trim() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Mark as Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;