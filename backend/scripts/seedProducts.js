const { db } = require('../config/firebase');

const products = [
  {
    name: "Classic Over-sized Hoodie",
    desc: "Premium cotton-blend oversized hoodie inspired by urban streetwear aesthetics. Features ribbed cuffs and a kangaroo pocket.",
    price: 85.00,
    originalPrice: 105.00,
    category: "hoodies",
    brand: "DRIP YARD",
    stock: 25,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111", "#444", "#f0e6d3"],
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 124,
    isNew: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Cargo Street Joggers",
    desc: "Multi-pocket cargo pants with a tapered fit and adjustable ankle cuffs. Finished with high-quality water-resistant fabric.",
    price: 65.00,
    originalPrice: 85.00,
    category: "pants",
    brand: "DRIP YARD",
    stock: 40,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M", "L"],
    colors: ["#2d3a2a", "#111", "#c2b280"],
    badge: "New",
    rating: 4.5,
    reviewCount: 89,
    isNew: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Graphic Tee 'Rebirth'",
    desc: "Limited edition heavyweight cotton graphic tee featuring our signature 'Rebirth' artwork printed on the back.",
    price: 35.00,
    originalPrice: 45.00,
    category: "tshirts",
    brand: "DRIP YARD",
    stock: 100,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#fff", "#111"],
    badge: null,
    rating: 4.9,
    reviewCount: 215,
    isNew: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Signature Snapback Cap",
    desc: "Sleek monochromatic snapback cap with an embroidered logo on the front panel and adjustable strap.",
    price: 28.00,
    originalPrice: null,
    category: "accessories",
    brand: "DRIP YARD",
    stock: 60,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
    sizes: ["One Size"],
    colors: ["#111", "#0e1a3a"],
    badge: "Hot",
    rating: 4.2,
    reviewCount: 56,
    isNew: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Reflective Bomber Jacket",
    desc: "High-visibility reflective bomber jacket with quilted lining and premium metal zippers. Perfect for night aesthetics.",
    price: 120.00,
    originalPrice: 159.00,
    category: "jackets",
    brand: "DRIP YARD",
    stock: 15,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#c0c0c0", "#3a3a3a"],
    badge: "Limited",
    rating: 4.9,
    reviewCount: 42,
    isNew: true,
    createdAt: new Date().toISOString()
  }
];

const seedProducts = async () => {
    try {
        console.log('Starting product seeding...');
        const productsCollection = db.collection('products');

        // We skip clearing products due to a potential unauthenticated error when calling get()

        for (const product of products) {
            await productsCollection.add({
                ...product,
                lastUpdated: new Date().toISOString()
            });
            console.log(`Added product: ${product.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
