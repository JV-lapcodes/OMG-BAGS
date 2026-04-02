import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh');

// Pull Contexts in globally so functions can dynamically store data
function CheckoutForm({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: shippingDetails.name,
                    address: {
                        line1: shippingDetails.address,
                        city: shippingDetails.city,
                        postal_code: shippingDetails.postalCode,
                        country: shippingDetails.country,
                    }
                }
            }
        });

        if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Step 7: Push the fully authorized payment record explicitly into SQLite Backend Database
            try {
                const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                const orderData = {
                    orderItems: cartItems,
                    shippingAddress: {
                        address: shippingDetails.address,
                        city: shippingDetails.city,
                        postalCode: shippingDetails.postalCode,
                        country: shippingDetails.country,
                    },
                    paymentMethod: 'Stripe',
                    taxPrice: (subtotal * 0.08),
                    shippingPrice: subtotal > 0 ? 10 : 0,
                    totalPrice: subtotal + (subtotal * 0.08) + (subtotal > 0 ? 10 : 0)
                };
                const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };

                await axios.post('/api/orders', orderData, config);

                alert('Payment successful! Your order has been placed into our internal tracker.');
                clearCart();
                navigate('/profile'); // Auto redirect users into their Order Tracking hub!
            } catch (saveError) {
                console.error("Order save failed:", saveError);
                alert('Payment was taken but SQLite Tracker crashed. Please contact support.');
                clearCart();
                navigate('/profile');
            }
        } else {
            setErrorMessage('Unexpected state.');
            setIsLoading(false);
        }
    };

    const CARD_ELEMENT_OPTIONS = {
        hidePostalCode: true,
        style: {
            base: {
                color: '#000000',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' }
            },
            invalid: {
                color: '#000000',
                iconColor: '#000000'
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-none border border-black shadow-none">
                <h3 className="text-xl font-black uppercase tracking-widest mb-4 text-black">Shipping Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-black text-black uppercase tracking-widest">Full name</label>
                        <input required type="text" className="mt-1 block w-full border border-black rounded-none shadow-none py-2 px-3 focus:outline-none sm:text-sm bg-white" value={shippingDetails.name} onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-black text-black uppercase tracking-widest">Address</label>
                        <input required type="text" className="mt-1 block w-full border border-black rounded-none shadow-none py-2 px-3 focus:outline-none sm:text-sm bg-white" value={shippingDetails.address} onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-black uppercase tracking-widest">City</label>
                        <input required type="text" className="mt-1 block w-full border border-black rounded-none shadow-none py-2 px-3 focus:outline-none sm:text-sm bg-white" value={shippingDetails.city} onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-black uppercase tracking-widest">Postal code</label>
                        <input required type="text" className="mt-1 block w-full border border-black rounded-none shadow-none py-2 px-3 focus:outline-none sm:text-sm bg-white" value={shippingDetails.postalCode} onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-black text-black uppercase tracking-widest">Country Code (e.g. US)</label>
                        <input required type="text" maxLength={2} className="mt-1 block w-full border border-black rounded-none shadow-none py-2 px-3 focus:outline-none sm:text-sm bg-white" value={shippingDetails.country} onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value.toUpperCase() })} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-none border border-black shadow-none mt-6">
                <h3 className="text-xl font-black uppercase tracking-widest mb-4 text-black">Payment Details</h3>
                <div className="p-4 border border-black rounded-none shadow-none bg-white">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            {errorMessage && <div className="text-black bg-white p-4 rounded-none border border-black mt-4 font-black uppercase tracking-widest text-xs">{errorMessage}</div>}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full flex justify-center py-4 px-4 border border-black rounded-none shadow-none text-xs font-black text-white bg-black hover:bg-zinc-800 focus:outline-none disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-all mt-6 uppercase tracking-widest"
            >
                <span id="button-text">
                    {isLoading ? "Processing Secure Payment..." : "Pay now"}
                </span>
            </button>
        </form>
    );
}

export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("");
    const [initError, setInitError] = useState("");
    const { cartItems } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert("Please login to proceed to checkout!");
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }

        const getPaymentIntent = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post('/api/orders/payment-intent', { cartItems }, config);
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Failed to initialize payment", error);
                setInitError(error.response?.data?.error || error.response?.data?.message || "Failed to connect to payment gateway. Please verify your Stripe API Keys.");
            }
        };

        getPaymentIntent();
    }, [cartItems, user, navigate]);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black text-black uppercase tracking-widest mb-8 text-center">Checkout securely</h1>
            {clientSecret ? (
                <Elements stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            ) : initError ? (
                <div className="flex justify-center flex-col items-center min-h-[40vh]">
                    <div className="text-black bg-white p-6 rounded-none border-2 border-black mt-4 font-black uppercase tracking-widest text-xs text-center max-w-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-red-600 block mb-2 text-lg">⚠️ Gateway Error</span>
                        {initError}
                        <div className="mt-4 pt-4 border-t border-gray-200 text-[10px] text-gray-500 font-bold">
                            Diagnostic: Your backend failed to generate a Stripe Client Secret. Ensure your STRIPE_SECRET_KEY environment variable is configured natively in Render or your local .env file.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center flex-col items-center min-h-[40vh]">
                    <div className="animate-spin rounded-none h-12 w-12 border-b-4 border-l-4 border-black mb-4"></div>
                    <p className="text-black font-black uppercase tracking-widest text-xs">Initializing Secure Gateway...</p>
                </div>
            )}
        </div>
    );
}
