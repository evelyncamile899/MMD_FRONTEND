import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const initial = {
  name: '',
  category: '',
  price: '',
  links: { shopee: '', amazon: '', mercadoLivre: '' }
};

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;

    api.get('/products')
      .then(({ data }) => {
        const item = data.find((p) => p._id === id);
        if (!item) return navigate('/produtos');
        setForm({
          name: item.name,
          category: item.category,
          price: item.price,
          links: {
            shopee: item.links?.shopee || '',
            amazon: item.links?.amazon || '',
            mercadoLivre: item.links?.mercadoLivre || ''
          }
        });
      });
  }, [id, editing]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setLink(field, value) {
    setForm((current) => ({
      ...current,
      links: { ...current.links, [field]: value }
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editing) await api.put(`/products/${id}`, form);
      else await api.post('/products', form);
      navigate('/produtos');
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <span className="eyebrow">CATÁLOGO</span>
          <h1>{editing ? 'Editar produto' : 'Cadastrar produto'}</h1>
          <p>Preencha as informações e os links de compra.</p>
        </div>
      </div>

      <form className="form-card card" onSubmit={submit}>
        {error && <div className="alert error">{error}</div>}

        <div className="form-grid">
          <div className="field span-2">
            <label>Nome do produto *</label>
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} required placeholder="Ex.: Fone Bluetooth" />
          </div>

          <div className="field">
            <label>Categoria *</label>
            <input value={form.category} onChange={(e) => setField('category', e.target.value)} required placeholder="Ex.: Eletrônicos" />
          </div>

          <div className="field">
            <label>Valor *</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField('price', e.target.value)} required placeholder="0,00" />
          </div>
        </div>

        <div className="section-title">
          <span>🔗</span>
          <div>
            <h3>Links de compra</h3>
            <p>Adicione os links das lojas disponíveis.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Shopee</label>
            <input type="url" value={form.links.shopee} onChange={(e) => setLink('shopee', e.target.value)} placeholder="https://shopee.com.br/..." />
          </div>

          <div className="field">
            <label>Amazon</label>
            <input type="url" value={form.links.amazon} onChange={(e) => setLink('amazon', e.target.value)} placeholder="https://amazon.com.br/..." />
          </div>

          <div className="field span-2">
            <label>Mercado Livre</label>
            <input type="url" value={form.links.mercadoLivre} onChange={(e) => setLink('mercadoLivre', e.target.value)} placeholder="https://mercadolivre.com.br/..." />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button secondary" onClick={() => navigate('/produtos')}>Cancelar</button>
          <button type="submit" className="button primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar produto'}</button>
        </div>
      </form>
    </section>
  );
}
