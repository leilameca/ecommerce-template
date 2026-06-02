const Category = require("../models/category.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/async-handler");

const u = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const img = (url, alt) => ({ url, alt, publicId: "" });

// ─── Curated photos by product type ──────────────────────────────────────────

// Ropa — camisetas en diferentes colores (misma foto de prenda, diferente tono)
const ROPA = {
  camiseta_blanca:  u("1583743814966-8d35de8ca9b9"), // white tee flat lay
  camiseta_negra:   u("1503341455253-b2e723bb3dbb"), // black tee on model
  camiseta_gris:    u("1574180045827-681f239c8d8d"), // gray tee
  hoodie_gris:      u("1556821840-3a63f8550908"),    // gray hoodie worn
  hoodie_negro:     u("1618354691373-d851c5c827a2"), // black hoodie
  hoodie_azul:      u("1523381210434-271e8be8a52b"), // blue/navy hoodie
  jogger_negro:     u("1571945153237-4929e783af4a"), // black jogger
  jogger_gris:      u("1617952986600-802f965dcdbc"), // gray jogger
  jogger_beige:     u("1523398503539-9a6a4b3b44b9"), // beige/cream pants
};

// Gorras — caps diferentes colores misma forma
const GORRAS = {
  snap_negro:  u("1588850561407-ed78c282e89b"), // black snapback
  snap_blanco: u("1575428652377-a2d80e2277fc"), // white cap
  snap_rojo:   u("1595950653106-bdbce89ff569"), // red cap
  bucket_negro: u("1514327605112-b82ab1255ec8"), // dark bucket hat
  bucket_beige: u("1521369909449-b7b5e07e3745"), // beige bucket hat
  bucket_blanco: u("1575428652377-a2d80e2277fc"), // white hat
  trucker_negro: u("1556269743-cfefe33b6fe5"),   // black trucker
  trucker_blanco: u("1575428652377-a2d80e2277fc"), // white trucker
  trucker_verde:  u("1588850561407-ed78c282e89b"), // dark/green trucker
};

// Zapatos — sneakers diferentes colores
const ZAPATOS = {
  low_blanco: u("1558618666-fcd25c85cd64"),    // white sneaker clean
  low_negro:  u("1491553895911-0055eca6402d"), // dark/black sneaker
  low_gris:   u("1542291026-7eec264c27ff"),    // gray/white Nike style
  high_blanco: u("1542291026-7eec264c27ff"),   // white hi-top
  high_negro:  u("1491553895911-0055eca6402d"),// black hi-top
  high_rojo:   u("1595950653106-bdbce89ff569"),// red/colorful
  slide_blanco: u("1600269452121-4f2416e55c28"),// white slide
  slide_negro:  u("1491553895911-0055eca6402d"),// black slide
  slide_gris:   u("1542291026-7eec264c27ff"),   // gray slide
};

// Carteras — bags/wallets diferentes colores
const BAGS = {
  tote_negro:  u("1548036161-18e851249499"),   // black tote
  tote_camel:  u("1590739225287-bd31519780c3"),// tan/camel bag
  tote_blanco: u("1553062407-98eeb64c6a62"),   // white/light bag
  cross_negro: u("1548036161-18e851249499"),   // black crossbody
  cross_marron: u("1590739225287-bd31519780c3"),// brown crossbody
  cross_beige: u("1553062407-98eeb64c6a62"),   // beige crossbody
  wallet_negro: u("1612263852701-62f569c7a678"),// black wallet
  wallet_marron: u("1627634777217-89de4efad82f"),// brown wallet
  wallet_camel: u("1590739225287-bd31519780c3"), // camel wallet
};

// Category cover images
const CAT_IMGS = {
  ropa:     u("1523381210434-271e8be8a52b", 1200), // clothing rack / outfit
  gorras:   u("1588850561407-ed78c282e89b", 1200), // cap close-up
  zapatos:  u("1558618666-fcd25c85cd64",   1200), // sneakers
  carteras: u("1548036161-18e851249499",   1200), // bag
};

