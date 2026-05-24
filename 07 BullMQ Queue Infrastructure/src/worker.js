import { Worker } from 'bullmq';
import { connection } from './queue.js';

const worker = new Worker(
    "emails",
    async (Job) => {
        console.log("Processing Email job...", Job.id, Job.name, Job.data);
        await new Promise((resolve) => setTimeout(reseolve, 1500)),
          console.log("Email job completed...", Job.id, Job.name, Job.data);
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log("Job completed!", job.id, job.name, job.data);
});

worker.on("failed", (job) => {
    console.log("Job failed!", job.id, job.name, job.data);
});