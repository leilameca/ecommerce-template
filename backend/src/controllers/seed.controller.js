const Category = require("../models/category.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/async-handler");

// Unsplash perfume photos — curated stable IDs
const PHOTOS = {
  f1: "https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=800&q=80",
  f2: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
  f3: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=800&q=80",
  f4: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
  f5: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
  f6: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80",
  m1: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=800&q=80",
  m2: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
  m3: "https://images.unsplash.com/photo-1584042283924-ae0aed82dfff?auto=format&fit=crop&w=800&q=80",
  m4: "https://images.unsplash.com/photo-1590156546054-3d12e0c22e5c?auto=format&fit=crop&w=800&q=80",
  s1: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80",
  s2: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=800&q=80",
};

const img = (url, alt) => ({ url, alt, publicId: "" });
const size = () => ({ name: "Tamaño", options: ["30ml", "50ml", "100ml"] });

const CATEGORIES = [
  { name: "Perfumes Mujer",  slug: "perfumes-mujer",  description: "Fragancias femeninas de alta perfumería" },
  { name: "Perfumes Hombre", slug: "perfumes-hombre", description: "Fragancias masculinas de carácter" },
  { name: "Sets & Regalos",  slug: "sets-regalos",    description: "Estuches y colecciones para regalar" },
  { name: "Corporales",      slug: "corporales",      description: "Cuidado y perfume para el cuerpo" },
];

