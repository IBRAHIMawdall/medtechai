const { createClient } = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected && this.client) {
      return this.client;
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.log('Too many Redis reconnection attempts, giving up');
              return new Error('Too many retries');
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => console.error('Redis Client Error:', err));
      this.client.on('connect', () => console.log('Redis connecting...'));
      this.client.on('ready', () => {
        console.log('Redis connected successfully');
        this.connected = true;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('Redis connection error:', error);
      this.connected = false;
      return null;
    }
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

