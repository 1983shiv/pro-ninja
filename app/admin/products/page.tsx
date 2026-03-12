'use client';

import { useState, useEffect } from 'react';
import { Package, Loader2, Edit, Check, X } from 'lucide-react';
import { getAdminProducts, updateProduct } from '@/actions/admin';

interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  tierType: string;
  price: number;
  currency: string;
  reviewLimit: number;
  siteLimit: number;
  isActive: boolean;
  isFeatured: boolean;
  version: string;
}

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, string> = {
    FREE:    'bg-slate-100 text-slate-600',
    STARTER: 'bg-blue-100 text-blue-700',
    GROWTH:  'bg-purple-100 text-purple-700',
    AGENCY:  'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${map[tier] ?? 'bg-slate-100 text-slate-600'}`}>
      {tier}
    </span>
  );
}

interface EditingState {
  id: string;
  name: string;
  price: string;
  reviewLimit: string;
  siteLimit: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await getAdminProducts();
      if ('error' in res) throw new Error(res.error);
      setProducts(res.products ?? []);
    } catch {
      const r = await fetch('/api/products');
      if (r.ok) {
        const data = await r.json();
        setProducts(data.products ?? data ?? []);
      }
    }
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  function startEdit(p: ProductRow) {
    setEditing({
      id: p._id,
      name: p.name,
      price: String(p.price),
      reviewLimit: String(p.reviewLimit),
      siteLimit: String(p.siteLimit),
    });
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    const fields = {
      name: editing.name,
      price: Number(editing.price),
      reviewLimit: Number(editing.reviewLimit),
      siteLimit: Number(editing.siteLimit),
    };
    const res = await updateProduct(editing.id, fields);
    if ('error' in res) {
      await fetch(`/api/admin/products/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
    }
    setEditing(null);
    setSaving(false);
    loadProducts();
  }

  async function toggleActive(product: ProductRow) {
    const fields = { isActive: !product.isActive };
    const res = await updateProduct(product._id, fields);
    if ('error' in res) {
      await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
    }
    loadProducts();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Edit plan pricing, review limits, and feature flags.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map((p) => {
              const isEditingThis = editing?.id === p._id;
              return (
                <div key={p._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {isEditingThis ? (
                        <input
                          className="text-base font-bold text-slate-900 border-b border-indigo-400 outline-none bg-transparent w-full"
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        />
                      ) : (
                        <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <TierBadge tier={p.tierType} />
                        <span className="text-xs text-slate-400">v{p.version}</span>
                        <span className={`text-xs font-medium ${p.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isEditingThis ? (
                        <>
                          <button onClick={saveEdit} disabled={saving} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Price</p>
                      {isEditingThis ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">{p.currency}</span>
                          <input
                            type="number"
                            className="w-full text-sm font-bold text-slate-900 bg-transparent outline-none border-b border-indigo-400"
                            value={editing.price}
                            onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-slate-900">{p.currency} {p.price}</p>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Reviews/mo</p>
                      {isEditingThis ? (
                        <input
                          type="number"
                          className="w-full text-sm font-bold text-slate-900 bg-transparent outline-none border-b border-indigo-400"
                          value={editing.reviewLimit}
                          onChange={(e) => setEditing({ ...editing, reviewLimit: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-900">{p.reviewLimit === 0 ? '∞' : p.reviewLimit.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Sites</p>
                      {isEditingThis ? (
                        <input
                          type="number"
                          className="w-full text-sm font-bold text-slate-900 bg-transparent outline-none border-b border-indigo-400"
                          value={editing.siteLimit}
                          onChange={(e) => setEditing({ ...editing, siteLimit: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-900">{p.siteLimit}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Slug: <code className="text-slate-600">{p.slug}</code></span>
                    <button
                      onClick={() => toggleActive(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${p.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
