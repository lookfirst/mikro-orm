import { EntityData, EntityMetadata, EntityProperty, IEntity, IEntityType, IPrimaryKey } from '../decorators';
import { Connection, QueryResult } from '../connections';
import { QueryOrderMap } from '../query';
import { Platform } from '../platforms';
import { LockMode } from '../unit-of-work';

export interface IDatabaseDriver<C extends Connection = Connection> {

  getConnection(): C;

  /**
   * Finds selection of entities
   */
  find<T extends IEntity>(entityName: string, where: FilterQuery<T>, populate?: string[], orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<T[]>;

  /**
   * Finds single entity (table row, document)
   */
  findOne<T extends IEntity>(entityName: string, where: FilterQuery<T> | IPrimaryKey, populate?: string[], orderBy?: QueryOrderMap, fields?: string[], lockMode?: LockMode): Promise<T | null>;

  nativeInsert<T extends IEntity>(entityName: string, data: EntityData<T>): Promise<QueryResult>;

  nativeUpdate<T extends IEntity>(entityName: string, where: FilterQuery<T> | IPrimaryKey, data: EntityData<T>): Promise<QueryResult>;

  nativeDelete<T extends IEntity>(entityName: string, where: FilterQuery<T> | IPrimaryKey): Promise<QueryResult>;

  count<T extends IEntity>(entityName: string, where: FilterQuery<T>): Promise<number>;

  aggregate(entityName: string, pipeline: any[]): Promise<any[]>;

  mapResult<T extends IEntityType<T>>(result: EntityData<T>, meta: EntityMetadata): T | null;

  /**
   * When driver uses pivot tables for M:N, this method will load identifiers for given collections from them
   */
  loadFromPivotTable<T extends IEntity>(prop: EntityProperty, owners: IPrimaryKey[]): Promise<Record<string, T[]>>;

  /**
   * Begins a transaction (if supported)
   */
  beginTransaction(): Promise<void>;

  /**
   * Commits statements in a transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback changes in a transaction
   */
  rollback(): Promise<void>;

  /**
   * Runs callback inside transaction
   */
  transactional(cb: () => Promise<any>): Promise<any>;

  isInTransaction(): boolean;

  getPlatform(): Platform;

}

export type FilterQuery<T> = Partial<T> | Record<string, any>;
