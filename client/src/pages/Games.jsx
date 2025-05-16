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
                const data = res.data; // Axios auto-parses JSON
                setGames(data);
            } catch (err) {
                console.error(err);
                setError("Could not load games.");
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) return <p>Loading games...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Choose a Game</h1>
            <ul>
                {games.map((game) => (
                    <li key={game._id}>
                        <Link to={`/games/${game.name}`}>{game.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Games;
