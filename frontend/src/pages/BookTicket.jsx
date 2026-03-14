import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertTriangle } from 'lucide-react';
import API from '../api';
import TicketCard from '../components/TicketCard';

const BookTicket = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date');

    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [passengers, setPassengers] = useState([{ name: '', age: '', gender: '' }]);
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const generateCaptcha = () => {
        const text = Math.random().toString(36).substring(2, 7).toUpperCase();
        setCaptchaText(text);
        setCaptchaInput('');
    };

    // Init captcha
    useEffect(() => {
        generateCaptcha();
    }, []);

    // Sync passengers array with numberOfTickets
    useEffect(() => {
        setPassengers(prev => {
            const newPassengers = [...prev];
            if (numberOfTickets > prev.length) {
                for (let i = prev.length; i < numberOfTickets; i++) {
                    newPassengers.push({ name: '', age: '', gender: '' });
                }
            } else if (numberOfTickets < prev.length) {
                newPassengers.length = numberOfTickets;
            }
            return newPassengers;
        });
    }, [numberOfTickets]);

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    useEffect(() => {
        const fetchTrain = async () => {
            try {
                const { data } = await API.get(`/trains/${id}`);
                setTrain(data);
                if (data && data.classes && data.classes.length > 0) {
                    setSelectedClassId(data.classes[0].classId);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch train details.');
            } finally {
                setLoading(false);
                setFetching(false);
            }
        };
        fetchTrain();
    }, [id]);

    const handleBooking = async () => {
        setLoading(true);
        setError('');

        if (captchaInput !== captchaText) {
            setError('Invalid Captcha code entered.');
            generateCaptcha();
            setLoading(false);
            return;
        }

        // Validate passengers
        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            if (!p.name || !p.age || !p.gender) {
                setError(`Please fill all details for Passenger ${i + 1}`);
                setLoading(false);
                return;
            }
        }

        try {
            const { data } = await API.post('/bookings', {
                trainId: id,
                travelDate: date,
                numberOfTickets,
                passengers,
                classId: selectedClassId
            });
            setBookingDetails({
                ...data,
                trainDetails: train
            });
            setBookingSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-xl">Loading...</div>;
    if (!train) return <div className="p-8 text-center text-red-500">Train details not found or failed to load.</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Confirm Your Booking</h1>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {/* Train Info Header */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{train.trainName}</h2>
                            <p className="text-gray-500 font-medium tracking-wide">#{train.trainNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-primary-600">₹{train.price || 500} <span className="text-sm text-gray-400 font-normal">/ seat</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Source</p>
                            <p className="font-bold text-gray-900 text-lg">{train.source}</p>
                            <p className="text-sm text-gray-600">{train.departureTime}</p>
                        </div>
                        <div className="flex-1 text-center hidden sm:block">
                            <div className="w-full flex items-center">
                                <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                                <div className="px-2 text-gray-400 font-bold">›</div>
                            </div>
                        </div>
                        <div className="flex-1 text-right">
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Destination</p>
                            <p className="font-bold text-gray-900 text-lg">{train.destination}</p>
                            <p className="text-sm text-gray-600">{train.arrivalTime}</p>
                        </div>
                    </div>
                </div>

                {!bookingSuccess ? (
                    <>
                        {/* Booking config */}
                        <div className="bg-gray-50 p-6 rounded-xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-gray-200">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Travel Date</p>
                                <p className="font-bold text-gray-900 text-lg">{date}</p>
                            </div>

                            <div className="w-full sm:w-auto">
                                <p className="text-sm text-gray-500 mb-1">Class</p>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                                    className="block w-full sm:w-48 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors shadow-sm"
                                >
                                    {train.classes && train.classes.map(cls => (
                                        <option key={cls.classId} value={cls.classId} disabled={cls.availableSeats <= 0}>
                                            {(() => {
                                                const titles = { '1A': '1st Class AC', '2A': '2nd Class AC', '3A': '3rd Class AC', 'CC': 'AC Chair Car', 'SL': 'Sleeper', '2S': 'Second Sitting', 'GN': 'General' };
                                                return titles[cls.classType] || cls.classType;
                                            })()} - ₹{cls.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full sm:w-auto">
                                <p className="text-sm text-gray-500 mb-1">Passengers / Tickets</p>
                                <select
                                    value={numberOfTickets}
                                    onChange={(e) => setNumberOfTickets(Number(e.target.value))}
                                    className="block w-full sm:w-40 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors shadow-sm"
                                >
                                    {[...Array(train.classes?.find(c => c.classId === selectedClassId)?.availableSeats > 4 ? 4 : train.classes?.find(c => c.classId === selectedClassId)?.availableSeats || 0)].map((_, idx) => {
                                        const num = idx + 1;
                                        return (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Ticket' : 'Tickets'}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <p className="font-bold text-3xl text-primary-600">
                                    ₹{ (train.classes?.find(c => c.classId === selectedClassId)?.price || 0) * numberOfTickets }
                                </p>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        <div className="mb-6 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Passenger Details</h3>
                            {passengers.map((passenger, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-3">
                                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Passenger {index + 1}</h4>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={passenger.name} 
                                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)} 
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-primary-500 focus:border-primary-500" 
                                            placeholder="Name" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input 
                                            type="number" 
                                            value={passenger.age} 
                                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)} 
                                            min="1" max="120" 
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-primary-500 focus:border-primary-500" 
                                            placeholder="Age" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select 
                                            value={passenger.gender} 
                                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)} 
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-primary-500 focus:border-primary-500 bg-white"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Captcha Section */}
                        <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Security Verification</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white tracking-[0.5em] px-6 py-3 rounded-lg font-mono font-bold text-xl select-none shadow-inner flex items-center justify-center min-w-[150px]">
                                    {captchaText}
                                </div>
                                <button 
                                    onClick={generateCaptcha} 
                                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                                >
                                    Refresh Captcha
                                </button>
                                <input 
                                    type="text" 
                                    value={captchaInput} 
                                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())} 
                                    placeholder="Enter Captcha Code Here" 
                                    className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono tracking-widest text-center sm:text-left shadow-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-3 animate-pulse">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={loading || !selectedClassId || (train.classes?.find(c => c.classId === selectedClassId)?.availableSeats || 0) < numberOfTickets || !captchaInput}
                            className="w-full h-14 flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:shadow-none text-lg"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <CreditCard className="w-6 h-6" />
                                    Confirm & Pay
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-md">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Booking Confirmed!</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Your transaction was successful and your tickets have been generated.</p>

                        {/* Confirmation Card */}
                        {bookingDetails && (
                            <TicketCard bookingDetails={bookingDetails} />
                        )}

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-2 bg-white text-gray-700 font-bold py-3 px-8 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookTicket;
