import { MapPin, Calendar, Clock, Users, ShieldCheck } from 'lucide-react';

const TicketCard = ({ bookingDetails }) => {
    if (!bookingDetails) return null;

    const train = bookingDetails.trainId || bookingDetails.trainDetails;
    const isCancelled = bookingDetails.status === 'Cancelled';

    return (
        <div className={`mt-8 mb-10 text-left border-2 ${isCancelled ? 'border-red-300' : 'border-gray-800'} rounded-xl bg-white shadow-xl relative overflow-hidden`}>
            {/* Top decorative banner */}
            <div className={`h-4 w-full ${isCancelled ? 'bg-red-500' : 'bg-primary-800'}`}></div>

            <div className="p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-700'}`}>
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">RAILWAY E-TICKET</h2>
                            <p className="text-gray-500 font-medium">Safe & Secure Journey</p>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">PNR Number</p>
                        <p className={`text-2xl font-black ${isCancelled ? 'text-red-600' : 'text-primary-700'} tracking-wider`}>{bookingDetails.pnr}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Passenger Info */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Passenger Name</p>
                            <p className="text-lg font-bold text-gray-900">{bookingDetails.userId?.name || 'Passenger'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Train</p>
                            <p className="text-lg font-bold text-gray-900">{train?.trainName} <span className="text-gray-500 text-sm ml-2">({train?.trainNumber})</span></p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Travel Class</p>
                            <p className="text-lg font-bold text-gray-900">AC First Class (1A)</p>
                        </div>
                    </div>

                    {/* Journey Details */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="relative">
                            {/* Route Line */}
                            <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gray-300"></div>
                            
                            {/* Source */}
                            <div className="flex items-start gap-4 mb-6 relative">
                                <div className="z-10 bg-white p-1 rounded-full border-2 border-primary-500 shadow-sm">
                                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg leading-none">{train?.source}</p>
                                    <p className="text-gray-500 text-sm mt-1">{train?.departureTime}</p>
                                </div>
                            </div>
                            
                            {/* Destination */}
                            <div className="flex items-start gap-4 relative">
                                <div className="z-10 bg-white p-1 rounded-full border-2 border-primary-500 shadow-sm">
                                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg leading-none">{train?.destination}</p>
                                    <p className="text-gray-500 text-sm mt-1">{train?.arrivalTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-primary-300" strokeWidth={1.5} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                            <p className="font-bold text-gray-900">{bookingDetails.travelDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary-300" strokeWidth={1.5} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Passengers</p>
                            <p className="font-bold text-gray-900">{bookingDetails.numberOfTickets}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-primary-300" strokeWidth={1.5} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Seats</p>
                            <p className="font-black text-primary-700">{bookingDetails.seatNumbers?.join(', ')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center text-primary-300 font-bold text-xl">₹</div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Price</p>
                            <p className="font-black text-gray-900">₹{bookingDetails.totalPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Status Ticket Punch */}
                <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-400 max-w-sm">
                        * Please carry a valid original photo ID card along with this E-Ticket. This ticket is subject to RailOne terms and conditions.
                    </div>
                    <div className={`px-6 py-2 border-2 ${isCancelled ? 'border-red-500 text-red-600' : 'border-green-500 text-green-600'} rounded text-lg font-black tracking-widest uppercase transform -rotate-2 bg-white/50 backdrop-blur-sm shadow-md`}>
                        {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                    </div>
                </div>
            </div>
            
            {/* Ticket jagged edge effect (bottom) */}
            <div className={`h-4 w-full flex space-x-2 px-2 overflow-hidden ${isCancelled ? 'bg-red-50' : 'bg-primary-50'}`}>
               {[...Array(40)].map((_, i) => (
                   <div key={i} className="-mt-2 w-4 h-4 rounded-full bg-white shadow-inner"></div>
               ))}
            </div>
        </div>
    );
};

export default TicketCard;
