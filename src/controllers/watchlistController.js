import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;
    console.log(req.body);

    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    });

    //check if exists
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    //if already added to watchlist
    const exists = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId,
            },
        },
    });

    if (exists) return res.status(400).json({ error: "Already in watchlist" });

    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId : req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        },
    });

    res.status(201).json({
        status: "success",
        data: {
            watchlistItem,
        },
    });
};


const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body;

    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "Not allowed to update this watchlist item" });
    }

    // Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    // Update watchlist item
    const updatedItem = await prisma.watchlistItem.update({
        where: { id: req.params.id },
        data: updateData,
    });

    res.status(200).json({
        status: "success",
        data: {
            watchlistItem: updatedItem,
        },
    });
};

const removeFromWatchlist = async (req, res) => {
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    if (watchlistItem.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "Not allowed to update this watchlist item" });
    }

    await prisma.watchlistItem.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        status: "success",
        message: "Movie removed from watchlist",
    });
};

export { addToWatchList, updateWatchlistItem, removeFromWatchlist};
