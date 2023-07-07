import Redis from "ioredis";

class RedisService {
  client;
  constructor() {
    this.client = new Redis();
    this.onConnect();
  }

  onConnect() {
    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });
  }

  async setHash(key: string, data: { [key: string]: string }) {
    await this.client.hset(key, data);
  }

  async getHash<T>(key: string): Promise<T> {
    const doc = await this.client.hgetall(key);
    return doc as T;
  }
}

export default new RedisService();
