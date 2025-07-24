export interface IRepository<Entity, Cond, UpdateDTO> extends IQueryRepository<Entity, Cond>, ICommandRepository<Entity, UpdateDTO> {}

export interface IQueryRepository<Entity, Cond> {
  get(id: string): Promise<Entity | null>
  findByCond(cond: Cond): Promise<Entity | null>
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(data: Entity): Promise<boolean>
  update(id: string, data: UpdateDTO): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>
}

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>
}