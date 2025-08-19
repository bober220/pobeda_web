import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Эндпоинт: список картинок ---
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

        // фильтруем только картинки
        const imageFiles = (data._embedded?.items || []).filter(
            (item) => item.type === "file" && item.mime_type.startsWith("image/")
        );

        // вместо прямой ссылки -> отдаём свои прокси-ссылки
        const images = imageFiles.map((item) => ({
            name: item.name,
            url: `/api/image?path=${encodeURIComponent(item.path)}`,
        }));

        res.json(images);
    } catch (err) {
        console.error("Ошибка /api/images:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// --- Эндпоинт: отдаёт одну картинку ---
app.get("/api/image", async (req, res) => {
    try {
        const token = process.env.YANDEX_DISK_TOKEN;
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: "Не указан путь файла" });
        }

        const response = await fetch(
            `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(filePath)}`,
            { headers: { Authorization: `OAuth ${token}` } }
        );

        const data = await response.json();
        if (!data.href) {
            return res.status(500).json({ error: "Не удалось получить ссылку на файл" });
        }

        // получаем сам файл
        const fileResp = await fetch(data.href);
        if (!fileResp.ok) {
            return res.status(500).json({ error: "Ошибка загрузки файла" });
        }

        res.setHeader("Content-Type", fileResp.headers.get("content-type"));
        fileResp.body.pipe(res);
    } catch (err) {
        console.error("Ошибка /api/image:", err);
        res.status(500).json({ error: "Ошибка сервера при отдаче файла" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});