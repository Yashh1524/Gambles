import api from '@/utils/api'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Profile = () => {
    const [totalWinAmount, setTotalWinAmount] = useState(0)
    const [totalWiningStreak, setTotalWiningStreak] = useState(0)

    useEffect(() => {
        const getUserWiningData = async () => {
            try {
                const response = await api.get("/api/bet/get-user-totalwin-and-winningstreak");

                if (response.data.success) {
                    setTotalWinAmount(response.data.totalWinningAmount);
                    setTotalWiningStreak(response.data.totalWinningStreak);
                } else {
                    toast.error("Failed to fetch winning data");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to fetch winning data");
            }
        }

        getUserWiningData();
    }, [])

    return (
        <div>
            <h1>Total Winning Amount: ₹{totalWinAmount}</h1>
            <h1>Winning Streak: {totalWiningStreak}</h1>
        </div>
    )
}

export default Profile;
