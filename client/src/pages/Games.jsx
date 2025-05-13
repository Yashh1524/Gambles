import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Games = () => {
    return (
        <div>
            <h1>Choose a Game</h1>
            <ul>
                <li><Link to="/games/mines">Mines</Link></li>
                <li><Link to="/games/dice">Dice</Link></li>
                <li><Link to="/games/roulette">Roulette</Link></li>
                {/* Add more games here as needed */}
            </ul>
        </div>
    );
};

export default Games;
