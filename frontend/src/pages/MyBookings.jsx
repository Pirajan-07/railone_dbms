import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Ticket, XCircle, MapPin, Calendar, Clock, Eye } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const { data } = await API.get(`/bookings/user/${userInfo._id}`);
                // Sort by booking time descending
                const sorted = data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
                setBookings(sorted);
            } catch (err) {
                setError('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate, userInfo]);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) {
            try {
                await API.delete(`/bookings/${id}`);
                alert('Booking cancelled successfully');
                // Refresh list
                setBookings(bookings.map(book => 
                    book._id === id ? { ...book, status: 'Cancelled' } : book
                ));
            } catch (err) {
                alert(err.response?.data?.message || 'Cancellation failed');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-xl">Loading your bookings...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Ticket className="w-8 h-8 text-primary-600" />
                My Bookings
            </h1>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center border border-gray-100">
                    <p className="text-gray-600 mb-4">You have no bookings yet.</p>
                    <button 
                        onClick={() => navigate('/trains')}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded transition-colors"
                    >
                        Search Trains
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 border border-gray-100 relative overflow-hidden">
                            {booking.status === 'Cancelled' && (
                                <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    CANCELLED
                                </div>
                            )}
                            {booking.status === 'Confirmed' && (
                                <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    CONFIRMED
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4 pt-2">
                                <div>
                                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">PNR: {booking.pnr || 'N/A'}</p>
                                    <h3 className="text-xl font-bold text-gray-900">{booking.trainId?.trainName || 'Unknown Train'}</h3>
                                    <p className="text-sm text-gray-500 font-medium">Train No: {booking.trainId?.trainNumber || 'N/A'}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <p className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                        Seats: {booking.seatNumbers?.join(', ') || booking.seatNumber}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">Passengers: {booking.numberOfTickets || 1}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                  <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-gray-400" />
                                      <span className="font-medium">{booking.trainId?.source} &rarr; {booking.trainId?.destination}</span>
                                  </div>
                                  <div className="font-bold text-gray-900">
                                    ₹{booking.totalPrice || (booking.trainId?.price || 500)}
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-700 gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Date: <span className="font-medium">{booking.travelDate}</span></span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700 gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{booking.trainId?.departureTime} - {booking.trainId?.arrivalTime}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                                <p>Booked on: {new Date(booking.bookingTime).toLocaleDateString()}</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate(`/ticket/${booking._id}`)}
                                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded transition-colors"
                                    >
                                        <Eye className="w-4 h-4" /> View Ticket
                                    </button>
                                    {booking.status === 'Confirmed' && (
                                        <button 
                                            onClick={() => handleCancel(booking._id)}
                                            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