const buildProducts = (cats) => {
  const mujer    = cats.find((c) => c.slug === "perfumes-mujer")._id;
  const hombre   = cats.find((c) => c.slug === "perfumes-hombre")._id;
  const sets     = cats.find((c) => c.slug === "sets-regalos")._id;
  const corporal = cats.find((c) => c.slug === "corporales")._id;

  return [
    // ─── Perfumes Mujer ───────────────────────────────────────────────────────
    {
      name: "Mystère Rose",
      slug: "mystere-rose",
      description: "Una fragancia floral-amaderada de Eau de Parfum con gran proyección. Abre con bergamota fresca y peonía rosada, evoluciona hacia un corazón de rosa damascena absoluta y cierra con base de almizcle blanco y madera de sándalo cremoso. 8–10 horas de duración.",
      price: 89,
      stock: 24,
      category: mujer,
      images: [img(PHOTOS.f1, "Mystère Rose"), img(PHOTOS.f2, "Mystère Rose — detalle"), img(PHOTOS.f3, "Mystère Rose — botella")],
      variants: [size()],
      isActive: true,
    },
    {
      name: "Lumière Dorée",
      slug: "lumiere-doree",
      description: "Un Eau de Parfum Intense oriental y gourmand. Notas de apertura de bergamota italiana y naranja dulce; corazón de iris absoluto y gardenia; base lujosa de vainilla bourbon, cachemira y ámbar dorado. Exclusivo y adictivo.",
      price: 128,
      stock: 16,
      category: mujer,
      images: [img(PHOTOS.f4, "Lumière Dorée"), img(PHOTOS.f5, "Lumière Dorée — detalle"), img(PHOTOS.f1, "Lumière Dorée — botella")],
      variants: [{ name: "Tamaño", options: ["50ml", "100ml"] }],
      isActive: true,
    },
    {
      name: "Velours Blanc",
      slug: "velours-blanc",
      description: "Ligero y contemporáneo, ideal para el uso diario. Eau de Toilette con notas frescas de jazmín sambac, bergamota y té blanco. Corazón suave de muguet y base de cedro blanco y almizcle limpio. Elegancia sin esfuerzo.",
      price: 72,
      stock: 30,
      category: mujer,
      images: [img(PHOTOS.f6, "Velours Blanc"), img(PHOTOS.f2, "Velours Blanc — detalle"), img(PHOTOS.f4, "Velours Blanc — botella")],
      variants: [size()],
      isActive: true,
    },
    // ─── Perfumes Hombre ──────────────────────────────────────────────────────
    {
      name: "Forêt Noire",
      slug: "foret-noire",
      description: "Eau de Parfum masculino de carácter profundo. Apertura de pimienta negra y cardamomo; corazón de cedro del Atlas y pachulí; base de vetiver haitiano y cuero suave. Sofisticación para el hombre moderno.",
      price: 87,
      stock: 20,
      category: hombre,
      images: [img(PHOTOS.m1, "Forêt Noire"), img(PHOTOS.m2, "Forêt Noire — detalle"), img(PHOTOS.m3, "Forêt Noire — botella")],
      variants: [size()],
      isActive: true,
    },
    {
      name: "Mediterráneo",
      slug: "mediterraneo",
      description: "Fresco y energizante. Eau de Toilette inspirada en la brisa del mar Mediterráneo. Notas acuáticas, bergamota de Calabria y limón siciliano; corazón de artemisa y lavanda; base de almizcle blanco y madera de cedro.",
      price: 65,
      stock: 28,
      category: hombre,
      images: [img(PHOTOS.m4, "Mediterráneo"), img(PHOTOS.m1, "Mediterráneo — detalle"), img(PHOTOS.m2, "Mediterráneo — botella")],
      variants: [size()],
      isActive: true,
    },
    {
      name: "Bois Profond",
      slug: "bois-profond",
      description: "Eau de Parfum Intense oriental-amaderado. Oud agarwood de la mejor calidad, ámbar gris, especias cálidas de canela y nuez moscada. Base de benjuí y resina labdanum. Una fragancia de carácter imponente y larga estela.",
      price: 115,
      stock: 12,
      category: hombre,
      images: [img(PHOTOS.m3, "Bois Profond"), img(PHOTOS.m4, "Bois Profond — detalle"), img(PHOTOS.m1, "Bois Profond — botella")],
      variants: [{ name: "Tamaño", options: ["50ml", "100ml"] }],
      isActive: true,
    },
    // ─── Sets & Regalos ───────────────────────────────────────────────────────
    {
      name: "Coffret Prestige Femme",
      slug: "coffret-prestige-femme",
      description: "El regalo perfecto para ella. Estuche de lujo con nuestras tres fragancias femeninas más icónicas en formato de 30ml: Mystère Rose, Lumière Dorée y Velours Blanc. Presentación premium con caja de regalo incluida.",
      price: 210,
      stock: 10,
      category: sets,
      images: [img(PHOTOS.s1, "Coffret Prestige Femme"), img(PHOTOS.f1, "Detalle"), img(PHOTOS.f4, "Contenido")],
      variants: [],
      isActive: true,
    },
    {
      name: "Duo Él & Ella",
      slug: "duo-el-ella",
      description: "El regalo ideal para celebrar a la pareja. Incluye Forêt Noire 50ml + Mystère Rose 50ml en un elegante estuche de madera con acabado mate. Perfecto para aniversarios, cumpleaños o el día especial.",
      price: 168,
      stock: 8,
      category: sets,
      images: [img(PHOTOS.s2, "Duo Él & Ella"), img(PHOTOS.m1, "Forêt Noire"), img(PHOTOS.f1, "Mystère Rose")],
      variants: [],
      isActive: true,
    },
    {
      name: "Collection Découverte",
      slug: "collection-decouverte",
      description: "Descubre tu fragancia favorita antes de comprometerte con el frasco completo. 6 miniaturas de 10ml con nuestras fragancias más vendidas de mujer y hombre. Estuche de viaje incluido. Ideal como regalo o para probar.",
      price: 78,
      stock: 22,
      category: sets,
      images: [img(PHOTOS.s1, "Collection Découverte"), img(PHOTOS.s2, "Detalle"), img(PHOTOS.f2, "Contenido")],
      variants: [],
      isActive: true,
    },
    // ─── Corporales ───────────────────────────────────────────────────────────
    {
      name: "Lait Velouté Femme",
      slug: "lait-veloutee-femme",
      description: "Leche corporal perfumada de absorción rápida con notas de rosa damascena, vainilla de Madagascar y manteca de karité. Hidratación profunda de 24 horas con un sutil velo perfumado. Textura sedosa, no grasa.",
      price: 48,
      stock: 26,
      category: corporal,
      images: [img(PHOTOS.f3, "Lait Velouté Femme"), img(PHOTOS.f5, "Detalle"), img(PHOTOS.f6, "Textura")],
      variants: [{ name: "Tamaño", options: ["200ml", "400ml"] }],
      isActive: true,
    },
    {
      name: "Brume Légère Corps",
      slug: "brume-legere-corps",
      description: "Bruma corporal refrescante de larga duración. Notas cítricas de bergamota, mandarina y pomelo; corazón floral de flor de loto y magnolia; base de almizcle suave. Ideal para verano o post-ducha.",
      price: 38,
      stock: 32,
      category: corporal,
      images: [img(PHOTOS.m2, "Brume Légère Corps"), img(PHOTOS.f2, "Detalle"), img(PHOTOS.m4, "Uso")],
      variants: [{ name: "Tamaño", options: ["150ml", "250ml"] }],
      isActive: true,
    },
    {
      name: "Élixir Corps Or",
      slug: "elixir-corps-or",
      description: "Aceite corporal seco de lujo con micro-partículas doradas. Fórmula no grasa a base de aceite de argán y jojoba. Perfumado con vainilla, ámbar y sándalo. Deja la piel iluminada, hidratada y con un aroma irresistible.",
      price: 58,
      stock: 18,
      category: corporal,
      images: [img(PHOTOS.s2, "Élixir Corps Or"), img(PHOTOS.f4, "Acabado"), img(PHOTOS.s1, "Textura")],
      variants: [{ name: "Tamaño", options: ["100ml", "200ml"] }],
      isActive: true,
    },
  ];
};

const runSeed = asyncHandler(async (req, res) => {
  const { reset } = req.query;

  if (reset === "true") {
    await Category.deleteMany({});
    await Product.deleteMany({});
  }

  const insertedCats = [];
  for (const cat of CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      cat,
      { upsert: true, new: true }
    );
    insertedCats.push(doc);
  }

  const products = buildProducts(insertedCats);
  let created = 0;
  for (const p of products) {
    const existing = await Product.findOne({ slug: p.slug });
    if (!existing) {
      await Product.create(p);
      created++;
    }
  }

  res.status(200).json({
    success: true,
    message: `Listo. ${created} productos creados, ${products.length - created} ya existían.`,
    data: { categoriesCount: CATEGORIES.length, productsCreated: created },
  });
});

module.exports = { runSeed };
