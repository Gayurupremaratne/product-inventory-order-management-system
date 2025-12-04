# Products Admin Panel

A modern, production-ready React application for managing products and orders. Built with React 19, TypeScript, Redux Toolkit, and Material UI.

## 🚀 Features

### Product Management
- **Product List Page**: Server-side paginated DataGrid with advanced filtering
  - Search by product name (debounced)
  - Filter by category
  - Price range slider
  - Server-side pagination and sorting
  - Product prefetching on hover
- **Product Details Page**: 
  - Full product information display
  - Image gallery
  - Edit stock quantity with form validation
  - Active/Inactive toggle
  - Optimistic UI updates

### Order Management
- **Order List Page**: 
  - Sortable and filterable order table
  - Status badges (Pending, Processing, Shipped, Delivered, Cancelled)
  - Server-side pagination
  - Order details with total, items, and dates

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management with async thunks
- **Material UI (MUI)** - Component library
- **@mui/x-data-grid** - Advanced data grid component
- **React Router v6** - Client-side routing
- **React Hook Form + Yup** - Form handling and validation
- **Axios** - HTTP client
- **Notistack** - Toast notifications
- **Reselect** - Memoized selectors
- **Day.js** - Date formatting

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd products-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── store.ts          # Redux store configuration
│   └── hooks.ts          # Typed Redux hooks
├── components/           # Shared components
│   ├── AppLayout.tsx     # Main layout with sidebar
│   ├── LoadingFallback.tsx
│   ├── OrderStatusBadge.tsx
│   └── ConfirmationDialog.tsx
├── features/
│   ├── products/
│   │   ├── productsApi.ts       # API calls
│   │   ├── productSlice.ts      # Redux slice
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailsPage.tsx
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   └── FilterPanel.tsx
│   │   └── hooks/
│   │       ├── useDebounce.ts
│   │       └── usePrefetchProduct.ts
│   └── orders/
│       ├── ordersApi.ts
│       ├── orderSlice.ts
│       └── OrderListPage.tsx
├── routes/
│   └── AppRoutes.tsx     # Route configuration
├── styles/
│   └── theme.ts          # MUI theme
├── types/                # TypeScript types
│   ├── product.ts
│   └── order.ts
└── utils/
    └── format.ts         # Utility functions
```

## 🎯 Key Features & Implementation

### Performance Optimizations

1. **Code Splitting**: All routes are lazy-loaded with `React.lazy()` and `Suspense`
2. **Memoization**: 
   - Components wrapped with `React.memo`
   - Selectors using `createSelector` from Reselect
   - `useMemo` and `useCallback` for expensive operations
3. **Debouncing**: Search input is debounced to reduce API calls
4. **Prefetching**: Product details are prefetched when hovering over rows
5. **Deferred Values**: `useDeferredValue` for non-urgent updates
6. **Transitions**: `startTransition` for expensive state updates

### State Management

- **Redux Toolkit** with feature-based slices
- **Async Thunks** for API calls
- **Selectors** for derived state (categories, filtered products)
- Typed hooks (`useAppDispatch`, `useAppSelector`)

### API Integration

- Uses **DummyJSON** API (`https://dummyjson.com`)
- Axios instance for centralized configuration
- Comprehensive error handling
- Retry logic (can be extended)

### UI/UX

- **Material UI** components throughout
- Responsive layout with sidebar navigation
- Loading states and error handling
- Toast notifications for user feedback
- Form validation with Yup schemas

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 API Endpoints Used

- `GET /products?limit={limit}&skip={skip}` - Fetch products
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `GET /carts?limit={limit}&skip={skip}` - Fetch orders (converted from carts)

## 🎨 Architecture Decisions

### State Management Choice
Redux Toolkit was chosen for:
- Centralized state management
- Excellent DevTools support
- Built-in async thunk support
- TypeScript integration
- Scalability for larger applications

### Component Architecture
- Feature-based folder structure
- Separation of concerns (API, state, UI)
- Reusable components in shared folder
- Custom hooks for business logic

### API Integration Strategy
- Axios for HTTP requests
- Centralized API modules per feature
- Error handling with user-friendly messages
- Async thunks for Redux integration

### UI/UX Decisions
- Material UI for consistent design system
- Server-side pagination for large datasets
- Debounced search for better performance
- Loading states and error boundaries
- Optimistic updates for better UX

## 🔐 Environment Variables

No environment variables required. The app uses the public DummyJSON API.

## 🚧 Future Enhancements

- Dark mode toggle
- Advanced filtering options
- Bulk operations
- Export functionality
- Real-time updates
- User authentication
- Order creation/editing

## 📄 License

MIT

## 👤 Author

Built as a technical assessment project.

---

**Note**: This application uses the DummyJSON API for demonstration purposes. In a production environment, you would connect to your own backend API.

