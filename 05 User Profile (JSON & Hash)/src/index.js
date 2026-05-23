import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post(`/users/:id/json`, async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.status(201).json({ savedAs: "json" });
});

app.get(`/users/:id/json`, async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`); 
    if (!raw) {
        return res.status(404).json({ error: "User not found" });
    }   
    res.status(200).json(JSON.parse(raw));
});

app.post('/users/:id/hash', async (req, res) => {
    const user = await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.status(201).json({ savedAs: "hash" });
});

app.get('/users/:id/hash', async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);

    if (Object.keys(user).length === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});