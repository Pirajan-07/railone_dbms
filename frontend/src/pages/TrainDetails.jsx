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
                <div className="bg-primary-600 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h1 className="text-3xl font-bold">{train.trainName}</h1>
                            {train.trainType && (
                                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${train.trainType === 'SHATABDI' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                    {train.trainType}
                                </span>
                            )}
                        </div>
                        <p className="text-primary-100 font-medium">Train No. {train.trainNumber}</p>
                    </div>
                </div>
                
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Route Information</h3>
                             <div className="space-y-4 relative">
                                {train.routes && train.routes.length > 0 ? (
                                    train.routes.map((route, index) => (
                                        <div key={index} className="flex gap-4 relative">
                                             <div className="flex flex-col items-center relative z-10 w-4">
                                                 <div className={`w-3 h-3 rounded-full shadow-sm mt-1.5 ${index === 0 ? 'bg-primary-500' : index === train.routes.length - 1 ? 'bg-red-500' : 'bg-white border-2 border-gray-400'}`} />
                                                 {index < train.routes.length - 1 && <div className="absolute top-4 w-0.5 h-full bg-gray-300 left-1.5" />}
                                             </div>
                                             <div className="pb-6">
                                                 <p className="font-bold text-lg text-gray-900">{route.stationName}</p>
                                                 {index === 0 && <p className="text-gray-500 text-sm">Departure: <span className="font-semibold text-gray-700">{train.departureTime}</span></p>}
                                                 {index === train.routes.length - 1 && <p className="text-gray-500 text-sm">Arrival: <span className="font-semibold text-gray-700">{train.arrivalTime}</span></p>}
                                                 {index !== 0 && index !== train.routes.length - 1 && <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Intermediate Stop</p>}
                                             </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
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
                                    </>
                                )}
                             </div>

                            <div className="pt-4 border-t border-gray-100 mt-8">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Available Classes</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {train.classes && train.classes.map(cls => (
                                        <div key={cls.classId} className={`p-4 rounded-xl border-2 ${cls.availableSeats > 0 ? 'border-primary-100 bg-primary-50' : 'border-gray-100 bg-gray-50'} transition-all`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-lg text-gray-900">
                                                    {(() => {
                                                        const titles = { '1A': '1st Class AC (1A)', '2A': '2nd Class AC (2A)', '3A': '3rd Class AC (3A)', 'CC': 'AC Chair Car (CC)', 'SL': 'Sleeper (SL)', '2S': 'Second Sitting (2S)', 'GN': 'General (GN)' };
                                                        return titles[cls.classType] || cls.classType;
                                                    })()}
                                                </span>
                                                <span className="font-black text-primary-700">₹{cls.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className={`w-4 h-4 ${cls.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`} />
                                                    <span className={`text-sm font-semibold ${cls.availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {cls.availableSeats > 0 ? `${cls.availableSeats} Available` : 'Waitlisted'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
