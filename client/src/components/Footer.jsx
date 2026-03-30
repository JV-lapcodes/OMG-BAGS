import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-4 tracking-tight">OMG Bags</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Premium quality bags for daily commute, travel, and adventure. Built to withstand whatever your journey throws at it.</p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-100">Shop</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/products?category=Backpacks" className="hover:text-indigo-400 transition">Backpacks</Link></li>
                        <li><Link to="/products?category=Slings" className="hover:text-indigo-400 transition">Sling Bags</Link></li>
                        <li><Link to="/products?category=Duffels" className="hover:text-indigo-400 transition">Travel Bags</Link></li>
                        <li><Link to="/products" className="hover:text-indigo-400 transition">New Arrivals</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-100">Support</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-indigo-400 transition">Contact Us</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition">FAQs</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition">Shipping & Returns</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition">Warranty</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-100">Newsletter</h4>
                    <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and updates.</p>
                    <div className="flex">
                        <input type="email" placeholder="Enter your email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-gray-700" />
                        <button className="bg-indigo-600 px-4 py-2 rounded-r-md hover:bg-indigo-500 transition font-medium">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} OMG Bags. All rights reserved.
            </div>
        </footer>
    );
}
