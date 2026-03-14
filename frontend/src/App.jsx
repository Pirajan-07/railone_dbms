import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TrainList from './pages/TrainList';
import TrainDetails from './pages/TrainDetails';
import BookTicket from './pages/BookTicket';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ViewTicket from './pages/ViewTicket';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-[#f8fafc]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/trains" element={<TrainList />} />
            <Route path="/train/:id" element={<TrainDetails />} />
            <Route path="/book/:id" element={<BookTicket />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/ticket/:id" element={<ViewTicket />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
