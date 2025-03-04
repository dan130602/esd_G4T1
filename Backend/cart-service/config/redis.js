import redis from 'redis';

const client = redis.createClient({
    url: "redis://redis:6379",
});

client.on("error", (err) => console.error("Redis Error:", err));

client.connect().then(() => console.log("Connected to Redis"));

export default client;