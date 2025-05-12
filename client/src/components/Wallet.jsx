import React from 'react';
import { useUser } from '../contexts/UserContext';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wallet = ({ onClose }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="relative bg-[#132631] text-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
                {/* Close Button */}
                <button
                    onClick={(onClose)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <X size={22} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center">Wallet</h2>

                {/* Balance Display */}
                <div className="bg-[#1c3645] p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-400">Available Balance</p>
                    <p className="text-3xl font-semibold text-green-400 mt-1">
                        ₹{user?.wallet?.toFixed(2) || '0.00'}
                    </p>
                </div>

                {/* Action Buttons */}
                {user?.isVerified ? (
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/withdraw-money');
                            }}
                            className="flex-1 py-2 rounded-lg bg-[#2f3e46] hover:bg-[#3d4d56] transition"
                        >
                            Withdraw
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/deposit-money');
                            }}
                            className="flex-1 py-2 rounded-lg bg-[#0083ff] hover:bg-[#3399ff] transition"
                        >
                            Deposit
                        </button>
                    </div>
                ) : (
                    <div className="bg-yellow-100 text-yellow-900 rounded-lg px-4 py-3 text-center space-y-3">
                        <p className="font-medium">Please verify your account to use wallet features.</p>
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/verify-user');
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-sm text-black px-4 py-2 rounded-md transition"
                        >
                            Verify Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;
