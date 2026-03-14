import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { Users, Calendar } from 'lucide-react';

const TrainDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState('');

    useEffect(() => {
        const fetchTrain = async () => {
            try {
                const { data } = await API.get(`/trains/${id}`);
                setTrain(data);
            } catch (err) {
                setError('Train not found');
            } finally {
                setLoading(false);
            }
        };
        fetchTrain();
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
    }, [id]);

    const handleBooking = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (!date) {
            alert('Please select a travel date');
            return;
        }
        navigate(`/book/${id}?date=${date}`);
    };

    if (loading) return <div className="p-8 text-center text-xl">Loading train details...</div>;
    if (error || !train) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/trains" className="text-primary-600 hover:text-primary-700 mb-6 inline-block font-medium">&larr; Back to Search</Link>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{train.trainName}</h1>
                        <p className="text-primary-100 font-medium">Train No. {train.trainNumber}</p>
                    </div>
                </div>
                
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Route Information</h3>
                             <div className="space-y-4 relative">
                                <div className="flex gap-4">
                                     <div className="flex flex-col items-center">
                                         <div className="w-3 h-3 rounded-full bg-primary-500 mt-1.5" />
                                         <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                     </div>
                                     <div>
                                         <p className="font-bold text-lg text-gray-900">{train.source}</p>
                                         <p className="text-gray-500 text-sm">Departure: <span className="font-semibold text-gray-700">{train.departureTime}</span></p>
                                     </div>
                                </div>
                                 <div className="flex gap-4">
                                     <div className="flex flex-col items-center">
                                         <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
                                     </div>
                                     <div>
                                         <p className="font-bold text-lg text-gray-900">{train.destination}</p>
                                         <p className="text-gray-500 text-sm">Arrival: <span className="font-semibold text-gray-700">{train.arrivalTime}</span></p>
                                     </div>
                                </div>
                             </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{train.price || 500}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Availability</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${train.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className={`font-semibold ${train.availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {train.availableSeats > 0 ? `${train.availableSeats} Seats Available` : 'Waitlisted'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Availability</h3>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                                <div className={`p-3 rounded-full ${train.availableSeats > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{train.availableSeats} <span className="text-base font-normal text-gray-500">tickets available</span></p>
                                    <p className="text-sm text-gray-500">Total capacity: {train.totalSeats}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mt-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Ticket</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                             <div className="flex-1 w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Travel Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="date" 
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleBooking}
                                disabled={train.availableSeats <= 0}
                                className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-md shadow-md transition-all"
                            >
                                {train.availableSeats > 0 ? 'Proceed to Book' : 'Sold Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainDetails;
