import Category from "../models/Category";
import Product from "../models/Product";
import sequelize from "../config/sequelize";

const seedTestData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    //create categories
    const electronics = await Category.create({
      name: "Electronics",
      slug: "electronics",
      description: "Electronic gadgets and devices",
      is_active: true,
    });

    const clothing = await Category.create({
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and apparel",
      is_active: true,
    });

    console.log("Categories created");

    //create products
    await Product.create({
      category_id: electronics.id,
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "Latest iPhone with A17 Pro chip",
      price: 999.99,
      compare_price: 1099.99,
      cost_price: 800.0,
      stock_quantity: 50,
      sku: "AAPL-IP15P-256-BLK",
      image_url: "https://example.com/iphone.jpg",
      images: [
        "https://example.com/iphone-1.jpg",
        "https://example.com/iphone-2.jpg",
      ],
      is_active: true,
    });

    await Product.create({
      category_id: electronics.id,
      name: "Samsung Galaxy S24",
      slug: "samsung-galaxy-s24",
      description: "Flagship Samsung smartphone",
      price: 899.99,
      stock_quantity: 30,
      sku: "SAMS-GS24-128-WHT",
      is_active: true,
    });

    await Product.create({
      category_id: clothing.id,
      name: "Nike Air Max",
      slug: "nike-air-max",
      description: "Classic Nike sneakers",
      price: 129.99,
      compare_price: 149.99,
      stock_quantity: 100,
      sku: "NIKE-AM-10-BLK",
      is_active: true,
    });

    console.log("✅ Products created");
    console.log("✅ Test data seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedTestData();
