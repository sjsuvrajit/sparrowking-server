"use strict";

const { is } = require("zod/locales");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", //Don't allow deleting category with products
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      compare_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Indexes for better query performance
    await queryInterface.addIndex("products", ["category_id"]);
    await queryInterface.addIndex("products", ["slug"]);
    await queryInterface.addIndex("products", ["sku"]);
    await queryInterface.addIndex("products", ["is_active"]);
    await queryInterface.addIndex("products", ["price"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("products");
  },
};
