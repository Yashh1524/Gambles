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
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Games</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                {games.map((game) => (
                    <Link
                        key={game._id}
                        to={`/games/${game.name}`}
                        className="transition-transform hover:scale-105"
                    >
                        <img
                            src={game.image}
                            alt={game.name}
                            className="rounded-xl shadow-md w-full h-auto"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Games;
