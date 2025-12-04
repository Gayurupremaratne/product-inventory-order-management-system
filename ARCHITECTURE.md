# Architecture Document

## State Management Choice

**Redux Toolkit** was chosen as the state management solution for the following reasons:

1. **Centralized State**: Provides a single source of truth for application state, making it easier to manage complex data flows
2. **DevTools Integration**: Excellent browser extension support for debugging and time-travel debugging
3. **Built-in Async Support**: `createAsyncThunk` simplifies handling of asynchronous operations (API calls)
4. **TypeScript Integration**: Strong TypeScript support with typed hooks and selectors
5. **Scalability**: Proven pattern for larger applications with multiple features and teams
6. **Predictable Updates**: Immutable state updates ensure predictable application behavior

The application uses feature-based slices:
- `productSlice`: Manages products, filters, pagination, and current product state
- `orderSlice`: Manages orders and order pagination

Each slice includes:
- Initial state definition
- Async thunks for API calls (`fetchProducts`, `fetchProductById`, `updateProduct`, `fetchOrders`)
- Reducers for synchronous state updates
- Selectors for derived state (using `createSelector` from Reselect for memoization)

## Component Architecture

The application follows a **feature-based folder structure**:

```
src/
├── app/              # Core application setup (store, typed hooks)
├── components/       # Shared/reusable components
├── features/         # Feature modules
│   ├── products/     # Product feature
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── productsApi.ts # API layer
│   │   ├── productSlice.ts # State management
│   │   └── pages/         # Feature pages
│   └── orders/       # Order feature
├── routes/           # Route configuration
├── styles/           # Theme and global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

**Key Principles:**
- **Separation of Concerns**: API calls, state management, and UI are separated into different files
- **Feature Modules**: Each feature is self-contained with its own components, hooks, and state
- **Reusability**: Shared components are in the `components/` directory
- **Custom Hooks**: Business logic is extracted into custom hooks (`useDebounce`, `usePrefetchProduct`)

**Component Breakdown:**
- **Pages**: Large container components that orchestrate data fetching and layout
- **Components**: Smaller, reusable UI components
- **Hooks**: Custom hooks for shared logic (debouncing, prefetching)

## API Integration Strategy

**Axios** is used as the HTTP client with the following approach:

1. **Centralized API Modules**: Each feature has its own API module (`productsApi.ts`, `ordersApi.ts`)
2. **Axios Instance**: Shared axios instance with base URL configuration
3. **Error Handling**: Comprehensive error handling with user-friendly error messages via Notistack toasts
4. **Async Thunks**: All API calls are wrapped in Redux Toolkit `createAsyncThunk` for state management integration
5. **Type Safety**: Full TypeScript typing for all API responses

**API Endpoints Used:**
- `GET /products` - Fetch products with pagination, search, and category filters
- `GET /products/{id}` - Fetch single product details
- `PUT /products/{id}` - Update product (simulated by DummyJSON)
- `GET /carts` - Fetch orders (converted from cart data)

**Error Handling:**
- Network errors are caught and displayed via Snackbar notifications
- Error state is stored in Redux for UI components to react to
- Retry logic can be easily added using async thunk's retry mechanism

## UI/UX Decisions

**Material UI (MUI)** was chosen for the following reasons:

1. **Consistent Design System**: Provides a cohesive set of components following Material Design principles
2. **Accessibility**: Built-in accessibility features and ARIA support
3. **Theming**: Easy theming system for consistent styling
4. **Rich Component Library**: Includes advanced components like DataGrid for complex data display
5. **Responsive**: Built-in responsive breakpoints and grid system

**Key UI/UX Features:**

1. **Server-Side Pagination**: Implemented for better performance with large datasets
   - Pagination state managed in Redux
   - Page changes trigger new API calls

2. **Debounced Search**: Search input is debounced (500ms) to reduce API calls
   - Implemented using custom `useDebounce` hook
   - `useDeferredValue` for non-urgent filter updates

3. **Loading States**: 
   - Loading indicators during data fetches
   - Suspense boundaries for lazy-loaded routes

4. **Error Handling**:
   - Toast notifications for errors and success messages
   - Error states in components with retry options

5. **Optimistic Updates**:
   - Product updates show immediate feedback
   - Form validation with Yup schemas

6. **Performance Optimizations**:
   - Code splitting with React.lazy()
   - Memoization with React.memo, useMemo, useCallback
   - Prefetching product details on row hover
   - `startTransition` for non-urgent state updates

## Performance Optimizations

1. **Code Splitting**: All routes are lazy-loaded to reduce initial bundle size
2. **Memoization**: 
   - Components wrapped with `React.memo`
   - Selectors using `createSelector` for memoized derived state
   - `useMemo` and `useCallback` for expensive computations
3. **Debouncing**: Search input debounced to reduce API calls
4. **Prefetching**: Product details prefetched on row hover for faster navigation
5. **Deferred Values**: `useDeferredValue` for non-urgent updates
6. **Transitions**: `startTransition` wraps expensive state updates to keep UI responsive

## Technical Decisions

1. **Server-Side Pagination**: Chosen over client-side for scalability with large datasets
2. **Client-Side Price Filtering**: Price range filter applied locally as DummyJSON doesn't support it server-side
3. **Active/Inactive Toggle**: Stored in local state/Redux as DummyJSON doesn't persist this field
4. **Order Status**: Simulated based on cart ID for demonstration purposes

## Future Enhancements

- Dark mode toggle (MUI theme already supports it)
- Advanced filtering options
- Bulk operations for products
- Export functionality (CSV, PDF)
- Real-time updates (WebSockets)
- User authentication and authorization
- Order creation and editing
- Advanced analytics dashboard

