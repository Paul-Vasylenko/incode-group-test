import Sequelize from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import User from './User';

@Table({
  tableName: 'Roles',
  modelName: 'Role',
  freezeTableName: true,
  timestamps: false,
})
class Role extends Model {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  name!: string;

  @Column(Sequelize.ARRAY(Sequelize.STRING))
  permissions!: string[];

  @HasMany(() => User, { as: 'users' })
  users!: User[];
}

export default Role;
