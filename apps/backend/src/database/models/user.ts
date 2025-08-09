import { Model, DataTypes } from "sequelize";
import connection from "../connection";
import { UserRole } from "@domain/entities/User";

class User extends Model {
  public id!: number;
  public name!: string;
  public surname!: string;
  public email!: string;
  public password!: string;
  public image?: string;
  public validated!: boolean;
  public locked!: boolean;
  public token?: string;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    surname: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    image: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    validated: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    locked: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: true,
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: "User",
    tableName: "Users",
    paranoid: true,
  }
);

export default User;
