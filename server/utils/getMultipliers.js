export const getMinesMultiplier = (safeRevealed, mineCount) => {
    const totalTiles = 25;
    const houseEdge = 0.99; // 1% house edge

    if (safeRevealed === 0) return 1;

    let probability = 1;
    for (let i = 0; i < safeRevealed; i++) {
        probability *= (totalTiles - mineCount - i) / (totalTiles - i);
    }

    const multiplier = (1 / probability) * houseEdge;
    return Number(multiplier.toFixed(2));
};