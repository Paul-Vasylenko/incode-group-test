import Sequelize from 'sequelize';
import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

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
}

export default Role;
