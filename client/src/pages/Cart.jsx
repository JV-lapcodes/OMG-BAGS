import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-none">
                    <h2 className="text-xl font-black text-black uppercase tracking-widest mb-4">Your cart is empty</h2>
                    <Link to="/products" className="text-black font-bold hover:text-gray-500 hover:underline border-b border-black pb-1 uppercase tracking-widest text-xs">
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="p-6 flex py-6 sm:py-8">
                                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-none overflow-hidden border border-gray-200 bg-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover grayscale-[20%]" />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-lg font-black uppercase tracking-tight">
                                                            <Link to={`/products/${item.id}`} className="text-black hover:text-gray-500">{item.name}</Link>
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{item.category}</p>
                                                    <p className="mt-3 text-lg font-black text-black">₹{item.price}</p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9 flex flex-col items-end">
                                                    <select
                                                        id={`quantity-${item.id}`}
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                        className="max-w-full rounded-none border border-black py-1.5 px-3 text-sm font-bold text-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black bg-white mb-4"
                                                    >
                                                        {[...Array(Math.min(10, item.stock || 1)).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-sm font-medium text-red-500 hover:text-red-600 transition flex items-center"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 bg-white rounded-none border border-gray-200 px-4 py-8 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4 sticky top-24">
                        <h2 id="summary-heading" className="text-xl font-black text-black mb-6 uppercase tracking-widest border-b border-gray-200 pb-4">Order Summary</h2>

                        <dl className="space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                <dt className="flex items-center text-sm text-gray-600">
                                    <span>Shipping estimate</span>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">₹{shipping.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                <dt className="flex text-sm text-gray-600">
                                    <span>Tax estimate</span>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">₹{tax.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-lg font-extrabold text-gray-900">Order total</dt>
                                <dd className="text-xl font-extrabold text-gray-900">₹{total.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-8">
                            <Link
                                to="/checkout"
                                className="w-full bg-black border border-black rounded-none shadow-none py-4 px-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-zinc-800 hover:text-white focus:outline-none flex justify-center items-center transition-colors"
                            >
                                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-6 flex justify-center items-center text-sm text-gray-500">
                            <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                            <span>Secure, encrypted checkout</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
