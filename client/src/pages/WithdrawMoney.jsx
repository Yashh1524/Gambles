import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const WithdrawMoney = () => {
    const { user, setUser } = useUser();
    const [form, setForm] = useState({
        amount: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        type: "WITHDRAW",
    });

    const [showSuccess, setShowSuccess] = useState(false); // for tick animation
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreatePayout = async () => {
        const { amount, accountHolderName, accountNumber, ifscCode, upiId } = form;

        if (!amount || (accountNumber && (!ifscCode || !accountHolderName))) {
            return toast.error("Please provide valid payout details");
        }

        try {
            const { data } = await api.post("/api/transaction/create-transaction", form);
            const { transactionId } = data;

            // Call Razorpay payout controller — it handles SUCCESS status update
            const res = await api.post("/api/razorpay/withdraw-payout-razorpay", { transactionId });

            // ✅ Show toast message and success UI
            toast.success("Withdrawal successful!");
            setUser((prev) => ({ ...prev, wallet: res.data.wallet }));
            setShowSuccess(true);

            setTimeout(() => {
                navigate("/");
            }, 2500);

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Withdrawal failed");

            // ❌ If transaction was created but Razorpay failed, mark it as FAILED
            if (err.response?.data?.transactionId) {
                try {
                    await api.post("/api/transaction/update-transaction-status", {
                        transactionId: err.response.data.transactionId,
                        status: "FAILED",
                    });
                } catch (updateErr) {
                    console.error("Failed to update transaction status to FAILED", updateErr);
                }
            }
        }
    };

    return (
        <div className="h-full bg-[#0f1b24] text-white flex items-center justify-center px-4">
            {!showSuccess ? (
                <div className="bg-[#132631] p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Withdraw Money</h2>

                    <div className="space-y-4">
                        {/* Form fields here... (unchanged, as shown above) */}

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                className="w-full bg-[#1c3645] border border-[#334b5e] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0083ff]"
                            />
                        </div>

                        {/* UPI ID */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">UPI ID (optional)</label>
                            <input
                                type="text"
                                name="upiId"
                                value={form.upiId}
                                onChange={handleChange}
                                placeholder="example@upi"
                                className="w-full bg-[#1c3645] border border-[#334b5e] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0083ff]"
                            />
                        </div>

                        <div className="text-center text-sm text-gray-400 my-2">OR</div>

                        {/* Bank Transfer Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Account Holder Name</label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    value={form.accountHolderName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-[#1c3645] border border-[#334b5e] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0083ff]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={form.accountNumber}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    className="w-full bg-[#1c3645] border border-[#334b5e] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0083ff]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={form.ifscCode}
                                    onChange={handleChange}
                                    placeholder="SBIN0000123"
                                    className="w-full bg-[#1c3645] border border-[#334b5e] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0083ff]"
                                />
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCreatePayout} className="w-full py-2 mt-6 rounded-md bg-[#0083ff] hover:bg-[#3399ff] transition">
                        Withdraw
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaCheckCircle className="text-green-500 text-6xl animate-pulse" />
                    <p className="text-lg font-semibold text-green-400">Withdrawal Successful!</p>
                </div>
            )}
        </div>
    );
};

export default WithdrawMoney;
