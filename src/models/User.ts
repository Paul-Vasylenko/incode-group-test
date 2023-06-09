import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasOne
} from 'sequelize-typescript';
import Role from './Role';

@Table({
  paranoid: true,
  tableName: 'Users',
  modelName: 'User',
  freezeTableName: true,
  timestamps: true
})
class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  email!: string; // has unique index "Users_unique_email"

  @Column
  passwordHash!: string;

  @HasOne(() => Role)
  @Column
  roleId!: string

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date | null;
}

export default User;
