import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminChat from './pages/AdminChat';
import CustomerChat from './pages/CustomerChat';
import './App.css';
import TicketDashboard from './components/TicketDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerPortal from './components/CustomerPortal'


function Home(){
  return(
  <div className="min-h-screen bg-gray-50">
      {/* Optional Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-indigo-600">Support Ticket Dashboard</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TicketDashboard />
      </main>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/customerchat" element={<CustomerChat />} />
        <Route path="/customerportal" element = {<CustomerPortal/>}/>
        
      </Routes>
    </Router>
  );
}
