import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryFilter = searchParams.get('category');

    useEffect(() => {
        setLoading(true);
        axios.get('/api/products')
            .then(res => {
                let data = res.data;
                if (categoryFilter) {
                    data = data.filter(p => p.category.toLowerCase().includes(categoryFilter.toLowerCase()));
                }
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryFilter]);

    const categories = ['All', 'Backpacks', 'Slings', 'Duffels', 'Totes', 'Messenger'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-200">
                            <Filter className="h-5 w-5 text-black" />
                            <h2 className="text-lg font-black text-black uppercase tracking-widest">Filters</h2>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center">
                                Categories <ChevronDown className="h-4 w-4 text-gray-400" />
                            </h3>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <Link
                                            to={cat === 'All' ? '/products' : `/products?category=${cat}`}
                                            className={`block px-3 py-2 text-sm uppercase tracking-wider transition-all duration-200 ${(categoryFilter === cat || (!categoryFilter && cat === 'All'))
                                                ? 'bg-black text-white font-bold'
                                                : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex justify-between items-center">
                                Price <ChevronDown className="h-4 w-4 text-gray-400" />
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-black transition">
                                    <input type="checkbox" className="rounded-none text-black focus:ring-black border-gray-300 h-4 w-4" />
                                    <span className="uppercase tracking-wider">Under ₹2000</span>
                                </label>
                                <label className="flex items-center space-x-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-black transition">
                                    <input type="checkbox" className="rounded-none text-black focus:ring-black border-gray-300 h-4 w-4" />
                                    <span className="uppercase tracking-wider">₹2000 - ₹4000</span>
                                </label>
                                <label className="flex items-center space-x-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-black transition">
                                    <input type="checkbox" className="rounded-none text-black focus:ring-black border-gray-300 h-4 w-4" />
                                    <span className="uppercase tracking-wider">Over ₹4000</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-black text-black uppercase tracking-tighter">
                            {categoryFilter ? `${categoryFilter} Bags` : 'The Collection'}
                        </h1>
                        <span className="text-sm text-gray-500">{products.length} Results</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white p-12 text-center border border-gray-200">
                            <h3 className="text-lg font-bold text-black uppercase tracking-widest">No pieces found</h3>
                            <p className="text-gray-500 mt-2">Adjust your filters to discover the collection.</p>
                            <Link to="/products" className="mt-6 inline-block text-white bg-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-zinc-800 transition">Clear Filters</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link key={product.id} to={`/products/${product.id}`} className="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 flex flex-col rounded-none">
                                    <div className="h-72 overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">{product.category}</p>
                                        <h3 className="text-lg font-bold text-black mb-3 truncate">{product.name}</h3>
                                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                                            <span className="text-xl font-black text-black">₹{product.price}</span>
                                            <span className="bg-black text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest hover:bg-zinc-800 transition">View</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
