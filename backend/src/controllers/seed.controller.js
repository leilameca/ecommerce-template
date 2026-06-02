const Category = require("../models/category.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/async-handler");

// Stable placeholder images — always load. Replace from admin with real photos.
const ph = (hexColor, label) =>
  `https://placehold.co/800x800/${hexColor}/FFFFFF?text=${encodeURIComponent(label)}`;

const img = (url, alt) => ({ url, alt, publicId: "" });

// ─── Color palettes ───────────────────────────────────────────────────────────
const COLOR = {
  negro:    "111111",
  blanco:   "f5f5f5",
  rojo:     "cc0000",
  morado:   "552583",  // Lakers purple
  dorado:   "fdb927",  // Lakers gold
  verde:    "006400",
  azul:     "003087",
  gris:     "888888",
  camel:    "c19a6b",
  marron:   "7b4f2e",
  beige:    "e8d5b7",
  naranja:  "ff6600",
  rosa:     "e75480",
};

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "Gorras",
    slug: "gorras",
    description: "Snapbacks, fitted y bucket hats de las mejores marcas",
    image: { url: ph("111111", "Gorras"), alt: "Gorras", publicId: "" },
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
const buildProducts = (cats) => {
  const gorras = cats.find((c) => c.slug === "gorras")._id;

  return [
    // 1 — Gorra Nike — 3 colores
    {
      name: "Gorra Nike Classic",
      slug: "gorra-nike-classic",
      description: "Gorra snapback Nike con visera curva y bordado del Swoosh en el panel frontal. Cierre ajustable trasero. Tela de algodón 100% con banda interior absorbente. Talla única ajustable.",
      price: 35,
      stock: 40,
      category: gorras,
      images: [
        img(ph(COLOR.negro,  "Nike Negro"),  "Gorra Nike Classic — Negro"),
        img(ph(COLOR.blanco, "Nike Blanco"), "Gorra Nike Classic — Blanco"),
        img(ph(COLOR.rojo,   "Nike Rojo"),   "Gorra Nike Classic — Rojo"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Blanco", "Rojo"] },
      ],
      variantImages: {
        "Color:Negro":  ph(COLOR.negro,  "Nike Negro"),
        "Color:Blanco": ph(COLOR.blanco, "Nike Blanco"),
        "Color:Rojo":   ph(COLOR.rojo,   "Nike Rojo"),
      },
      isActive: true,
    },

    // 2 — Gorra Lakers — 2 colores
    {
      name: "Gorra Lakers NBA",
      slug: "gorra-lakers-nba",
      description: "Gorra oficial estilo NBA de los Los Angeles Lakers. Logo bordado en el frente, letras en relieve y cierre snapback ajustable. Perfecta para el fanático del baloncesto.",
      price: 42,
      stock: 28,
      category: gorras,
      images: [
        img(ph(COLOR.morado, "Lakers Morado"), "Gorra Lakers — Morado"),
        img(ph(COLOR.dorado, "Lakers Dorado"), "Gorra Lakers — Dorado"),
      ],
      variants: [
        { name: "Color", options: ["Morado", "Dorado"] },
      ],
      variantImages: {
        "Color:Morado": ph(COLOR.morado, "Lakers Morado"),
        "Color:Dorado": ph(COLOR.dorado, "Lakers Dorado"),
      },
      isActive: true,
    },

    // 3 — Gorra Jordan — 3 colores
    {
      name: "Gorra Jordan Jumpman",
      slug: "gorra-jordan-jumpman",
      description: "Gorra Jordan Brand con el icónico logo Jumpman bordado al frente. Panel estructurado de 6 paneles, visera curva y cierre de Velcro trasero. Algodón premium con acabado suave.",
      price: 38,
      stock: 32,
      category: gorras,
      images: [
        img(ph(COLOR.negro,   "Jordan Negro"),   "Gorra Jordan — Negro"),
        img(ph(COLOR.rojo,    "Jordan Rojo"),    "Gorra Jordan — Rojo"),
        img(ph(COLOR.blanco,  "Jordan Blanco"),  "Gorra Jordan — Blanco"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Rojo", "Blanco"] },
      ],
      variantImages: {
        "Color:Negro":  ph(COLOR.negro,  "Jordan Negro"),
        "Color:Rojo":   ph(COLOR.rojo,   "Jordan Rojo"),
        "Color:Blanco": ph(COLOR.blanco, "Jordan Blanco"),
      },
      isActive: true,
    },

    // 4 — Bucket Hat New Era — 3 colores
    {
      name: "Bucket Hat New Era",
      slug: "bucket-hat-new-era",
      description: "Bucket hat New Era de ala ancha en tela de algodón lavado. Logo bordado en el lateral. Ligero, plegable y reversible. Ideal para playa, festival o uso urbano. Talla única.",
      price: 32,
      stock: 35,
      category: gorras,
      images: [
        img(ph(COLOR.negro, "New Era Negro"),  "Bucket Hat New Era — Negro"),
        img(ph(COLOR.beige, "New Era Beige"),  "Bucket Hat New Era — Beige"),
        img(ph(COLOR.azul,  "New Era Azul"),   "Bucket Hat New Era — Azul"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Beige", "Azul"] },
      ],
      variantImages: {
        "Color:Negro": ph(COLOR.negro, "New Era Negro"),
        "Color:Beige": ph(COLOR.beige, "New Era Beige"),
        "Color:Azul":  ph(COLOR.azul,  "New Era Azul"),
      },
      isActive: true,
    },
  ];
};

// ─── Main handler ──────────────────────────────────────────────────────────────
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
      { $set: cat },
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
