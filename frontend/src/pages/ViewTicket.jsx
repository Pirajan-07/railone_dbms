import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import API from '../api';
import TicketCard from '../components/TicketCard';

const ViewTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const { data } = await API.get(`/bookings/${id}`);
                setBooking(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load ticket details.');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const downloadTicket = () => {
        const element = document.getElementById('ticket');
        const opt = {
            margin: 0.5,
            filename: `RailwayTicket_${booking.pnr}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
                <p className="font-bold text-xl mb-2">Oops!</p>
                <p>{error}</p>
                <button 
                    onClick={() => navigate('/my-bookings')}
                    className="mt-6 bg-white text-red-600 font-bold py-2 px-6 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!booking) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <button 
                    onClick={() => navigate('/my-bookings')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Bookings
                </button>

                <div className="flex gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-6 py-2.5 rounded-lg font-medium shadow-md transition-colors print:hidden"
                    >
                        <Printer className="w-4 h-4" />
                        Print Ticket
                    </button>
                    <button 
                        onClick={downloadTicket}
                        className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 px-6 py-2.5 rounded-lg font-medium shadow-md transition-colors print:hidden"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Printable Area Container */}
            <div id="ticket" className="print-container">
                {/* Visual rendering wrapper */}
                <div className="print-area">
                    <div className="mb-6 text-center print:block hidden">
                        <h1 className="text-3xl font-black text-gray-900 tracking-wider">RAILONE TICKETING</h1>
                        <p className="text-gray-500">Official Electronic Reservation Slip (ERS)</p>
                    </div>
                    
                    <TicketCard bookingDetails={booking} />
                    
                    <div className="mt-8 text-center text-sm text-gray-500 print:block hidden border-t border-gray-200 pt-6">
                        <p>This is a computer generated ticket. No signature is required.</p>
                        <p>For support, contact support@railone.com | 1-800-RAILONE</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTicket;
