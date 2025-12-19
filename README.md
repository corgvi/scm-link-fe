# SCM-Link Admin Frontend

A modern, responsive admin dashboard for Supply Chain Management, built with Vue 3, TypeScript, Vite, and Tailwind CSS.

## Features
- Warehouse, Inventory, Product, Supplier, Order, Delivery, Vehicle management
- CRUD operations with modals and validation
- Real-time notifications with global Alert system
- Advanced filtering, search, and pagination
- Role-based access (Admin, Shipper, Warehouse Staff, etc.)
- Responsive design, dark mode support
- RESTful API integration
- Robust error handling and user feedback

## Demo account:
- Username: admin | user
- Password: admin | user

## Tech Stack
- **Vue 3** + `<script setup lang="ts">`
- **Vite** for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **ESLint** & **Prettier** for code quality

## Project Structure
```
src/
  components/      # UI components (buttons, modals, tables, etc.)
  views/           # Page views (Admin, Inventory, Logistic, etc.)
  router/          # Vue Router setup
  services/        # API service modules
  composables/     # Reusable logic (hooks)
  assets/          # Static assets (images, styles)
public/            # Static files
```

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Environment Variables
Create a `.env` file based on `.env.example` and set your API endpoints and tokens:
```
VITE_BASE_URL=https://your-api-endpoint
VITE_MAPBOX_TOKEN=your-mapbox-token
```

## Contributing
- Fork the repo and create a feature branch
- Follow the existing code style and naming conventions
- Submit a pull request with a clear description

## License
MIT

---
**SCM-Link Admin** — Modern supply chain management made simple.
