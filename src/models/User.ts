import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import Role from './Role';

@Table({
  paranoid: true,
  tableName: 'Users',
  modelName: 'User',
  freezeTableName: true,
  timestamps: true,
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

  // foreign key
  @ForeignKey(() => Role)
  @Column
  roleId!: string;

  // for assosiation
  @BelongsTo(() => Role, { as: 'role' })
  role!: Role;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date | null;
}

export default User;
