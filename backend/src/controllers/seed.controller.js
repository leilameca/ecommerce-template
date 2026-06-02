const Category = require("../models/category.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/async-handler");

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
const img = (url, alt) => ({ url, alt, publicId: "" });

// ─── Photos organized by color/tone ──────────────────────────────────────────
// Clothing
const ROPA = {
  blanco:  u("1583743814966-8d35de8ca9b9"),
  negro:   u("1503341455253-b2e723bb3dbb"),
  gris:    u("1556821840-3a63f8550908"),
  azul:    u("1523381210434-271e8be8a52b"),
  beige:   u("1523398503539-9a6a4b3b44b9"),
  hoodie1: u("1578681994506-b8f463906a3a"),
  hoodie2: u("1618354691373-d851c5c827a2"),
  jogger1: u("1571945153237-4929e783af4a"),
  jogger2: u("1617952986600-802f965dcdbc"),
};

// Gorras
const GORRAS = {
  cap_negro: u("1588850561407-ed78c282e89b"),
  cap_blanc: u("1575428652377-a2d80e2277fc"),
  cap_rojo:  u("1595950653106-bdbce89ff569"),
  bucket1:   u("1514327605112-b82ab1255ec8"),
  bucket2:   u("1521369909449-b7b5e07e3745"),
  trucker1:  u("1556269743-cfefe33b6fe5"),
};

// Zapatos
const ZAPATOS = {
  snk_blanc: u("1542291026-7eec264c27ff"),
  snk_negro: u("1542291026-7eec264c27ff"), // will override below
  snk_gris:  u("1584735175097-086fa9c4aaff"),
  shoe1:     u("1558618666-fcd25c85cd64"),
  shoe2:     u("1542291026-7eec264c27ff"),
  shoe3:     u("1491553895911-0055eca6402d"),
  slide1:    u("1595950653106-bdbce89ff569"),
  slide2:    u("1600269452121-4f2416e55c28"),
};

// Carteras / Accesorios
const BAGS = {
  tote_neg:  u("1548036161-18e851249499"),
  tote_cam:  u("1590739225287-bd31519780c3"),
  tote_bla:  u("1553062407-98eeb64c6a62"),
  cross1:    u("1548036161-18e851249499"),
  cross2:    u("1590739225287-bd31519780c3"),
  wallet1:   u("1612263852701-62f569c7a678"),
  wallet2:   u("1627634777217-89de4efad82f"),
};

