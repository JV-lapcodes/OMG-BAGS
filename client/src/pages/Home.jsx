import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        axios.get('/api/products').then(res => setFeatured(res.data.slice(0, 4))).catch(console.error);
    }, []);

    return (
        <div>
            {/* Animated Hero Section */}
            <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
                {/* Background Image with Zoom Animation */}
                <div
                    className="absolute inset-0 z-0 animate-slow-zoom bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-bg.png')" }}
                ></div>

                {/* Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

                {/* Hero Content with Glassmorphism */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="glass-dark p-8 md:p-14 rounded-3xl shadow-2xl animate-float max-w-4xl mx-auto border border-gray-700/50">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold tracking-widest uppercase mb-6">
                            New Collection 2026
                        </span>
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl mb-6 uppercase">
                            Carry your world <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">with style.</span>
                        </h1>
                        <p className="mt-4 text-base text-gray-300 sm:text-xl max-w-2xl mx-auto mb-10 font-medium">
                            Discover our premium collection of luxury backpacks, designed exclusively for the modern professional and relentless adventurer.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="/products" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-none text-black bg-white hover:bg-gray-100 hover:scale-105 transition-transform duration-300 uppercase tracking-wider">
                                Shop Collection
                            </Link>
                            <Link to="/products?category=Travel" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-white text-lg font-bold rounded-none text-white bg-transparent hover:bg-white/10 transition-all duration-300 uppercase tracking-wider">
                                Explore Travel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="flex justify-between items-baseline mb-8">
                    <h2 className="text-3xl font-black tracking-tighter text-black uppercase">Featured Bags</h2>
                    <Link to="/products" className="text-sm font-bold text-black border-b border-black hover:text-gray-600 transition">View all bags</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map((product) => (
                        <Link key={product.id} to={`/products/${product.id}`} className="group relative bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 flex flex-col rounded-none">
                            <div className="h-64 overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">{product.category}</p>
                                <h3 className="text-lg font-bold text-black mb-2 truncate">{product.name}</h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <span className="text-xl font-black text-black">₹{product.price}</span>
                                    <span className="text-black font-bold text-xs uppercase tracking-widest group-hover:underline">Details</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {featured.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                            <p className="text-gray-500">No products available yet.</p>
                            <button
                                onClick={() => axios.post('/api/products/seed').then(() => window.location.reload())}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Seed Empty Database
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
