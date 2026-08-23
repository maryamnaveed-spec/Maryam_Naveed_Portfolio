'use client';

import { useEffect, useState } from 'react';
import { supabase, ProductCategoryItem, ProductItem } from '@/lib/supabase';
import { formatPKR } from '@/lib/currency';

export default function AdminProducts() {
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState('');
  const [catStatus, setCatStatus] = useState('');

  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category_id: '' });

  async function load() {
    setLoading(true);
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('product_categories').select('*').order('created_at', { ascending: true }),
      supabase.from('products').select('*').order('created_at', { ascending: false })
    ]);
    setCategories(cats ?? []);
    setProducts(prods ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const { error } = await supabase.from('product_categories').insert({ name: newCategory.trim() });
    if (error) {
      setCatStatus(error.message);
      return;
    }
    setNewCategory('');
    setCatStatus('');
    load();
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Products in it will become "Other".')) return;
    await supabase.from('product_categories').delete().eq('id', id);
    load();
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) return setStatus('Please choose a product photo.');
    const priceNum = Number(form.price);
    if (!form.name.trim()) return setStatus('Please enter a product name.');
    if (isNaN(priceNum) || priceNum < 0) return setStatus('Please enter a valid price.');

    try {
      setStatus('Uploading photo...');
      const path = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile);
      if (uploadError) throw new Error(uploadError.message);
      const imageUrl = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;

      const { error: insertError } = await supabase.from('products').insert({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: priceNum,
        category_id: form.category_id || null,
        image_url: imageUrl
      });
      if (insertError) throw new Error(insertError.message);

      setStatus('Product added.');
      setForm({ name: '', description: '', price: '', category_id: '' });
      setImageFile(null);
      load();
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong.');
    }
  }

  function startEdit(p: ProductItem) {
    setEditingId(p.id);
    setEditForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      category_id: p.category_id ?? ''
    });
  }

  async function saveEdit(id: string) {
    const priceNum = Number(editForm.price);
    if (isNaN(priceNum) || priceNum < 0) return;
    await supabase
      .from('products')
      .update({
        name: editForm.name,
        description: editForm.description || null,
        price: priceNum,
        category_id: editForm.category_id || null
      })
      .eq('id', id);
    setEditingId(null);
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 items-start">
      {/* Categories */}
      <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
        <h3 className="text-lg mb-4">Product categories</h3>
        <form onSubmit={addCategory} className="flex gap-2 mb-4">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Paintings, Prints, Bookmarks"
            className="flex-1 border border-borderpink rounded-lg px-3 py-2 text-sm"
          />
          <button className="text-sm font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 flex-shrink-0">
            Add
          </button>
        </form>
        {catStatus && <p className="text-xs text-red-500 mb-2">{catStatus}</p>}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 text-xs font-medium bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full"
            >
              {c.name}
              <button onClick={() => deleteCategory(c.id)} className="text-pink-400 hover:text-red-500">
                ×
              </button>
            </span>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-inksoft/60 italic">No categories yet — add one above.</p>
          )}
        </div>
      </div>

      {/* Upload product */}
      <form
        onSubmit={handleUpload}
        className="bg-surface border border-borderpink rounded-card p-6 card-shadow"
      >
        <h3 className="text-lg mb-4">Add new product</h3>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product name"
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
          rows={2}
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price (PKR)"
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="block text-xs font-semibold mb-1.5">Product photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="text-sm mb-3"
        />
        <br />
        <button className="text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
          Add product
        </button>
        {status && <p className="text-xs text-inksoft mt-3">{status}</p>}
      </form>

      {/* Manage products */}
      <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow sm:col-span-2">
        <h3 className="text-lg mb-4">Manage products</h3>
        {loading && <p className="text-sm text-inksoft">Loading...</p>}
        {!loading && products.length === 0 && (
          <p className="text-sm text-inksoft italic">No products yet.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => (
            <div key={p.id} className="border border-borderpink rounded-lg p-3">
              {editingId === p.id ? (
                <div>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                  />
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                  />
                  <select
                    value={editForm.category_id}
                    onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                  >
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink text-inksoft"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-pink-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-pink-600 font-medium">
                      {formatPKR(p.price)}
                    </p>
                    <div className="flex gap-2 mt-1.5">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
