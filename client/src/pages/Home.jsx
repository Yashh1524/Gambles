'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import { useUser } from '@/contexts/UserContext';

const bannerImages = [
    '/images/others/banner1.png',
    '/images/others/banner4.png',
    '/images/others/banner2.png',
    '/images/others/banner3.jpg',
];

export default function Home() {
    const { user } = useUser();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [fade, setFade] = useState(true);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
                setFade(true);
            }, 500);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await api.get('/api/games/get-all-games');
                setGames(res.data);
            } catch (err) {
                console.error(err);
                setError('Could not load games.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f1b24] text-white">
            {/* Banner Section */}
            <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] relative overflow-hidden">
                {bannerImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Banner ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover lg:object-fit transition-opacity duration-700 ${
                            index === currentBanner && fade ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-24"></div>
            </div>

            {/* User Section */}
            {user && (
                <div className="px-4 sm:px-10 py-6 bg-[#1a2b36] flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-b-xl shadow">
                    <div className="mb-2 sm:mb-0">
                        <p className="text-lg font-semibold">Welcome, {user.name}!</p>
                        <p className="text-sm text-gray-400">Wallet Balance: ₹{Number(user.wallet).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/profile"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm"
                        >
                            Profile
                        </Link>
                        <Link
                            to="/dashboard"
                            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}

            {/* Games Section */}
            <div className="px-4 sm:px-10 py-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Games</h2>

                {loading ? (
                    <p className="text-gray-400">Loading games...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                        {games.map((game) => (
                            <Link
                                key={game._id}
                                to={`/games/${game.name}`}
                                state={{ gameId: game._id }}
                                className="bg-[#0F212E] border border-gray-900 p-2 rounded-xl shadow hover:scale-105 transition-transform"
                            >
                                <img
                                    src={game.image}
                                    alt={game.name}
                                    className="rounded-lg w-full h-auto object-cover"
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
