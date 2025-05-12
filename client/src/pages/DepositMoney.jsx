// src/pages/DepositMoney.jsx
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const DepositMoney = () => {
    const { user, setUser } = useUser();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const navigate = useNavigate();

    const handleDeposit = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return toast.error("Enter a valid amount");
        }

        setIsLoading(true);
        try {
            const { data: orderData } = await api.post("/api/razorpay/create-deposit-order", {
                amount: Number(amount)
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Your App",
                description: "Wallet Deposit",
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        const { data } = await api.post("/api/razorpay/verify-deposit-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: Number(amount),
                        });

                        toast.success("Deposit successful");
                        setUser(prev => ({ ...prev, wallet: data.wallet }));
                        setShowSuccess(true);

                        setTimeout(() => navigate("/"), 2500);
                    } catch (verifyErr) {
                        console.error("Verification error", verifyErr);
                        toast.error("Deposit verification failed");
                        setShowFailure(true);
                        setTimeout(() => navigate("/"), 2500);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#0083ff" },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false);
                        setShowFailure(true);
                        setTimeout(() => navigate("/"), 2500);
                    },
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (err) {
            console.error(err);
            toast.error("Failed to initiate deposit");
            setShowFailure(true);
            setTimeout(() => navigate("/"), 2500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full bg-[#0f1b24] text-white flex items-center justify-center px-4">
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaCheckCircle className="text-green-500 text-6xl animate-pulse" />
                    <p className="text-lg font-semibold text-green-400">Deposit Successful!</p>
                </div>
            ) : showFailure ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaTimesCircle className="text-red-500 text-6xl animate-pulse" />
                    <p className="text-lg font-semibold text-red-400">Deposit Failed</p>
                </div>
            ) : (
                <div className="bg-[#132631] p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Deposit Money</h2>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full px-4 py-2 rounded-md bg-[#1e3a4c] text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleDeposit}
                        disabled={isLoading}
                        className="w-full py-2 rounded-md bg-[#0083ff] hover:bg-[#3399ff] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <ImSpinner2 className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Proceed to Pay"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DepositMoney;
