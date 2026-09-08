import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const roleNames = {
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  VIEWER: 'Visualizador'
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function exit() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <span className="brand-icon">🛍️</span>
            <div>
              <strong>Meu Catálogo</strong>
              <small>Produtos & Ofertas</small>
            </div>
          </div>

          <nav className="nav">
            <NavLink to="/produtos">🔎 Pesquisar produtos</NavLink>

            {(user.role === 'ADMIN' || user.role === 'EDITOR') && (
              <NavLink to="/produtos/novo">➕ Cadastrar produto</NavLink>
            )}

            {user.role === 'ADMIN' && (
              <NavLink to="/usuarios">👥 Usuários</NavLink>
            )}
          </nav>
        </div>

        <div className="user-box">
          <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>{roleNames[user.role]}</span>
          </div>
          <button className="icon-button" title="Sair" onClick={exit}>↪</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
