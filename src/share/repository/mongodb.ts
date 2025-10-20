import { Collection, Db, DeleteResult, Filter, InsertOneResult } from 'mongodb'
import { IRepository } from '../interface'

export abstract class BaseMongoDBRepository<Entity, Cond, UpdateDTO>
  implements IRepository<Entity, Cond, UpdateDTO>
{
  protected collection: Collection
  constructor(protected db: Db, protected collectionName: string) {
    this.collection = this.db.collection(this.collectionName)
  }
  get(id: string): Promise<Entity | null> {
    throw new Error('Method not implemented.')
  }
  insert(data: Entity): Promise<Entity> {
    throw new Error('Method not implemented.')
  }

  protected abstract toEntity(doc: any): Entity
  protected abstract toDocument(entity: Entity): any
  protected abstract buildFilter(cond: Cond): Filter<any>
  protected abstract buildUpdateDocument(updateDto: UpdateDTO): any

  async save(entity: Entity): Promise<Entity> {
    const doc = this.toDocument(entity)

    if (doc._id) {
      // Update existing
      const result = await this.collection.replaceOne({ _id: doc._id }, doc, {
        upsert: true,
      })
      return entity
    } else {
      // Insert new
      const result: InsertOneResult = await this.collection.insertOne(doc)
      doc._id = result.insertedId
      return this.toEntity(doc)
    }
  }

  async create(entity: Entity): Promise<Entity> {
    const doc = this.toDocument(entity)
    const result: InsertOneResult = await this.collection.insertOne(doc)
    doc._id = result.insertedId
    return this.toEntity(doc)
  }
  async findOne(cond: Cond): Promise<Entity | null> {
    const filter = this.buildFilter(cond)
    const result = await this.collection.findOne(filter)
    return result ? this.toEntity(result) : null
  }
  async update(id: string, updateDto: UpdateDTO): Promise<boolean> {
    const filter = this.buildFilter({ _id: id } as unknown as Cond)
    const updateDoc = this.buildUpdateDocument(updateDto)

    const result = await this.collection.findOneAndUpdate(filter, updateDoc, {
      returnDocument: 'after',
    })

    if (!result || !result.value) {
      return false
    }
    return true
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    const filter = this.buildFilter({ _id: id } as unknown as Cond)
    const result: DeleteResult = await this.collection.deleteOne(filter)
    return result.deletedCount > 0
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    const filter = this.buildFilter(cond)
    let cursor = this.collection.find(filter)

    const docs = await cursor.toArray()
    return docs.length > 0 ? this.toEntity(docs[0]) : null
  }
}
