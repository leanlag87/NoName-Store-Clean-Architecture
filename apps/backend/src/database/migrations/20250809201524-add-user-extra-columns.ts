import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface) {
    const table = await queryInterface.describeTable("users");

    if (!table.surname) {
      await queryInterface.addColumn("users", "surname", {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
      });
    }
    if (!table.image) {
      await queryInterface.addColumn("users", "image", {
        type: DataTypes.STRING,
        allowNull: true,
      });
    }
    if (!table.validated) {
      await queryInterface.addColumn("users", "validated", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
    if (!table.locked) {
      await queryInterface.addColumn("users", "locked", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
    if (!table.token) {
      await queryInterface.addColumn("users", "token", {
        type: DataTypes.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface: QueryInterface) {
    const table = await queryInterface.describeTable("users");

    if (table.token) await queryInterface.removeColumn("users", "token");
    if (table.locked) await queryInterface.removeColumn("users", "locked");
    if (table.validated)
      await queryInterface.removeColumn("users", "validated");
    if (table.image) await queryInterface.removeColumn("users", "image");
    if (table.surname) await queryInterface.removeColumn("users", "surname");
  },
};
