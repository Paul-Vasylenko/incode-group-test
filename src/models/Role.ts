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

  @Column
  mayHaveBoss!: boolean;

  @Column
  mustHaveBoss!: boolean;

  @Column(Sequelize.ARRAY(Sequelize.STRING))
  permissions!: string[];

  @HasMany(() => User, { as: 'users' })
  users!: User[];


  static async findById(id: string) {
    const role = await this.findByPk(id);
    
    if(!role) throw new Error('Not found');

    return role;
  }
}

export default Role;
