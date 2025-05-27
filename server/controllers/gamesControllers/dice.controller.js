export const rollDiceController = async (req, res) => {

    const { amount, condition, target } = req.body

    const userId = req.user.id;

    if (!amount || !condition || target <= 0) {
        return res.status(400).json({ message: "Invalid bet" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user || user.wallet < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.wallet -= amount;
        await user.save();

        const game = await gameModel.findOne({ name: "dice" });

        const newBet = await betModel.create({
            user: userId,
            game: game._id,
            betAmount: amount,
            gameData: {

            },
            status: "pending",
        });

    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }

}