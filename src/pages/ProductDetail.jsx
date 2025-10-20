import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function ProductDetail() {
  const { sku } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    (async () => {
      setLoading(true); setErr('')
      try {
        const res = await api(`/store/product/${encodeURIComponent(sku)}`)
        setProduct(res?.product || null)
        try {
          const rel = await api(`/store/related?sku=${encodeURIComponent(sku)}`)
          setRelated(rel?.products || [])
        } catch {}
      } catch {
        setErr('No se pudo cargar el producto')
      } finally { setLoading(false) }
    })()
  }, [sku])

  const p = product

  const addToCart = () => {
    if (!p?.sku) return
    const key = 'cart'
    const raw = localStorage.getItem(key)
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex(x=>x.sku===p.sku)
    const qn = Math.max(1, Number(qty)||1)
    if (idx>=0) cart[idx].quantity = Number(cart[idx].quantity||0) + qn
    else cart.push({ sku: p.sku, quantity: qn })
    localStorage.setItem(key, JSON.stringify(cart))
    navigate('/carrito')
  }

  if (loading) return <div className="max-w-5xl mx-auto">Cargando...</div>
  if (err) return <div className="max-w-5xl mx-auto text-red-600">{err}</div>
  if (!p) return <div className="max-w-5xl mx-auto text-gray-600">Producto no encontrado</div>

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <nav className="text-sm text-gray-600 mb-4">
        <a className="hover:underline" href="/tienda">Tienda</a>
        <span className="mx-2">/</span>
        <span>{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          <div className="text-sm text-gray-600 mt-1">{p.brand || 'Marca'} · {p.category || '-'}</div>
          <div className="mt-4 text-3xl font-bold">${Number(p.price||0).toLocaleString('es-CO')} <span className="text-base text-gray-500">IVA incl.</span></div>
          <div className="mt-2 text-sm">
            <span className={`inline-block text-xs px-2 py-1 rounded ${p.available? 'bg-green-100 text-green-700':'bg-gray-200 text-gray-700'}`}>
              {p.available? 'Disponible':'Agotado'}
            </span>
          </div>
          <div className="mt-6 text-gray-700">
            <div className="font-semibold mb-1">Descripción</div>
            <p className="text-sm leading-6 bg-gray-50 border rounded p-3">{p.description || 'Sin descripción'}</p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <label className="text-sm text-gray-700">Cantidad</label>
            <div className="flex items-center border rounded overflow-hidden">
              <button className="px-3 py-2" onClick={()=>setQty(q=>Math.max(1,(Number(q)||1)-1))}>-</button>
              <input className="w-16 text-center outline-none" type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} />
              <button className="px-3 py-2" onClick={()=>setQty(q=>Math.max(1,(Number(q)||1)+1))}>+</button>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50" onClick={addToCart} disabled={!p.available}>
              {p.available ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Productos relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.filter(x=>x.id!==p.id).slice(0,4).map(r => (
            <a key={r.id} href={`/producto/${r.sku}`} className="bg-white rounded-xl border overflow-hidden hover:shadow transition block">
              <div className="aspect-[4/3] bg-gray-100">
                {r.image_url ? (
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500">{r.brand||'Marca'}</div>
                <div className="text-sm font-medium line-clamp-2">{r.name}</div>
                <div className="mt-1 text-sm font-semibold">${Number(r.price||0).toLocaleString('es-CO')}</div>
              </div>
            </a>
          ))}
          {related.filter(x=>x.id!==p.id).length===0 && (
            <div className="text-gray-600">No hay relacionados</div>
          )}
        </div>
      </section>
    </div>
  )
}
