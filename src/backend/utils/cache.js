const { createClient } = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect() {
    // Redis disabled for deployment
    console.log('Redis caching disabled - using memory cache');
    this.connected = false;
    return null;
  }

  async get(key) {
    try {
      if (!this.connected || !this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        return null;
      }

      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, expirySeconds = 3600) {
    try {
      if (!this.connected || !this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        return false;
      }

      await this.client.setEx(key, expirySeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      if (!this.connected || !this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        return false;
      }

      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      if (!this.connected || !this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async flush() {
    try {
      if (!this.connected || !this.client) {
        await this.connect();
      }
      
      if (!this.client) {
        return false;
      }

      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      this.connected = false;
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;

