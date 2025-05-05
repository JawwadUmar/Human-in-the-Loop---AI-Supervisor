import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TicketCard from './TicketCard';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Status color mapping for badges
  const statusColors = {
    processing: 'bg-blue-100 text-blue-800',
    needs_human: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  };

  useEffect(() => {
    // Create a query for tickets ordered by creation date
    const q = query(
      collection(db, 'tickets'),
      orderBy('created_at', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ticketsData = [];
      querySnapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() });
      });
      setTickets(ticketsData);
      setLoading(false);

      // Optional: Show toast for new tickets
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && !change.doc.metadata.hasPendingWrites) {
          toast.info(`New ticket: ${change.doc.data().question.substring(0, 50)}...`, {
            autoClose: 5000,
          });
        }
      });
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' || ticket.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'processing', 'needs_human', 'resolved'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-md capitalize ${
              statusFilter === filter 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              statusColors={statusColors} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tickets found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDashboard;