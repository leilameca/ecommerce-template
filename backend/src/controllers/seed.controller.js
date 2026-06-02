const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/async-handler");
const ApiError = require("../utils/api-error");

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const P = {
  p1a: "1541643600914-78b084683702",
  p1b: "1588405748880-12d1d2a59f75",
  p2a: "1592945403244-b3fbafd7f539",
  p2b: "1615634260167-c8cdede054de",
  p3a: "1563170351-be82bc888aa4",
  p3b: "1547887538-e3a2f32cb1cc",
  p4a: "1587017539504-67cfbddac569",
  p4b: "1523293182086-7651a899d37f",
  p5a: "1584042283924-ae0aed82dfff",
  p5b: "1590156546054-3d12e0c22e5c",
  p6a: "1528360983277-13d401cdc186",
  p6b: "1619994403073-2cec844b8e63",
};

const toImages = (ids) =>
  ids.map((id, i) => ({ url: IMG(id), alt: `Product image ${i + 1}`, publicId: "" }));

const CATEGORIES = [
  { name: "Perfumes Mujer",  slug: "perfumes-mujer",  description: "Fragancias femeninas de larga duración" },
  { name: "Perfumes Hombre", slug: "perfumes-hombre", description: "Fragancias masculinas sofisticadas" },
  { name: "Sets & Regalos",  slug: "sets-regalos",    description: "Sets y estuches perfectos para regalar" },
  { name: "Corporales",      slug: "corporales",      description: "Cremas, brumas y aceites corporales" },
];

const buildProducts = (cats) => {
  const mujer    = cats.find((c) => c.slug === "perfumes-mujer")._id;
  const hombre   = cats.find((c) => c.slug === "perfumes-hombre")._id;
  const sets     = cats.find((c) => c.slug === "sets-regalos")._id;
  const corporal = cats.find((c) => c.slug === "corporales")._id;

  return [
    {
      name: "Rose Noir", slug: "rose-noir",
      description: "Una fragancia oscura y seductora con corazón de rosa negra, oud y almizcle blanco. Proyección intensa y larga duración de hasta 12 horas.",
      price: 95, stock: 20, category: mujer,
      images: toImages([P.p1a, P.p1b, P.p2a]),
      variants: [
        { name: "Tamaño", options: ["30ml", "50ml", "100ml"] },
        { name: "Edición", options: ["Clásica", "Intensa", "Limitada"] },
      ],
      variantImages: { "Edición:Clásica": IMG(P.p1a), "Edición:Intensa": IMG(P.p2a), "Edición:Limitada": IMG(P.p1b) },
      isActive: true,
    },
    {
      name: "Fleur Blanche", slug: "fleur-blanche",
      description: "Fresca y femenina. Notas de jazmín blanco, gardenia y un fondo cálido de vainilla y sándalo. Perfecta para el día a día.",
      price: 75, stock: 25, category: mujer,
      images: toImages([P.p2b, P.p3a, P.p1a]),
      variants: [
        { name: "Tamaño", options: ["30ml", "50ml", "100ml"] },
        { name: "Aroma", options: ["Jazmín", "Gardenia", "Vainilla"] },
      ],
      variantImages: { "Aroma:Jazmín": IMG(P.p2b), "Aroma:Gardenia": IMG(P.p3a), "Aroma:Vainilla": IMG(P.p1a) },
      isActive: true,
    },
    {
      name: "Velvet Femme", slug: "velvet-femme",
      description: "Opulenta y moderna. Melocotón jugoso en la salida, corazón floral y fondo de cedro y sándalo cremoso.",
      price: 120, stock: 15, category: mujer,
      images: toImages([P.p3b, P.p4a, P.p2b]),
      variants: [
        { name: "Tamaño", options: ["50ml", "100ml"] },
        { name: "Color", options: ["Rosa", "Dorado", "Negro"] },
      ],
      variantImages: { "Color:Rosa": IMG(P.p3b), "Color:Dorado": IMG(P.p4a), "Color:Negro": IMG(P.p2b) },
      isActive: true,
    },
    {
      name: "Black Cedar", slug: "black-cedar",
      description: "Masculino y sofisticado. Apertura de bergamota fresca, corazón de cedro atlástico y base de vetiver y pimienta negra.",
      price: 85, stock: 18, category: hombre,
      images: toImages([P.p4b, P.p5a, P.p3a]),
      variants: [
        { name: "Tamaño", options: ["30ml", "50ml", "100ml"] },
        { name: "Versión", options: ["Original", "Extreme", "Sport"] },
      ],
      variantImages: { "Versión:Original": IMG(P.p4b), "Versión:Extreme": IMG(P.p5a), "Versión:Sport": IMG(P.p3a) },
      isActive: true,
    },
    {
      name: "Océan Bleu", slug: "ocean-bleu",
      description: "Fresco y dinámico. Notas acuáticas, bergamota y un fondo de almizcle blanco y madera suave.",
      price: 70, stock: 22, category: hombre,
      images: toImages([P.p5b, P.p6a, P.p4a]),
      variants: [
        { name: "Tamaño", options: ["30ml", "50ml", "100ml"] },
        { name: "Intensidad", options: ["Eau de Toilette", "Eau de Parfum"] },
      ],
      variantImages: { "Intensidad:Eau de Toilette": IMG(P.p5b), "Intensidad:Eau de Parfum": IMG(P.p6a) },
      isActive: true,
    },
    {
      name: "Amber Wood", slug: "amber-wood",
      description: "Profundo y misterioso. Ámbar dorado, madera de oud y especias orientales. Una fragancia que deja huella.",
      price: 110, stock: 12, category: hombre,
      images: toImages([P.p6b, P.p1a, P.p5a]),
      variants: [
        { name: "Tamaño", options: ["50ml", "100ml"] },
        { name: "Edición", options: ["Ámbar", "Oud", "Especias"] },
      ],
      variantImages: { "Edición:Ámbar": IMG(P.p6b), "Edición:Oud": IMG(P.p1a), "Edición:Especias": IMG(P.p5a) },
      isActive: true,
    },
    {
      name: "Set Romantique", slug: "set-romantique",
      description: "El regalo perfecto para ella. 3 miniaturas de 30ml: Rose Noir, Fleur Blanche y Velvet Femme en elegante estuche.",
      price: 150, stock: 10, category: sets,
      images: toImages([P.p1b, P.p2a, P.p3b]),
      variants: [
        { name: "Presentación", options: ["Estuche Clásico", "Estuche Lujo"] },
      ],
      variantImages: { "Presentación:Estuche Clásico": IMG(P.p1b), "Presentación:Estuche Lujo": IMG(P.p2a) },
      isActive: true,
    },
    {
      name: "Set Him & Her", slug: "set-him-her",
      description: "El regalo ideal para parejas. Black Cedar 50ml + Fleur Blanche 50ml en estuche de lujo.",
      price: 180, stock: 8, category: sets,
      images: toImages([P.p4b, P.p2b, P.p5b]),
      variants: [
        { name: "Presentación", options: ["Caja Regalo", "Bolsa Premium"] },
      ],
      variantImages: { "Presentación:Caja Regalo": IMG(P.p4b), "Presentación:Bolsa Premium": IMG(P.p2b) },
      isActive: true,
    },
    {
      name: "Miniature Collection", slug: "miniature-collection",
      description: "5 miniaturas de 10ml con nuestras fragancias más queridas. Ideal para viajes o para regalar.",
      price: 65, stock: 30, category: sets,
      images: toImages([P.p6a, P.p3a, P.p1a]),
      variants: [
        { name: "Colección", options: ["Femenina", "Masculina", "Mixta"] },
      ],
      variantImages: { "Colección:Femenina": IMG(P.p6a), "Colección:Masculina": IMG(P.p3a), "Colección:Mixta": IMG(P.p1a) },
      isActive: true,
    },
    {
      name: "Body Silk Femme", slug: "body-silk-femme",
      description: "Loción corporal ultra hidratante con notas de rosa damascena y manteca de karité.",
      price: 45, stock: 25, category: corporal,
      images: toImages([P.p3b, P.p2b, P.p1b]),
      variants: [
        { name: "Tamaño", options: ["200ml", "400ml"] },
        { name: "Aroma", options: ["Rosa", "Coco", "Vainilla"] },
      ],
      variantImages: { "Aroma:Rosa": IMG(P.p3b), "Aroma:Coco": IMG(P.p2b), "Aroma:Vainilla": IMG(P.p1b) },
      isActive: true,
    },
    {
      name: "Body Mist Fresco", slug: "body-mist-fresco",
      description: "Bruma corporal ligera y refrescante. Notas cítricas de bergamota, limón y flores blancas.",
      price: 35, stock: 30, category: corporal,
      images: toImages([P.p5a, P.p6b, P.p4a]),
      variants: [
        { name: "Tamaño", options: ["150ml", "250ml"] },
        { name: "Fragancia", options: ["Cítrico", "Floral", "Acuático"] },
      ],
      variantImages: { "Fragancia:Cítrico": IMG(P.p5a), "Fragancia:Floral": IMG(P.p6b), "Fragancia:Acuático": IMG(P.p4a) },
      isActive: true,
    },
    {
      name: "Gold Elixir", slug: "gold-elixir",
      description: "Aceite corporal seco con destellos dorados. Hidrata profundamente con aroma a vainilla y ámbar.",
      price: 55, stock: 20, category: corporal,
      images: toImages([P.p6b, P.p5b, P.p4b]),
      variants: [
        { name: "Tamaño", options: ["100ml", "200ml"] },
        { name: "Acabado", options: ["Dorado", "Plateado", "Rosado"] },
      ],
      variantImages: { "Acabado:Dorado": IMG(P.p6b), "Acabado:Plateado": IMG(P.p5b), "Acabado:Rosado": IMG(P.p4b) },
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
    message: `Seed complete. ${created} products created, ${products.length - created} already existed.`,
    data: { categoriesCount: CATEGORIES.length, productsCreated: created },
  });
});

module.exports = { runSeed };
