import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const { signup, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setErrorMsg('');
            await signup(name, email, password);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-none border border-gray-200">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-black text-black uppercase tracking-tighter">Join OMG Bags</h2>
                    <p className="mt-4 text-center text-sm text-gray-600 font-medium">
                        Already have an account? <Link to="/login" className="font-bold text-black border-b border-black hover:text-gray-500 pb-0.5 transition uppercase tracking-widest text-[10px]">Sign in</Link>
                    </p>
                </div>

                {errorMsg && (
                    <div className="mt-4 bg-white p-3 rounded-none text-black text-sm text-center border border-black font-black uppercase tracking-widest text-[10px]">
                        {errorMsg}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name" type="text" required
                                value={name} onChange={(e) => setName(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-black rounded-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm bg-white font-bold"
                                placeholder="Full Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address" type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-black rounded-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm bg-white font-bold"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password" type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-black rounded-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm bg-white font-bold"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-bold uppercase tracking-widest rounded-none text-white bg-black hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black transition mt-6">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
