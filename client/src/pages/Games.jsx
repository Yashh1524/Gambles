import Breadcrumbs from "@/components/Breadcrumbs";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Games = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await api.get("/api/games/get-all-games");
                setGames(res.data);
            } catch (err) {
                console.error(err);
                setError("Could not load games.");
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) return <p className="text-white">Loading games...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumbs />
            <div className="px-10 py-6">
                <h1 className="text-2xl font-bold text-white my-4">Games</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                    {games.map((game) => (
                        <Link
                            key={game._id}
                            to={`/games/${game.name}`}
                            state={{ gameId: game._id }}
                            className="transition-transform hover:scale-105"
                        >
                            <img
                                src={game.image}
                                alt={game.name}
                                className="rounded-xl shadow-md w-full h-auto"
                            />
                        </Link>
                    ))}
                    {/* Extra card at the end */}
                    <div className="bg-[#0F212E] border border-gray-900 p-4 rounded-xl shadow-md flex items-center justify-center text-center hover:scale-105 transition-transform">
                        <span className="text-gray-400 text-sm sm:text-base">
                            More games coming soon!
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Games;
