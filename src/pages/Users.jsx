import { useEffect, useState } from 'react';
import api from '../api';

const empty = { name: '', email: '', password: '', role: 'VIEWER' };

const roles = {
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  VIEWER: 'Visualizador'
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    const { data } = await api.get('/users');
    setUsers(data);
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/users', form);
      setForm(empty);
      setSuccess('Usuário cadastrado com sucesso.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível cadastrar o usuário.');
    }
  }

  async function remove(id) {
    if (!window.confirm('Excluir este usuário?')) return;
    await api.delete(`/users/${id}`);
    load();
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <span className="eyebrow">ADMINISTRAÇÃO</span>
          <h1>Usuários</h1>
          <p>Cadastre usuários e defina o nível de acesso.</p>
        </div>
      </div>

      <div className="users-layout">
        <form className="card form-card" onSubmit={submit}>
          <h2>Novo usuário</h2>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <div className="field">
            <label>Nome *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="field">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="field">
            <label>Senha *</label>
            <input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          <div className="field">
            <label>Permissão *</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="ADMIN">Administrador</option>
              <option value="EDITOR">Editor</option>
              <option value="VIEWER">Visualizador</option>
            </select>
          </div>

          <button className="button primary full" type="submit">Cadastrar usuário</button>
        </form>

        <div className="card table-card">
          <div className="table-header">
            <h2>Usuários cadastrados</h2>
            <span>{users.length}</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>Email</th><th>Permissão</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.email}</td>
                    <td><span className={`role role-${item.role.toLowerCase()}`}>{roles[item.role]}</span></td>
                    <td><button className="text-danger" onClick={() => remove(item._id)}>Excluir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
