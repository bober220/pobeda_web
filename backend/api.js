import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- эндпоинт для карт ---
app.get("/api/map-key", (req, res) => {
    const key = process.env.YANDEX_MAPS_KEY;
    if (!key) {
        return res.status(500).json({ error: "YANDEX_MAPS_KEY не найден" });
    }
    res.json({ key });
});

// --- эндпоинт для слайдера ---
app.get("/api/images", async (req, res) => {
    try {
        const token = process.env.YANDEX_DISK_TOKEN;
        if (!token) {
            return res.status(500).json({ error: "YANDEX_DISK_TOKEN не найден" });
        }

        const folder = "disk:/СЛАЙДЫ";
        const response = await fetch(
            `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(folder)}&limit=100`,
            {
                headers: { Authorization: `OAuth ${token}` },
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: "Ошибка запроса к Яндекс.Диску" });
        }

        const data = await response.json();
        res.json(data._embedded.items.map((f) => ({
            name: f.name,
            url: `/api/image?path=${encodeURIComponent(f.path)}`
        })));
    } catch (err) {
        console.error("Ошибка /api/images:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// --- эндпоинт для отдачи картинки ---
app.get("/api/image", async (req, res) => {
    try {
        const token = process.env.YANDEX_DISK_TOKEN;
        const { path: filePath } = req.query;

        if (!token || !filePath) {
            return res.status(400).json({ error: "Нет токена или пути" });
        }

        const response = await fetch(
            `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(filePath)}`,
            { headers: { Authorization: `OAuth ${token}` } }
        );

        const data = await response.json();
        if (!data.href) return res.status(500).json({ error: "Не удалось получить ссылку" });

        const fileRes = await fetch(data.href);
        fileRes.body.pipe(res);
    } catch (err) {
        console.error("Ошибка /api/image:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// --- раздаём фронтенд ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

// SPA fallback (ловит все маршруты)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// --- запуск сервера ---
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});