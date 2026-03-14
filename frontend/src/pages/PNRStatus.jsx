import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import API from '../api';
import TicketCard from '../components/TicketCard';

const PNRStatus = () => {
    const [pnr, setPnr] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!pnr.trim()) return;

        setLoading(true);
        setError('');
        setBookingDetails(null);

        try {
            const { data } = await API.get(`/bookings/pnr/${pnr}`);
            setBookingDetails(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch PNR status. Please check your PNR number.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Check PNR Status</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Enter your 9-character PNR number below to view your current ticket status, passenger details, and seat allotments.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-gray-100 p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value.toUpperCase())}
                            placeholder="Enter PNR Number (e.g. RAI123456)"
                            className="w-full pl-6 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !pnr}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 sm:w-auto w-full"
                    >
                        {loading ? 'Searching...' : <><Search className="w-6 h-6" /> Check Status</>}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-fade-in">
                         <AlertCircle className="w-6 h-6 flex-shrink-0" />
                         <p className="font-semibold">{error}</p>
                    </div>
                )}
            </div>

            {bookingDetails && (
                <div className="animate-slide-up">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">Ticket Details <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full ml-2">Found</span></h2>
                    <TicketCard bookingDetails={bookingDetails} />
                </div>
            )}
        </div>
    );
};

export default PNRStatus;
