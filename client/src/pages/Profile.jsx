import api from '@/utils/api'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Profile = () => {
    const [totalWinAmount, setTotalWinAmount] = useState(0)
    const [totalWiningStreak, setTotalWiningStreak] = useState(0)
    const [bets, setBets] = useState([])

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

        const getUserAllBets = async () => {
            try {
                const response = await api.post("/api/bet/fetch-bets-by-user")
                
                if (response.data.success) {
                    setBets(response.data.bets);
                } else {
                    toast.error("Failed to fetch bets");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to fetch bets");
            }
        }

        getUserAllBets()
        getUserWiningData();
        // console.log(bets)
    }, [bets])

    return (
        <div>
            <h1>Total Winning Amount: ₹{totalWinAmount}</h1>
            <h1>Winning Streak: {totalWiningStreak}</h1>
        </div>
    )
}

export default Profile;
