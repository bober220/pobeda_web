import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // если Node <18

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- эндпоинт для слайдера ---
app.get("/api/images", async (req, res) => {
    try {
        const token = process.env.YANDEX_DISK_TOKEN;
        if (!token) {
            return res.status(500).json({ error: "YANDEX_DISK_TOKEN не найден в .env" });
        }

        const folder = "disk:/СЛАЙДЫ";
        const response = await fetch(
            `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(folder)}&limit=100`,
            { headers: { Authorization: `OAuth ${token}` } }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: "Ошибка запроса к Яндекс.Диску" });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Ошибка /api/images:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.get("/api/map-key", (req, res) => {
    const key = process.env.YANDEX_MAPS_KEY;
    if (!key) {
        return res.status(500).json({ error: "YANDEX_MAPS_KEY не найден в .env" });
    }
    res.json({ key });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});