import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';

const CITIES = [
  'Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 
  'Kolkata', 'Ahmedabad', 'Pune', 'Varanasi', 'Bhopal', 'Chandigarh', 'Mysore'
];

const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (source && destination) {
      navigate(`/trains?source=${source}&destination=${destination}`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your Journey Begins Here</h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto">Book train tickets seamlessly with RailOne. Fast, secure, and reliable.</p>
          
          {/* Search Box */}
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="source">
                  From Station
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-50 focus:bg-white px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled>Select City ▼</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="destination">
                  To Station
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-50 focus:bg-white px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled>Select City ▼</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex-1 w-full md:w-auto">
                 <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="date">
                  Travel Date
                </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                 <input
                    id="date"
                    type="date"
                    className="pl-10 block w-full rounded-md border border-gray-300 bg-gray-50 focus:bg-white px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-md shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose RailOne?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
                    <p className="text-gray-600">Get your tickets confirmed in seconds with our optimized booking engine.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                    <p className="text-gray-600">Your transactions are protected with enterprise-grade security protocols.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Easy Cancellations</h3>
                    <p className="text-gray-600">Change of plans? Cancel your tickets hassle-free and get instant refunds.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
