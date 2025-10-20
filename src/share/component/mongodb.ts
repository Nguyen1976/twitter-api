import { MongoClient, Db } from 'mongodb'
import { config } from '~/share/component/config'

export class MongoDBConnection {
  private client: MongoClient | null = null
  private db: Db | null = null

  async connect(): Promise<Db> {
    if (this.db && this.client) return this.db

    this.client = new MongoClient(config.mongodb.url, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    await this.client.connect()
    this.db = this.client.db(config.mongodb.database)
    console.log(`✅ MongoDB connected to "${config.mongodb.database}"`)

    return this.db
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('MongoDB is not connected. Call connect() first.')
    }
    return this.db
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw new Error('MongoDB client not initialized. Call connect() first.')
    }
    return this.client
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close()
        this.client = null
        this.db = null
        console.log('✅ MongoDB disconnected')
      }
    } catch (error) {
      console.error('❌ MongoDB disconnect error:', error)
    }
  }
}