const CATEGORIES = [
  { name: "Ropa",     slug: "ropa",     description: "Camisetas, hoodies y joggers" },
  { name: "Gorras",   slug: "gorras",   description: "Snapbacks, bucket hats y truckers" },
  { name: "Zapatos",  slug: "zapatos",  description: "Sneakers y slides" },
  { name: "Carteras", slug: "carteras", description: "Tote bags, crossbody y billeteras" },
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
      description: "La base perfecta de cualquier outfit. Camiseta de algodón pima 100% en corte unisex ligeramente oversize. Cuello redondo reforzado, costuras dobles y tela de 200g/m² para mayor durabilidad. Disponible en tres colores.",
      price: 28,
      stock: 50,
      category: ropa,
      images: [
        img(ROPA.blanco, "Camiseta Essential — Blanco"),
        img(ROPA.negro, "Camiseta Essential — Negro"),
        img(ROPA.gris, "Camiseta Essential — Gris"),
      ],
      variants: [
        { name: "Talla", options: ["XS", "S", "M", "L", "XL"] },
        { name: "Color", options: ["Blanco", "Negro", "Gris"] },
      ],
      variantImages: {
        "Color:Blanco": ROPA.blanco,
        "Color:Negro":  ROPA.negro,
        "Color:Gris":   ROPA.gris,
      },
      isActive: true,
    },
    {
      name: "Hoodie Urban",
      slug: "hoodie-urban",
      description: "Hoodie de felpa francesa 320g/m² con capucha ajustable y bolsillo canguro. Corte relaxed con costuras laterales para mayor movilidad. Interior suave afelpado. Ideal para el día a día o el gym.",
      price: 58,
      stock: 35,
      category: ropa,
      images: [
        img(ROPA.hoodie1, "Hoodie Urban — Gris"),
        img(ROPA.negro, "Hoodie Urban — Negro"),
        img(ROPA.hoodie2, "Hoodie Urban — Azul"),
      ],
      variants: [
        { name: "Talla", options: ["S", "M", "L", "XL"] },
        { name: "Color", options: ["Gris", "Negro", "Azul"] },
      ],
      variantImages: {
        "Color:Gris":  ROPA.hoodie1,
        "Color:Negro": ROPA.negro,
        "Color:Azul":  ROPA.hoodie2,
      },
      isActive: true,
    },
    {
      name: "Jogger Classic",
      slug: "jogger-classic",
      description: "Pantalón jogger de tela French Terry con cintura elástica ajustable y bolsillos laterales con cremallera. Puños elastizados en el tobillo. Corte cónico moderno, perfecto para loungewear o streetwear.",
      price: 45,
      stock: 40,
      category: ropa,
      images: [
        img(ROPA.jogger1, "Jogger Classic — Negro"),
        img(ROPA.jogger2, "Jogger Classic — Gris"),
        img(ROPA.beige, "Jogger Classic — Beige"),
      ],
      variants: [
        { name: "Talla", options: ["S", "M", "L", "XL"] },
        { name: "Color", options: ["Negro", "Gris", "Beige"] },
      ],
      variantImages: {
        "Color:Negro": ROPA.jogger1,
        "Color:Gris":  ROPA.jogger2,
        "Color:Beige": ROPA.beige,
      },
      isActive: true,
    },

    // ─── GORRAS ───────────────────────────────────────────────────────────────
    {
      name: "Snapback Signature",
      slug: "snapback-signature",
      description: "Gorra snapback con visera plana y cierre ajustable trasero. Estructura de 6 paneles en tela twill de algodón 100%. Bordado frontal con el logo de la marca. Talla única ajustable.",
      price: 32,
      stock: 45,
      category: gorras,
      images: [
        img(GORRAS.cap_negro, "Snapback Signature — Negro"),
        img(GORRAS.cap_blanc, "Snapback Signature — Blanco"),
        img(GORRAS.cap_rojo, "Snapback Signature — Rojo"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Blanco", "Rojo"] },
      ],
      variantImages: {
        "Color:Negro":  GORRAS.cap_negro,
        "Color:Blanco": GORRAS.cap_blanc,
        "Color:Rojo":   GORRAS.cap_rojo,
      },
      isActive: true,
    },
    {
      name: "Bucket Hat Relaxed",
      slug: "bucket-hat-relaxed",
      description: "Bucket hat de ala ancha en tela de algodón lavado. Diseño reversible con interior estampado. Ideal para playa, festivales o salidas casuales. Ligero y plegable, cabe en cualquier bolsillo.",
      price: 28,
      stock: 38,
      category: gorras,
      images: [
        img(GORRAS.bucket1, "Bucket Hat Relaxed — Negro"),
        img(GORRAS.bucket2, "Bucket Hat Relaxed — Beige"),
        img(GORRAS.cap_blanc, "Bucket Hat Relaxed — Blanco"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Beige", "Blanco"] },
      ],
      variantImages: {
        "Color:Negro": GORRAS.bucket1,
        "Color:Beige": GORRAS.bucket2,
        "Color:Blanco": GORRAS.cap_blanc,
      },
      isActive: true,
    },
    {
      name: "Trucker Cap",
      slug: "trucker-cap",
      description: "Gorra trucker clásica con panel frontal estructurado y malla trasera transpirable. Cierre snapback ajustable. Bordado minimalista en el panel frontal. El accesorio streetwear más versátil.",
      price: 25,
      stock: 42,
      category: gorras,
      images: [
        img(GORRAS.trucker1, "Trucker Cap — Negro"),
        img(GORRAS.cap_blanc, "Trucker Cap — Blanco"),
        img(GORRAS.cap_negro, "Trucker Cap — Gris"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Blanco", "Gris"] },
      ],
      variantImages: {
        "Color:Negro":  GORRAS.trucker1,
        "Color:Blanco": GORRAS.cap_blanc,
        "Color:Gris":   GORRAS.cap_negro,
      },
      isActive: true,
    },

    // ─── ZAPATOS ──────────────────────────────────────────────────────────────
    {
      name: "Sneaker Low Essential",
      slug: "sneaker-low-essential",
      description: "Sneaker de caña baja con suela de goma vulcanizada y plantilla acolchada removible. Upper en lona de algodón reforzada con ojales metálicos. Corte clásico que combina con todo. Unisex.",
      price: 75,
      stock: 30,
      category: zapatos,
      images: [
        img(ZAPATOS.shoe1, "Sneaker Low — Blanco"),
        img(ZAPATOS.shoe3, "Sneaker Low — Negro"),
        img(ZAPATOS.snk_gris, "Sneaker Low — Gris"),
      ],
      variants: [
        { name: "Talla", options: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
        { name: "Color", options: ["Blanco", "Negro", "Gris"] },
      ],
      variantImages: {
        "Color:Blanco": ZAPATOS.shoe1,
        "Color:Negro":  ZAPATOS.shoe3,
        "Color:Gris":   ZAPATOS.snk_gris,
      },
      isActive: true,
    },
    {
      name: "Sneaker High Urban",
      slug: "sneaker-high-urban",
      description: "Sneaker de caña alta con soporte de tobillo y cordones planos. Suela de goma dentada antideslizante. Material exterior en cuero sintético premium con detalles en gamuza. Estilo urbano con comodidad todo el día.",
      price: 95,
      stock: 22,
      category: zapatos,
      images: [
        img(ZAPATOS.shoe2, "Sneaker High — Blanco"),
        img(ZAPATOS.shoe3, "Sneaker High — Negro"),
        img(ZAPATOS.slide1, "Sneaker High — Rojo"),
      ],
      variants: [
        { name: "Talla", options: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
        { name: "Color", options: ["Blanco", "Negro", "Rojo"] },
      ],
      variantImages: {
        "Color:Blanco": ZAPATOS.shoe2,
        "Color:Negro":  ZAPATOS.shoe3,
        "Color:Rojo":   ZAPATOS.slide1,
      },
      isActive: true,
    },
    {
      name: "Slide Sport",
      slug: "slide-sport",
      description: "Sandalia slide unisex con banda superior en EVA acolchado y suela con textura antideslizante. Ultraligera y cómoda para usar después del gym, en casa o en la playa. Lavable a mano.",
      price: 38,
      stock: 48,
      category: zapatos,
      images: [
        img(ZAPATOS.slide2, "Slide Sport — Blanco"),
        img(ZAPATOS.shoe3, "Slide Sport — Negro"),
        img(ZAPATOS.snk_gris, "Slide Sport — Gris"),
      ],
      variants: [
        { name: "Talla", options: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] },
        { name: "Color", options: ["Blanco", "Negro", "Gris"] },
      ],
      variantImages: {
        "Color:Blanco": ZAPATOS.slide2,
        "Color:Negro":  ZAPATOS.shoe3,
        "Color:Gris":   ZAPATOS.snk_gris,
      },
      isActive: true,
    },

    // ─── CARTERAS ─────────────────────────────────────────────────────────────
    {
      name: "Tote Bag Classic",
      slug: "tote-bag-classic",
      description: "Bolso tote spacioso en lona de algodón 400g reforzada con remaches en las asas. Interior con bolsillo con cremallera y organizador de bolígrafos. Capacidad 20L. Lavable a máquina. El bolso más versátil del guardarropa.",
      price: 42,
      stock: 35,
      category: carteras,
      images: [
        img(BAGS.tote_neg, "Tote Bag Classic — Negro"),
        img(BAGS.tote_cam, "Tote Bag Classic — Camel"),
        img(BAGS.tote_bla, "Tote Bag Classic — Blanco"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Camel", "Blanco"] },
      ],
      variantImages: {
        "Color:Negro":  BAGS.tote_neg,
        "Color:Camel":  BAGS.tote_cam,
        "Color:Blanco": BAGS.tote_bla,
      },
      isActive: true,
    },
    {
      name: "Mini Crossbody",
      slug: "mini-crossbody",
      description: "Bolso crossbody compacto en cuero PU de alta calidad. Correa ajustable de 60–120cm, bolsillo frontal con imán y compartimento principal con cremallera YKK. Ideal para salidas rápidas o festivales. Cabe el móvil, llaves y cartera.",
      price: 55,
      stock: 28,
      category: carteras,
      images: [
        img(BAGS.cross1, "Mini Crossbody — Negro"),
        img(BAGS.tote_cam, "Mini Crossbody — Marrón"),
        img(BAGS.tote_bla, "Mini Crossbody — Beige"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Marrón", "Beige"] },
      ],
      variantImages: {
        "Color:Negro":  BAGS.cross1,
        "Color:Marrón": BAGS.tote_cam,
        "Color:Beige":  BAGS.tote_bla,
      },
      isActive: true,
    },
    {
      name: "Billetera Slim",
      slug: "billetera-slim",
      description: "Billetera minimalista de cuero genuino con 6 ranuras para tarjetas, 2 bolsillos laterales y compartimento para billetes. Costuras visibles en hilo contrastante. Delgada (8mm) para llevar en el bolsillo trasero sin incomodidad.",
      price: 35,
      stock: 55,
      category: carteras,
      images: [
        img(BAGS.wallet1, "Billetera Slim — Negro"),
        img(BAGS.wallet2, "Billetera Slim — Marrón"),
        img(BAGS.tote_cam, "Billetera Slim — Camel"),
      ],
      variants: [
        { name: "Color", options: ["Negro", "Marrón", "Camel"] },
      ],
      variantImages: {
        "Color:Negro":  BAGS.wallet1,
        "Color:Marrón": BAGS.wallet2,
        "Color:Camel":  BAGS.tote_cam,
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
