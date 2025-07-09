import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
// import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const WithdrawMoney = () => {
    const { setUser } = useUser();
    const [form, setForm] = useState({
        amount: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        type: "WITHDRAW",
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreatePayout = async () => {
        const { amount, accountHolderName, accountNumber, ifscCode } = form;

        if (!amount || parseFloat(amount) > 500000) {
            return toast.error("Please enter an amount up to ₹5,00,000");
        }

        if (accountNumber && (!ifscCode || !accountHolderName)) {
            return toast.error("Please provide valid bank details");
        }

        setIsLoading(true);

        try {
            const { data } = await api.post("/api/transaction/create-transaction", form);
            const { transactionId } = data;

            const res = await api.post("/api/razorpay/withdraw-payout-razorpay", { transactionId });

            toast.success("Withdrawal successful!");
            setUser((prev) => ({ ...prev, wallet: res.data.wallet }));
            setShowSuccess(true);

            // setTimeout(() => navigate("/"), 2500);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Withdrawal failed");
            setIsFailed(true);

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

            // setTimeout(() => navigate("/"), 2500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1b24] text-white flex items-center justify-center px-4">
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaCheckCircle className="text-green-500 text-6xl animate-pulse" />
                    <p className="text-lg font-semibold text-green-400">Withdrawal Successful!</p>
                </div>
            ) : isFailed ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaTimesCircle className="text-red-500 text-6xl animate-pulse" />
                    <p className="text-lg font-semibold text-red-400">Withdrawal Failed</p>
                </div>
            ) : (
                <div className="bg-[#132631] p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
                    <h2 className="text-2xl font-bold text-center">Withdraw Money</h2>

                    <div className="space-y-2">
                        <InputField
                            label="Amount (₹)"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            type="number"
                            placeholder="Enter amount"
                            disabled={isLoading}
                            max={500000}
                        />
                        <p className="text-sm text-gray-400">Maximum withdrawal limit is ₹5,00,000</p>
                    </div>

                    <div className="bg-[#1A2C38] p-4 rounded-xl space-y-4">
                        <InputField
                            label="Account Holder Name"
                            name="accountHolderName"
                            value={form.accountHolderName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            disabled={isLoading}
                        />
                        <InputField
                            label="Account Number"
                            name="accountNumber"
                            value={form.accountNumber}
                            onChange={handleChange}
                            placeholder="1234567890"
                            disabled={isLoading}
                        />
                        <InputField
                            label="IFSC Code"
                            name="ifscCode"
                            value={form.ifscCode}
                            onChange={handleChange}
                            placeholder="SBIN0000123"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        onClick={handleCreatePayout}
                        disabled={isLoading}
                        className="w-full py-2 rounded-md bg-[#0083ff] hover:bg-[#3399ff] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <ImSpinner2 className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Withdraw"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>
        <input
            {...props}
            className="w-full bg-[#1c3645] border border-[#334b5e] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0083ff] disabled:opacity-50"
        />
    </div>
);

export default WithdrawMoney;
