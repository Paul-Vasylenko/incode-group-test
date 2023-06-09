import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

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
  email!: string;

  @Column
  passwordHash!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date | null;
}

export default User;
