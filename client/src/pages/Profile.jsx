import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Package } from 'lucide-react';

export default function Profile() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-black leading-7 text-black sm:truncate uppercase tracking-tighter">
                        My Orders
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Welcome back, {user?.name}. Here is a historical overview of your transactions.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Link to="/products" className="ml-3 inline-flex items-center px-6 py-3 border border-black rounded-none text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-zinc-800 hover:border-zinc-800 transition">
                        Continue Shopping
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-none border border-gray-200 p-16 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-black uppercase tracking-widest">No order history</h3>
                    <p className="mt-2 text-sm text-gray-500 font-medium tracking-wide">You haven't made any purchases with us.</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow-none overflow-hidden border border-gray-200 sm:rounded-none">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ORDER ID</th>
                                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">DATE</th>
                                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOTAL</th>
                                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">PAID</th>
                                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">DELIVERED</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-black">
                                                    #{order.id.toString().padStart(6, '0')}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-500">
                                                    {order.createdAt.substring(0, 10)}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-black">
                                                    ₹{order.totalPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {order.isPaid ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                                            {order.paidAt.substring(0, 10)}
                                                        </span>
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {order.isDelivered ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                                            {order.deliveredAt.substring(0, 10)}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                            <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
