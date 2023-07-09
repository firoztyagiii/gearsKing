import Redis from "ioredis";
import { userIdEmailKey, userKey } from "../util/keys";

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
    const doc = await this.client.hset(key, data);
    if (doc) {
      return doc;
    } else {
      null;
    }
  }

  async setJSONHash(key: string, data: string) {
    await this.client.hset(key, {
      value: data,
    });
  }

  async getHash<T>(key: string): Promise<T | null> {
    const doc = await this.client.hgetall(key);
    if (!doc) {
      return null;
    }
    return doc as T;
  }

  async getJSONHash<T>(key: string): Promise<T | null> {
    const doc = await this.client.hgetall(key);
    if (doc) {
      return JSON.parse(doc.value);
    } else {
      return null;
    }
  }

  async getHashMember(key: string, objectKey: string): Promise<string | null> {
    const data = await this.client.hget(key, objectKey);
    if (data) {
      return data;
    }
    return null;
  }

  async findUserByEmail(
    email: string
  ): Promise<IRedisUser.UserDocument | null> {
    const userId = await this.getHashMember(userIdEmailKey(), email);
    if (userId) {
      const user = await this.getHash<IRedisUser.UserDocument>(userKey(userId));
      return user;
    } else {
      return null;
    }
  }

  async deleteHash(key: string) {
    await this.client.del(key);
  }
}

export default new RedisService();
