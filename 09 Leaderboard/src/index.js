import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/post/:id', async (req,res) => {
    try {
        await redis.set(`post-${req.params.id}-views`, 0);
        console.log(`Setting post view 0. Post-ID: ${req.params.id}`);
        res.status(200).json({message: "Success!"});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Action Failed!"});
    }
});

app.post('/post/:id/view', async (req,res) => {
    try {
        const views = await redis.incr(`post-${req.params.id}-views`);
        console.log(`Increasing post view by 1. Post-ID: ${req.params.id}`);
        res.status(200).json({message: "Success!", views: views});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Action Failed!"});
    }
});

const LEADERBOARD_KEY = "Leaderboard Key Hu Mai!";

app.post('/leaderboard/score', async (req,res) => {
    try {
        const updatedScore = await redis.zincrby(LEADERBOARD_KEY, req.body.points, req.body.userid);
        console.log(`Adding ${req.body.points} points to user's score of User-ID: ${req.body.userid}`);
        res.status(200).json({message: "Success!", userid: req.body.userid, updatedScore: updatedScore});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Action Failed!"});
    }
});

app.get('/leaderboard', async (req,res) => {
    try {
        const leaderboard = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, 'WITHSCORES');

        const formattedLeaderboard = [];

        for (let i = 0; i < leaderboard.length; i += 2) {
            formattedLeaderboard.push({
                rank: (i / 2) + 1,
                userid: leaderboard[i],
                score: Number(leaderboard[i + 1])
            });
        }

        console.log(`Displaying top 10 of leaderboard!`);
        res.status(200).json({message: "Success!", leaderboard: formattedLeaderboard});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Action Failed!"});
    }
});

app.get('/leaderboard/:userid/rank', async (req,res) => {
    try {
        const rank = await redis.zrevrank(LEADERBOARD_KEY, req.params.userid)

        if (rank === null) {
            return res.status(404).json({message: "User not found!"});
        }

        console.log(`Displaying rank of user with User-ID: ${req.params.userid}`);
        res.status(200).json({message: "Success!", userid: req.params.userid, rank: rank+1});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Action Failed!"});
    }
});

app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
});