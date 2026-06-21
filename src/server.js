import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = 5000;

//body parsing, convert to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);


const server = app.listen(PORT, () => {
    console.log(`Server running at PORT : ${PORT}`);
});

//Error handling
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    if (server && server.listening) {
        server.close(async () => {
            await disconnectDB();
            process.exit(1);
        });
    } else {
        disconnectDB().finally(() => process.exit(1));
    }
});

process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});