const CATEGORIES = [
  {
    name: "Ropa", slug: "ropa", description: "Camisetas, hoodies y joggers",
    image: { url: CAT_IMGS.ropa, alt: "Colección Ropa", publicId: "" },
  },
  {
    name: "Gorras", slug: "gorras", description: "Snapbacks, bucket hats y truckers",
    image: { url: CAT_IMGS.gorras, alt: "Colección Gorras", publicId: "" },
  },
  {
    name: "Zapatos", slug: "zapatos", description: "Sneakers y slides",
    image: { url: CAT_IMGS.zapatos, alt: "Colección Zapatos", publicId: "" },
  },
  {
    name: "Carteras", slug: "carteras", description: "Tote bags, crossbody y billeteras",
    image: { url: CAT_IMGS.carteras, alt: "Colección Carteras", publicId: "" },
  },
];

const buildProducts = (cats) => {
  const ropa     = cats.find((c) => c.slug === "ropa")._id;
  const gorras   = cats.find((c) => c.slug === "gorras")._id;
  const zapatos  = cats.find((c) => c.slug === "zapatos")._id;
  const carteras = cats.find((c) => c.slug === "carteras")._id;

  return [
    // ─── ROPA ─────────────────────────────────────────────────────────────────
    {
      name: "Camiseta Essential",
      slug: "camiseta-essential",
      description: "La base perfecta de cualquier outfit. Camiseta de algodón pima 100% en corte unisex ligeramente oversize. Cuello redondo reforzado, costuras dobles y tela de 200g/m² para mayor durabilidad.",
      price: 28, stock: 50, category: ropa,
      images: [
        img(ROPA.camiseta_blanca, "Camiseta Essential Blanco"),
        img(ROPA.camiseta_negra,  "Camiseta Essential Negro"),
        img(ROPA.camiseta_gris,   "Camiseta Essential Gris"),
      ],
      variants: [
        { name: "Talla", options: ["XS", "S", "M", "L", "XL"] },
        { name: "Color", options: ["Blanco", "Negro", "Gris"] },
      ],
      variantImages: {
        "Color:Blanco": ROPA.camiseta_blanca,
        "Color:Negro":  ROPA.camiseta_negra,
        "Color:Gris":   ROPA.camiseta_gris,
      },
      isActive: true,
    },
    {
      name: "Hoodie Urban",
      slug: "hoodie-urban",
      description: "Hoodie de felpa francesa 320g/m² con capucha ajustable y bolsillo canguro. Corte relaxed con costuras laterales. Interior suave afelpado. Ideal para el día a día o el gym.",
      price: 58, stock: 35, category: ropa,
      images: [
        img(ROPA.hoodie_gris,  "Hoodie Urban Gris"),
        img(ROPA.hoodie_negro, "Hoodie Urban Negro"),
        img(ROPA.hoodie_azul,  "Hoodie Urban Azul"),
      ],
      variants: [
        { name: "Talla", options: ["S", "M", "L", "XL"] },
        { name: "Color", options: ["Gris", "Negro", "Azul"] },
      ],
      variantImages: {
        "Color:Gris":  ROPA.hoodie_gris,
        "Color:Negro": ROPA.hoodie_negro,
        "Color:Azul":  ROPA.hoodie_azul,
      },
      isActive: true,
    },
    {
      name: "Jogger Classic",
      slug: "jogger-classic",
      description: "Pantalón jogger de French Terry con cintura elástica y bolsillos con cremallera. Puños elastizados en el tobillo. Corte cónico, perfecto para loungewear o streetwear.",
      price: 45, stock: 40, category: ropa,
      images: [
        img(ROPA.jogger_negro, "Jogger Classic Negro"),
        img(ROPA.jogger_gris,  "Jogger Classic Gris"),
        img(ROPA.jogger_beige, "Jogger Classic Beige"),
      ],
      variants: [
        { name: "Talla", options: ["S", "M", "L", "XL"] },
        { name: "Color", options: ["Negro", "Gris", "Beige"] },
      ],
      variantImages: {
        "Color:Negro": ROPA.jogger_negro,
        "Color:Gris":  ROPA.jogger_gris,
        "Color:Beige": ROPA.jogger_beige,
      },
      isActive: true,
    },

    // ─── GORRAS ───────────────────────────────────────────────────────────────
    {
      name: "Snapback Signature",
      slug: "snapback-signature",
      description: "Gorra snapback de 6 paneles en twill de algodón 100%. Visera plana, cierre snapback ajustable y bordado frontal con logo de la marca. Talla única.",
      price: 32, stock: 45, category: gorras,
      images: [
        img(GORRAS.snap_negro,  "Snapback Negro"),
        img(GORRAS.snap_blanco, "Snapback Blanco"),
        img(GORRAS.snap_rojo,   "Snapback Rojo"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Blanco", "Rojo"] },
      ],
      variantImages: {
        "Color:Negro":  GORRAS.snap_negro,
        "Color:Blanco": GORRAS.snap_blanco,
        "Color:Rojo":   GORRAS.snap_rojo,
      },
      isActive: true,
    },
    {
      name: "Bucket Hat Relaxed",
      slug: "bucket-hat-relaxed",
      description: "Bucket hat reversible de ala ancha en algodón lavado. Ligero y plegable. Ideal para playa, festivales o salidas casuales. Talla única.",
      price: 28, stock: 38, category: gorras,
      images: [
        img(GORRAS.bucket_negro,  "Bucket Hat Negro"),
        img(GORRAS.bucket_beige,  "Bucket Hat Beige"),
        img(GORRAS.bucket_blanco, "Bucket Hat Blanco"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Beige", "Blanco"] },
      ],
      variantImages: {
        "Color:Negro":  GORRAS.bucket_negro,
        "Color:Beige":  GORRAS.bucket_beige,
        "Color:Blanco": GORRAS.bucket_blanco,
      },
      isActive: true,
    },
    {
      name: "Trucker Cap",
      slug: "trucker-cap",
      description: "Gorra trucker con panel frontal estructurado y malla trasera transpirable. Bordado minimalista en el panel frontal. Cierre snapback. El accesorio streetwear más versátil.",
      price: 25, stock: 42, category: gorras,
      images: [
        img(GORRAS.trucker_negro,  "Trucker Negro"),
        img(GORRAS.trucker_blanco, "Trucker Blanco"),
        img(GORRAS.trucker_verde,  "Trucker Verde"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Blanco", "Verde"] },
      ],
      variantImages: {
        "Color:Negro":  GORRAS.trucker_negro,
        "Color:Blanco": GORRAS.trucker_blanco,
        "Color:Verde":  GORRAS.trucker_verde,
      },
      isActive: true,
    },

    // ─── ZAPATOS ──────────────────────────────────────────────────────────────
    {
      name: "Sneaker Low Essential",
      slug: "sneaker-low-essential",
      description: "Sneaker de caña baja con suela vulcanizada y plantilla acolchada removible. Upper en lona reforzada con ojales metálicos. Corte clásico que combina con todo. Unisex.",
      price: 75, stock: 30, category: zapatos,
      images: [
        img(ZAPATOS.low_blanco, "Sneaker Low Blanco"),
        img(ZAPATOS.low_negro,  "Sneaker Low Negro"),
        img(ZAPATOS.low_gris,   "Sneaker Low Gris"),
      ],
      variants: [
        { name: "Talla", options: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
        { name: "Color", options: ["Blanco", "Negro", "Gris"] },
      ],
      variantImages: {
        "Color:Blanco": ZAPATOS.low_blanco,
        "Color:Negro":  ZAPATOS.low_negro,
        "Color:Gris":   ZAPATOS.low_gris,
      },
      isActive: true,
    },
    {
      name: "Sneaker High Urban",
      slug: "sneaker-high-urban",
      description: "Sneaker de caña alta con soporte de tobillo y suela dentada antideslizante. Cuero sintético premium con detalles en gamuza. Estilo urbano con comodidad todo el día.",
      price: 95, stock: 22, category: zapatos,
      images: [
        img(ZAPATOS.high_blanco, "Sneaker High Blanco"),
        img(ZAPATOS.high_negro,  "Sneaker High Negro"),
        img(ZAPATOS.high_rojo,   "Sneaker High Rojo"),
      ],
      variants: [
        { name: "Talla", options: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
        { name: "Color", options: ["Blanco", "Negro", "Rojo"] },
      ],
      variantImages: {
        "Color:Blanco": ZAPATOS.high_blanco,
        "Color:Negro":  ZAPATOS.high_negro,
        "Color:Rojo":   ZAPATOS.high_rojo,
      },
      isActive: true,
    },
    {
      name: "Slide Sport",
      slug: "slide-sport",
      description: "Sandalia slide unisex en EVA acolchado con suela antideslizante. Ultraligera y cómoda para post-gym, casa o playa. Lavable a mano.",
      price: 38, stock: 48, category: zapatos,
      images: [
        img(ZAPATOS.slide_blanco, "Slide Sport Blanco"),
        img(ZAPATOS.slide_negro,  "Slide Sport Negro"),
        img(ZAPATOS.slide_gris,   "Slide Sport Gris"),
      ],
      variants: [
        { name: "Talla", options: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
        { name: "Color", options: ["Blanco", "Negro", "Gris"] },
      ],
      variantImages: {
        "Color:Blanco": ZAPATOS.slide_blanco,
        "Color:Negro":  ZAPATOS.slide_negro,
        "Color:Gris":   ZAPATOS.slide_gris,
      },
      isActive: true,
    },

    // ─── CARTERAS ─────────────────────────────────────────────────────────────
    {
      name: "Tote Bag Classic",
      slug: "tote-bag-classic",
      description: "Bolso tote en lona de algodón 400g con remaches en asas y bolsillo interior con cremallera. Capacidad 20L. Lavable a máquina. El más versátil del guardarropa.",
      price: 42, stock: 35, category: carteras,
      images: [
        img(BAGS.tote_negro,  "Tote Bag Negro"),
        img(BAGS.tote_camel,  "Tote Bag Camel"),
        img(BAGS.tote_blanco, "Tote Bag Blanco"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Camel", "Blanco"] },
      ],
      variantImages: {
        "Color:Negro":  BAGS.tote_negro,
        "Color:Camel":  BAGS.tote_camel,
        "Color:Blanco": BAGS.tote_blanco,
      },
      isActive: true,
    },
    {
      name: "Mini Crossbody",
      slug: "mini-crossbody",
      description: "Bolso crossbody compacto en cuero PU. Correa ajustable 60–120cm, bolsillo frontal con imán. Cabe el móvil, llaves y cartera. Ideal para salidas rápidas.",
      price: 55, stock: 28, category: carteras,
      images: [
        img(BAGS.cross_negro,  "Crossbody Negro"),
        img(BAGS.cross_marron, "Crossbody Marrón"),
        img(BAGS.cross_beige,  "Crossbody Beige"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Marrón", "Beige"] },
      ],
      variantImages: {
        "Color:Negro":  BAGS.cross_negro,
        "Color:Marrón": BAGS.cross_marron,
        "Color:Beige":  BAGS.cross_beige,
      },
      isActive: true,
    },
    {
      name: "Billetera Slim",
      slug: "billetera-slim",
      description: "Billetera minimalista de cuero genuino. 6 ranuras para tarjetas, 2 bolsillos y compartimento para billetes. Solo 8mm de grosor. Perfecta para el bolsillo trasero.",
      price: 35, stock: 55, category: carteras,
      images: [
        img(BAGS.wallet_negro,  "Billetera Negro"),
        img(BAGS.wallet_marron, "Billetera Marrón"),
        img(BAGS.wallet_camel,  "Billetera Camel"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Marrón", "Camel"] },
      ],
      variantImages: {
        "Color:Negro":  BAGS.wallet_negro,
        "Color:Marrón": BAGS.wallet_marron,
        "Color:Camel":  BAGS.wallet_camel,
      },
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
