import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black text-black tracking-tighter uppercase">
                            OMG Bags
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-8 items-center flex-1 justify-center">
                        <Link to="/products" className="text-gray-700 hover:text-black font-medium transition">All Bags</Link>
                        <Link to="/products?category=Backpacks" className="text-gray-700 hover:text-black font-medium transition">Backpacks</Link>
                        <Link to="/products?category=Slings" className="text-gray-700 hover:text-black font-medium transition">Sling Bags</Link>
                        <Link to="/products?category=Duffels" className="text-gray-700 hover:text-black font-medium transition">Travel</Link>

                        {user && user.isAdmin === 1 && (
                            <Link to="/admin" className="text-white bg-black hover:bg-zinc-800 px-3 py-1 rounded-md text-sm font-bold transition shadow-sm ml-4 border border-black">
                                Admin Panel
                            </Link>
                        )}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block relative">
                            <input
                                type="text"
                                placeholder="Search bags..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50 w-48 lg:w-64 transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        {user ? (
                            <div className="flex items-center space-x-3 ml-2">
                                <Link to="/profile" className="text-sm font-bold text-black bg-zinc-100 py-1.5 px-4 rounded-full border border-zinc-200 hover:bg-zinc-200 transition tracking-tight shadow-sm">
                                    Hi, {user.name.split(' ')[0]}
                                </Link>
                                <button onClick={logout} className="text-gray-500 hover:text-red-500 transition ml-1" title="Logout">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-700 hover:text-black transition" title="Login">
                                <User className="h-6 w-6" />
                            </Link>
                        )}

                        <Link to="/cart" className="text-gray-700 hover:text-black relative transition ml-4 hidden sm:block">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white cursor-pointer">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button className="md:hidden text-gray-700 hover:text-indigo-600 transition ml-2">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
