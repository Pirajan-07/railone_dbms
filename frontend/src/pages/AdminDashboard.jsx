import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Train, Ticket, Trash2, Edit, PlusCircle, LayoutDashboard, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('trains'); // trains, bookings
    const [trains, setTrains] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Train Form State
    const [showForm, setShowForm] = useState(false);
    const [editingTrain, setEditingTrain] = useState(null);
    const [formData, setFormData] = useState({
        trainName: '', trainNumber: '', source: '', destination: '', 
        totalSeats: '', availableSeats: '', departureTime: '', arrivalTime: '', price: ''
    });

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/');
            return;
        }
        fetchData();
    }, [navigate, userInfo]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [trainsRes, bookingsRes, usersRes] = await Promise.all([
                API.get('/trains'),
                API.get('/bookings'),
                API.get('/users')
            ]);
            setTrains(trainsRes.data);
            setAllBookings(bookingsRes.data);
            setTotalUsers(usersRes.data.length);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTrainSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTrain) {
                await API.put(`/trains/${editingTrain._id}`, formData);
                alert('Train updated successfully');
            } else {
                await API.post('/trains', { ...formData, availableSeats: formData.totalSeats });
                alert('Train added successfully');
            }
            setShowForm(false);
            setEditingTrain(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEditClick = (train) => {
        setEditingTrain(train);
        setFormData({
            trainName: train.trainName, trainNumber: train.trainNumber, 
            source: train.source, destination: train.destination, 
            totalSeats: train.totalSeats, availableSeats: train.availableSeats, 
            departureTime: train.departureTime, arrivalTime: train.arrivalTime, price: train.price || 500
        });
        setShowForm(true);
    };

    const handleDeleteTrain = async (id) => {
        if (window.confirm('Delete this train?')) {
            try {
                await API.delete(`/trains/${id}`);
                fetchData();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-xl">Loading Admin Dashboard...</div>;

    const totalTicketsSold = allBookings.filter(b => b.status === 'Confirmed').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit sticky top-20">
                <div className="flex items-center gap-2 mb-8 px-2 pt-2">
                    <LayoutDashboard className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                </div>
                <nav className="space-y-2">
                    <button 
                        onClick={() => setActiveTab('trains')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'trains' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Train className="w-5 h-5" />
                        Manage Trains
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Ticket className="w-5 h-5" />
                        All Bookings
                    </button>
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100 px-2 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><Users className="w-4 h-4"/> Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><Train className="w-4 h-4"/> Total Trains</p>
                        <p className="text-2xl font-bold text-gray-900">{trains.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><Ticket className="w-4 h-4"/> Tickets Sold</p>
                        <p className="text-2xl font-bold text-gray-900">{totalTicketsSold}</p>
                    </div>
                </div>
            </div>

            {/* Main Content View */}
            <div className="flex-1">
                {activeTab === 'trains' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Train Management</h2>
                            <button 
                                onClick={() => {
                                    setEditingTrain(null);
                                    setFormData({ trainName: '', trainNumber: '', source: '', destination: '', totalSeats: '', availableSeats: '', departureTime: '', arrivalTime: '', price: '' });
                                    setShowForm(!showForm);
                                }}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                {showForm ? 'Cancel' : <><PlusCircle className="w-5 h-5"/> Add Train</>}
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleTrainSubmit} className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">{editingTrain ? 'Edit Train' : 'Add New Train'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <input placeholder="Train Name" name="trainName" value={formData.trainName} onChange={handleFormChange} required className="border p-2 rounded" />
                                    <input placeholder="Train Number" name="trainNumber" value={formData.trainNumber} onChange={handleFormChange} required className="border p-2 rounded" />
                                    <input placeholder="Source" name="source" value={formData.source} onChange={handleFormChange} required className="border p-2 rounded" />
                                    <input placeholder="Destination" name="destination" value={formData.destination} onChange={handleFormChange} required className="border p-2 rounded" />
                                    <input placeholder="Total Seats" type="number" name="totalSeats" value={formData.totalSeats} onChange={handleFormChange} required className="border p-2 rounded" />
                                    {editingTrain && <input placeholder="Available Seats" type="number" name="availableSeats" value={formData.availableSeats} onChange={handleFormChange} required className="border p-2 rounded" />}
                                    <input placeholder="Price (₹)" type="number" name="price" value={formData.price} onChange={handleFormChange} required className="border p-2 rounded" />
                                    <input placeholder="Departure Time (e.g. 10:00 AM)" name="departureTime" value={formData.departureTime} onChange={handleFormChange} required className="border p-2 rounded" />
                                    <input placeholder="Arrival Time (e.g. 05:00 PM)" name="arrivalTime" value={formData.arrivalTime} onChange={handleFormChange} required className="border p-2 rounded" />
                                </div>
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
                                    {editingTrain ? 'Save Changes' : 'Create Train'}
                                </button>
                            </form>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700">
                                        <th className="p-3 border-b font-semibold">Train</th>
                                        <th className="p-3 border-b font-semibold">Route</th>
                                        <th className="p-3 border-b font-semibold">Timings / Price</th>
                                        <th className="p-3 border-b font-semibold">Seats (Avail/Tot)</th>
                                        <th className="p-3 border-b font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trains.map(train => (
                                        <tr key={train._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-3">
                                                <p className="font-bold text-gray-900">{train.trainName}</p>
                                                <p className="text-xs text-gray-500">#{train.trainNumber}</p>
                                            </td>
                                            <td className="p-3 text-sm">{train.source} &rarr; {train.destination}</td>
                                            <td className="p-3">
                                                <p className="text-sm">{train.departureTime} - {train.arrivalTime}</p>
                                                <p className="text-xs font-bold text-primary-600">₹{train.price}</p>
                                            </td>
                                            <td className="p-3">
                                                 <span className={`font-medium ${train.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {train.availableSeats}
                                                </span> / {train.totalSeats}
                                            </td>
                                            <td className="p-3 flex justify-end gap-2">
                                                <button onClick={() => handleEditClick(train)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                                    <Edit className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => handleDeleteTrain(train._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                                    <Trash2 className="w-5 h-5"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-primary-600" /> All Platform Bookings
                        </h2>
                        <div className="overflow-x-auto">
                             <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700">
                                        <th className="p-3 border-b font-semibold">User</th>
                                        <th className="p-3 border-b font-semibold">Train</th>
                                        <th className="p-3 border-b font-semibold">Date</th>
                                        <th className="p-3 border-b font-semibold">Seats & Price</th>
                                        <th className="p-3 border-b font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBookings.map(b => (
                                        <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3">
                                                <p className="font-medium text-gray-900">{b.userId?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{b.userId?.email}</p>
                                            </td>
                                            <td className="p-3">
                                                <p className="font-medium">{b.trainId?.trainName || '-'}</p>
                                                <p className="text-xs text-gray-500">{b.trainId?.source} &rarr; {b.trainId?.destination}</p>
                                            </td>
                                            <td className="p-3 text-sm">{b.travelDate}</td>
                                            <td className="p-3">
                                                <p className="text-sm font-medium">{b.seatNumbers?.join(', ') || b.seatNumber}</p>
                                                <p className="text-xs font-bold text-primary-600">₹{b.totalPrice || 500}</p>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
