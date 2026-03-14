import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api';
import { Clock, MapPin, Users } from 'lucide-react';

const TrainList = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    
    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    const source = searchParams.get('source');
    const destination = searchParams.get('destination');

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                setLoading(true);
                let url = '/trains';
                if (source && destination) {
                    url += `?source=${source}&destination=${destination}`;
                }
                const { data } = await API.get(url);
                setTrains(data);
            } catch (err) {
                setError('Failed to fetch trains');
            } finally {
                setLoading(false);
            }
        };
        fetchTrains();
    }, [source, destination]);

    if (loading) return <div className="p-8 text-center text-xl font-medium">Loading available trains...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {source && destination ? `Trains from ${source} to ${destination}` : 'All Available Trains'}
            </h1>
            
            {trains.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-lg text-gray-600">No trains found for this route.</p>
                    <Link to="/" className="text-primary-600 font-bold hover:underline mt-4 inline-block">Go back and edit search</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {trains.map(train => (
                        <div key={train._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex-1 w-full relative">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-2xl font-bold text-primary-600">{train.trainName}</h2>
                                        {train.trainType && (
                                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${train.trainType === 'SHATABDI' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                                                {train.trainType}
                                            </span>
                                        )}
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold self-start sm:self-auto border border-gray-200">#{train.trainNumber}</span>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-gray-600 relative">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{train.source}</p>
                                            <p className="text-sm">{train.departureTime}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="hidden md:flex flex-1 items-center justify-center px-4 self-center relative w-full h-8">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="w-full h-0.5 bg-gray-200" />
                                        </div>
                                        <Clock className="w-5 h-5 text-gray-400 bg-white relative z-10 px-1" />
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{train.destination}</p>
                                            <p className="text-sm">{train.arrivalTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:items-end w-full md:w-48 gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="w-4 h-4 text-primary-500" />
                                    <span className={train.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}>
                                        {train.availableSeats} Seats Available
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 mb-2">
                                    <span className="text-gray-500 text-sm">Starts at</span>
                                    <span className="text-lg font-bold text-gray-900">₹{train.price}</span>
                                </div>
                                <Link 
                                    to={`/train/${train._id}`}
                                    className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors font-medium shadow-sm block"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainList;
