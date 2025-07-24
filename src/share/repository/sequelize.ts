import { Sequelize } from 'sequelize'
import { IRepository } from '../interface'
import { Op } from 'sequelize'

export abstract class BaseRepositorySequelize<Entity, Cond, UpdateDTO>
  implements IRepository<Entity, Cond, UpdateDTO>
{
  constructor(
    protected readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id) //trả về 1 ModelInstance và là 1 bản ghi có nhiều method chứ k thuần túy data

    if (!data) {
      return null
    }

    const persistenceData = data.get({ plain: true }) //lấy dữ liệu thuần túy từ ModelInstance, không có method nào cả

    return {
      ...persistenceData,
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    } as Entity
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: cond as any,
    })
    if (!data) {
      return null
    }
    const persistenceData = data.get({ plain: true }) //lấy dữ liệu thuần túy từ ModelInstance, không có method nào cả
    return {
      ...persistenceData,
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    } as Entity
  }
  async insert(data: Entity): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any) // Cast to any to avoid type issues with Sequelize
    return true
  }

  async update(id: string, data: UpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, {
      where: { id: id },
    })
    return true
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sequelize.models[this.modelName].destroy({
      where: { id: id },
    })

    return true
  }
}
//49.37
