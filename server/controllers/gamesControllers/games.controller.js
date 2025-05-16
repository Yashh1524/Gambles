import gameModel from "../../models/game.model.js";

export const getAllGames = async (req, res) => {
    try {
        const games = await gameModel.find(); // This fetches all documents in the collection
        res.status(200).json(games); // Send the games as a JSON response
    } catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).json({ message: "Failed to fetch games" }); // Handle error response
    }
};
