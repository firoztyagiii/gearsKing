import Redis from "ioredis";

class RedisService {
  private client;
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

  async createSortedSet(key: string, data: { score: number; member: string }) {
    await this.client.zadd(key, data.score, data.member);
  }

  async getSortedSetMember(key: string, member: string) {
    return await this.client.zscore(key, member);
  }
}

export default new RedisService();
