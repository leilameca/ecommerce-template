# Ecommerce Template

A production-ready, self-hosted ecommerce template built with Node.js + Express + MongoDB (backend) and React + Vite + Tailwind CSS (frontend).

## Features

- Product catalog with categories and image uploads (Cloudinary)
- Shopping cart with localStorage persistence
- Order management with stock validation
- Multiple payment methods: WhatsApp, cash on delivery, bank transfer
- **Stripe online payments** (optional — enable with your API keys)
- **Order notification emails** via SMTP (optional — enable with your credentials)
- Admin panel: dashboard, products, categories, orders, store configuration, user management
- Role-based access: `super-admin`, `admin`, `manager`
- JWT authentication
- Multi-language support (i18n)
- Responsive design

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or later |
| MongoDB | 6 or later (local) **or** a free MongoDB Atlas cluster |
| npm | 8 or later |

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/leilameca/ecommerce-template.git
cd ecommerce-template
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in at minimum:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce-template
JWT_SECRET=replace_with_a_long_random_string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.

On first run, the default admin user is created automatically using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### 3. Set up the frontend

```bash
cd ../frontend
cp .env.example .env
```

The default `.env` points to `http://localhost:5000/api/v1` which is correct for local development.

```bash
npm install
npm run dev
```

The storefront will be available at `http://localhost:5173`.
Admin panel: `http://localhost:5173/admin` — log in with the credentials you set above.

### 4. Run both together (root)

From the project root you can run both services at once:

```bash
npm install
npm run dev
```

---

## Image Uploads (Cloudinary)

Image uploads are required for products and categories.

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Online Payments (Stripe) — Optional

Stripe is disabled by default. To enable it:

1. Create an account at [stripe.com](https://stripe.com)
2. Get your **Secret Key** from the Stripe Dashboard → Developers → API keys
3. Add to `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
```

4. For webhooks (to automatically mark orders as paid after payment):
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/v1/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy the **Signing Secret** and add to `backend/.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. In your Admin Panel → Store Configuration, enable "Online Payment" as a payment method.

For local webhook testing, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:5000/api/v1/stripe/webhook
```

---

## Email Notifications — Optional

When an order is placed, the store owner receives an email notification. Disabled by default.

To enable, add SMTP credentials to `backend/.env`. Example with Gmail:

1. Enable 2-Step Verification on your Google account
2. Create an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add to `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM="My Store <your@gmail.com>"
STORE_NOTIFICATION_EMAIL=owner@example.com
```

Works with any SMTP provider (SendGrid, Mailgun, Amazon SES, etc.).

---

## Admin Panel

Access the admin panel at `/admin/login`.

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with order and revenue stats |
| `/admin/products` | Create, edit, delete products |
| `/admin/categories` | Manage product categories |
| `/admin/orders` | View and update order status |
| `/admin/store-config` | Store name, logo, colors, payment methods |
| `/admin/users` | Manage admin users (super-admin only) |

### Roles

| Role | Permissions |
|------|-------------|
| `super-admin` | Full access including user management |
| `admin` | Products, categories, orders, store config |
| `manager` | Orders only |

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | — | Login |
| GET | `/auth/me` | Token | Current user |
| GET | `/products` | — | List products (paginated) |
| GET | `/products/slug/:slug` | — | Product by slug |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/categories` | — | List categories |
| POST | `/categories` | Admin | Create category |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |
| POST | `/orders` | — | Create order |
| GET | `/orders` | Admin | List orders |
| GET | `/orders/:id` | Admin | Order detail |
| PATCH | `/orders/:id/status` | Admin | Update order status |
| GET | `/store-config` | — | Store settings |
| POST | `/store-config` | Admin | Update store settings |
| POST | `/uploads` | Admin | Upload image to Cloudinary |
| GET | `/users` | Super-admin | List admin users |
| POST | `/users` | Super-admin | Create admin user |
| PUT | `/users/:id` | Admin (self) / Super-admin | Update user |
| DELETE | `/users/:id` | Super-admin | Deactivate user |
| POST | `/stripe/create-session` | — | Create Stripe Checkout session |
| POST | `/stripe/webhook` | Stripe signature | Stripe webhook |

---

## Project Structure

```
ecommerce-template/
├── backend/
│   ├── src/
│   │   ├── config/        # env, database, bootstrap
│   │   ├── controllers/   # request handlers
│   │   ├── middlewares/   # auth, error handling, uploads
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Stripe, email
│   │   └── utils/         # helpers, validation, constants
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/    # UI and shared components
│   │   ├── contexts/      # Auth, Cart, StoreConfig
│   │   ├── hooks/
│   │   ├── i18n/          # Translations
│   │   ├── layouts/       # PublicLayout, AdminLayout
│   │   ├── lib/           # Utilities
│   │   ├── pages/         # Public and admin pages
│   │   ├── routes/        # React Router config
│   │   └── services/      # API client and service modules
│   └── .env.example
└── package.json
```

---

## Deployment

### Backend

Any Node.js host works: Railway, Render, Fly.io, VPS.

Required environment variables for production (same as `.env.example` but without localhost URLs):
- `NODE_ENV=production`
- `MONGODB_URI` pointing to your Atlas cluster
- `CLIENT_URL` pointing to your deployed frontend

### Frontend

Deploy with Vercel, Netlify, or any static host:

```bash
cd frontend
npm run build
# deploy the dist/ folder
```

Set `VITE_API_URL` in your hosting platform to your deployed backend URL.

---

## License

MIT
