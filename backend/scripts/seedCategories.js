const { db } = require('../config/firebase');

const categories = [
  { name: "Hoodies", description: "Premium street style hoodies and sweatshirts.", icon: "HoodieIcon" },
  { name: "Pants", description: "Cargos, Joggers, and Denims.", icon: "PantsIcon" },
  { name: "T-Shirts", description: "Graphic and minimal tees.", icon: "TShirtIcon" },
  { name: "Jackets", description: "Bombers, Windbreakers, and Parkas.", icon: "JacketIcon" },
  { name: "Accessories", description: "Caps, Bags, and More.", icon: "AccessoryIcon" }
];

const seedCategories = async () => {
    try {
        console.log('Starting category seeding...');
        const categoriesCollection = db.collection('categories');

        for (const category of categories) {
            await categoriesCollection.add({
                ...category,
                createdAt: new Date().toISOString()
            });
            console.log(`Added category: ${category.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
