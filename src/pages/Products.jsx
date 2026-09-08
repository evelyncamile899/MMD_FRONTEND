import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../auth/AuthContext';

export default function Products() {
  const { user } = useAuth();
  const canEdit = ['ADMIN', 'EDITOR'].includes(user.role);
  const canDelete = user.role === 'ADMIN';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/products', {
        params: { search, category }
      });
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos.');
    }
  }

  async function loadCategories() {
    const { data } = await api.get('/products/categories');
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  async function remove(id) {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;
    await api.delete(`/products/${id}`);
    load();
    loadCategories();
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <span className="eyebrow">CATÁLOGO</span>
          <h1>Pesquisar produtos</h1>
          <p>Encontre produtos por nome ou categoria.</p>
        </div>
        {canEdit && <Link className="button primary" to="/produtos/novo">+ Novo produto</Link>}
      </div>

      <div className="filters card">
        <div className="search-wrap">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar pelo nome..."
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="result-count">{products.length} produto(s) encontrado(s)</div>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product._id}>
            <div className="product-top">
              <span className="category-tag">{product.category}</span>
              <span className="product-date">
                {new Date(product.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <h2>{product.name}</h2>
            <div className="price">
              R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>

            <div className="market-links">
              {product.links?.shopee && <a href={product.links.shopee} target="_blank" rel="noreferrer">🛒 Shopee ↗</a>}
              {product.links?.amazon && <a href={product.links.amazon} target="_blank" rel="noreferrer">📦 Amazon ↗</a>}
              {product.links?.mercadoLivre && <a href={product.links.mercadoLivre} target="_blank" rel="noreferrer">💛 Mercado Livre ↗</a>}
            </div>

            {canEdit && (
              <div className="card-actions">
                <Link className="button secondary small" to={`/produtos/${product._id}/editar`}>Editar</Link>
                {canDelete && <button className="button danger small" onClick={() => remove(product._id)}>Excluir</button>}
              </div>
            )}
          </article>
        ))}
      </div>

      {!products.length && (
        <div className="empty-state">
          <div>🔍</div>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente mudar a busca ou cadastrar um novo produto.</p>
        </div>
      )}
    </section>
  );
}
