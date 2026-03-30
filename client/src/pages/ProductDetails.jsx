import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch individual product via the new Step 4 API endpoint
        axios.get(`/api/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(console.error);
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-24 min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-black text-black uppercase tracking-widest">Product Not Found</h2>
            <Link to="/products" className="text-white bg-black hover:bg-zinc-800 px-6 py-3 font-bold uppercase tracking-widest mt-6 inline-block transition">Return to collection</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white mt-8 rounded-none border border-gray-200">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-8 space-x-2">
                <Link to="/" className="hover:text-gray-900">Home</Link>
                <span>/</span>
                <Link to={`/products?category=${product.category}`} className="hover:text-gray-900">{product.category}</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                {/* Left: Image */}
                <div className="mb-10 lg:mb-0">
                    <div className="aspect-w-1 aspect-h-1 rounded-none overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-center object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-black sm:text-4xl uppercase tracking-tighter leading-tight">{product.name}</h1>
                    <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-3xl font-black text-black">₹{product.price}</p>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest border ${product.stock > 0 ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                        </span>
                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                        <div className="prose prose-sm text-gray-600 leading-relaxed text-base">
                            <p>{product.description}</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-black text-black mb-3 tracking-widest uppercase">Technical Specifications</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-none mr-4"></span> Premium Grade Manufacturing</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-none mr-4"></span> Weather & Water Resistant</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-none mr-4"></span> Expandable Compartment Architecture</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-none mr-4"></span> Lifetime Manufacturer Guarantee</li>
                        </ul>
                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
                            <select
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="rounded-none border border-black py-2.5 px-3 text-base focus:outline-none focus:ring-1 focus:ring-black sm:text-sm bg-white w-24 font-bold"
                            >
                                {[...Array(Math.min(10, product.stock || 1)).keys()].map(x => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => { addToCart(product, Number(quantity)); navigate('/cart'); }}
                                disabled={product.stock === 0}
                                className="flex-1 bg-black border border-black rounded-none py-4 px-8 flex items-center justify-center text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black focus:outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="mr-3 h-5 w-5" />
                                Add to Cart
                            </button>
                            <button className="flex-none p-4 rounded-none text-black hover:text-white hover:bg-black border border-black transition-colors text-center flex items-center justify-center aspect-square">
                                <Heart className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-none border border-gray-200 text-center hover:bg-white hover:border-black transition-all">
                            <Shield className="h-6 w-6 text-black mb-4" strokeWidth={2} />
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Lifetime Warranty</span>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-none border border-gray-200 text-center hover:bg-white hover:border-black transition-all">
                            <Truck className="h-6 w-6 text-black mb-4" strokeWidth={2} />
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Global Shipping</span>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-none border border-gray-200 text-center hover:bg-white hover:border-black transition-all">
                            <RotateCcw className="h-6 w-6 text-black mb-4" strokeWidth={2} />
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Free Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
