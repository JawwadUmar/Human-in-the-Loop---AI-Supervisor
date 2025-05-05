import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const CustomerPortal = () => {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const ticketId = `T-${Date.now().toString().slice(-6)}`;
      
      await addDoc(collection(db, 'tickets'), {
        ticket_id: ticketId,
        question,
        customerEmail: email,
        // status: 'processing',//needs_human
        status: 'needs_human',//needs_human
        created_at: serverTimestamp()
      });

      toast.success(
        <div>
          <p>Ticket #{ticketId} created successfully!</p>
          <button 
            onClick={() => navigate('/customerchat')}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Go to Live Chat Support
          </button>
        </div>,
        { autoClose: 5000 }
      );

      setQuestion('');
      setEmail('');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Submit Your Question</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border rounded-md"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800">What happens next?</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
            <li>You'll receive a confirmation email</li>
            <li>Our AI will try to answer immediately in the room</li>
            <li>If needed, a human agent will join within 10 minutes</li>
          </ol>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default CustomerPortal;