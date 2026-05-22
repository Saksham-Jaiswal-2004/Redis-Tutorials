# In-Memory Store — not exactly a DB

Stores data in RAM so it's lightning fast.

Frequently asked record — Hot record

Nowadays, some DBs can store values in memory.

Even if we use Redis, there will be some network latency as it is architected outside the app network; otherwise it'll be the same as creating a state in the app.

Redis is not a replacement for databases.

**Redis — Caching Layer**

Redis Apps Architecture:
Users -> Servers -> Redis -> DB

Mainly to increase the read speed.

Cache -> **Session Store** (part of Redis only), used to store user session.

Most OTPs are stored in Redis.
OTP — xxxxxx, TTL (Time to Live) — X mins

**Rate Limiting** is done via storing required data in Redis.

**Job Queue** using workers.

Key-value pairs — ex. "productAll": [{}, {}, {}], "otp:8420828031": 123123, "session:abcd123": "{userid:4, role: user,....}", "ttl": 50

IT IS NOT A SOLUTION FOR EVERY PROBLEM

Checklist to use Redis:
1. Reduce read pressure
2. Temp data which will expire after some time
3. Shared counters
4. Background jobs (queues)