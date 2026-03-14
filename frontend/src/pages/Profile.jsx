import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { User, Mail, Phone, Save } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

    const [name, setName] = useState(userInfo.name || '');
    const [email, setEmail] = useState(userInfo.email || '');
    const [phone, setPhone] = useState(userInfo.phone || '');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!userInfo.token) {
        navigate('/login');
        return null;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put('/auth/profile', { name, email, phone });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <User className="w-8 h-8 text-primary-600" />
                User Profile
            </h1>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
                {message && (
                    <div className={`p-3 rounded-md mb-6 text-sm text-center border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form className="space-y-6" onSubmit={submitHandler}>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                disabled // Usually don't allow email change without verification
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center items-center gap-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 mt-6"
                    >
                         {loading ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4"/> Update Profile
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
