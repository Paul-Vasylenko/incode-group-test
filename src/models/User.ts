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
  Default,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import Role from './Role';
import ApiError from '../utils/errors';

@Table({
  paranoid: true,
  tableName: 'Users',
  modelName: 'User',
  freezeTableName: true,
  timestamps: true,
})
class User extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
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

  @ForeignKey(() => Role)
  @Column
  roleId!: string;
  @BelongsTo(() => Role, { as: 'role' })
  role!: Role;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  bossId!: string | null;
  @BelongsTo(() => User, { as: 'boss' })
  boss!: User | null;
  @HasMany(() => User, { as: 'subordinates' })
  subordinates!: User[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt!: Date;

  async getSubordinates() {
    const subordinates = await User.findAll({
      where: {
        bossId: this.id,
      },
    });
    const deepSubordinates: User[] = [];

    for (const subordinate of subordinates) {
      if (subordinate.roleId === 'BOSS') {
        const childSubordinates = await subordinate.getSubordinates();

        deepSubordinates.push(...childSubordinates);
      }
    }

    return [...subordinates, ...deepSubordinates];
  }

  static async findById(id: string): Promise<User> {
    const user = await User.findByPk(id, {
      include: [
        { model: User, as: 'boss' },
        { model: Role, as: 'role' },
      ],
    });

    if (!user)
      throw new ApiError({
        message: 'User not found',
        type: 'NOT_FOUND',
        status: 400,
      });

    return user;
  }
}

export type UserCreateData = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  roleId: string;
  bossId: string | null;
};

export default User;
