import User from "./User";
import Product from "./Product";
import Category from "./Category";

// Define all model associations here

export const initializeAssociations = () => {
  // Category has many Products
  Category.hasMany(Product, {
    foreignKey: "category_id",
    as: "products",
  });

  // Product belongs to Category
  Product.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
  });
};
