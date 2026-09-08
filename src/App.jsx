import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Users from './pages/Users';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/produtos" replace />} />
          <Route path="/produtos" element={<Products />} />
          <Route
            path="/produtos/novo"
            element={
              <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/produtos/:id/editar"
            element={
              <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/produtos" replace />} />
      </Routes>
    </AuthProvider>
  );
}
