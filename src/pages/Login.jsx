import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/produtos');
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível entrar.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-decoration decoration-blue" />
      <div className="login-decoration decoration-pink" />
      <div className="login-decoration decoration-yellow" />

      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">🛍️</div>
        <h1>Meu Catálogo</h1>
        <p className="muted">Entre para gerenciar e encontrar produtos.</p>

        {error && <div className="alert error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button className="button primary full" type="submit">Entrar</button>
      </form>
    </div>
  );
}
