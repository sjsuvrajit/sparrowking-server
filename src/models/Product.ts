import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Category from "./Category";

export interface ProductAttributes {
  id?: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock_quantity?: number;
  sku?: string;
  image_url?: string;
  images?: string[];
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public category_id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public price!: number;
  public compare_price?: number;
  public cost_price?: number;
  public stock_quantity!: number;
  public sku?: string;
  public image_url?: string;
  public images?: string[];
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations property
  public readonly category?: Category;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("price");
        return value ? parseFloat(value.toString()) : 0;
      },
    },
    compare_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      get() {
        const value = this.getDataValue("compare_price");
        return value ? parseFloat(value.toString()) : null;
      },
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      get() {
        const value = this.getDataValue("cost_price");
        return value ? parseFloat(value.toString()) : null;
      },
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: false,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Product;
