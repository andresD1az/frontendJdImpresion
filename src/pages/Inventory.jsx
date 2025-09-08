import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function Inventory() {
  const { token, user } = useAuth()
  const [q, setQ] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ sku:'', name:'', category:'', unit:'', purchase_price:'', margin_percent:'', discount_percent:'' })
  const [editingId, setEditingId] = useState('')
  const [editDraft, setEditDraft] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [opMsg, setOpMsg] = useState('')
  const [opErr, setOpErr] = useState('')
  const [listError, setListError] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyRows, setHistoryRows] = useState([])
  const [historyTitle, setHistoryTitle] = useState('')

  const fmtCOP = (n) => {
    const num = Number(n||0)
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
  }
  const fmtDate = (s) => {
    if (!s) return ''
    try { return new Date(s).toLocaleString('es-CO') } catch { return String(s) }
  }

  const handleStockChange = (field, rawVal) => {
    if (!editDraft) return
    let v = Number(rawVal)
    if (!Number.isFinite(v)) v = 0
    let b = Number(editDraft.stock_bodega||0)
    let s = Number(editDraft.stock_surtido||0)
    let total = Number(editDraft.original_total||0)

    // Negative value means reduce total by its magnitude; value itself becomes 0 in that area
    if (field === 'stock_bodega') {
      if (v < 0) {
        const newTotal = Math.max(0, total + v) // v is negative
        b = 0
        s = Math.max(0, newTotal - b)
        total = newTotal
      } else {
        b = v
        const newS = Math.max(0, total - b)
        s = newS
      }
    } else { // stock_surtido
      if (v < 0) {
        const newTotal = Math.max(0, total + v)
        s = 0
        b = Math.max(0, newTotal - s)
        total = newTotal
      } else {
        s = v
        const newB = Math.max(0, total - s)
        b = newB
      }
    }

    // If both are explicitly set to 0, clear total to 0
    if (v === 0 && ((field==='stock_bodega' && s===0) || (field==='stock_surtido' && b===0))) {
      total = 0
      b = 0
      s = 0
    }

    setEditDraft(d => ({ ...d, stock_bodega: b, stock_surtido: s, original_total: total }))
  }

  const netFrom = (purchase, margin, discount) => {
    const m = 1 + (Number(margin||0)/100)
    const d = 1 - (Number(discount||0)/100)
    return Number(purchase||0) * m * d
  }

  const round1000 = (n) => {
    const base = 1000
    return Math.round(Number(n||0) / base) * base
  }

  const load = async () => {
    setLoading(true)
    setListError('')
    try {
      const res = await api(`/manager/products${q?`?q=${encodeURIComponent(q)}`:''}`, { token })
      setList(res.products || [])
    } catch(e) { setListError('No se pudo cargar productos') }
    finally { setLoading(false) }
  }

  useEffect(()=>{ if (token) load() }, [token])

  const save = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api('/manager/products', { method:'POST', token, body: {
        ...form,
        purchase_price: Number(form.purchase_price)||0,
        margin_percent: Number(form.margin_percent)||0,
        discount_percent: Number(form.discount_percent)||0,
        sale_price_cop: form.sale_price_cop !== '' && form.sale_price_cop !== undefined ? Number(form.sale_price_cop)||0 : undefined,
      } })
      setForm({ sku:'', name:'', category:'', unit:'', purchase_price:'', margin_percent:'', discount_percent:'', sale_price_cop:'' })
      setMsg('Producto guardado')
      load()
    } catch (e) { setError('No se pudo guardar') }
  }

  const update = async (id, patch) => {
    await api(`/manager/products/${id}`, { method:'PATCH', token, body: patch })
    load()
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditDraft({
      name: p.name || '',
      category: p.category || '',
      unit: p.unit || '',
      purchase_price: Number(p.purchase_price||0),
      margin_percent: Number(p.margin_percent||0),
      discount_percent: Number(p.discount_percent||0),
      sale_price_cop: Number(p.sale_price_cop||0),
      price_locked: !!p.price_locked,
      stock_bodega: Number(p.stock_bodega||0),
      stock_surtido: Number(p.stock_surtido||0),
      original_total: Number(p.stock_total||0),
    })
  }

  const saveEdit = async (id) => {
    if (!editDraft) return
    await update(id, {
      name: editDraft.name,
      category: editDraft.category,
      unit: editDraft.unit,
      purchase_price: Number(editDraft.purchase_price)||0,
      margin_percent: Number(editDraft.margin_percent)||0,
      discount_percent: Number(editDraft.discount_percent)||0,
      sale_price_cop: Number(editDraft.sale_price_cop)||0,
      price_locked: editDraft.price_locked,
    })
    // Aplicar ajustes de stock (ajuste fija valor exacto)
    const prod = list.find(x=>x.id===id)
    if (prod) {
      const desiredB = Number(editDraft.stock_bodega)
      const desiredS = Number(editDraft.stock_surtido)
      if (Number.isFinite(desiredB) && desiredB !== Number(prod.stock_bodega||0)) {
        await api('/manager/inventory/movement', { method:'POST', token, body: { sku: prod.sku, area: 'bodega', type: 'ajuste', quantity: desiredB, reason: 'inventory_edit_set' } })
      }
      if (Number.isFinite(desiredS) && desiredS !== Number(prod.stock_surtido||0)) {
        await api('/manager/inventory/movement', { method:'POST', token, body: { sku: prod.sku, area: 'surtido', type: 'ajuste', quantity: desiredS, reason: 'inventory_edit_set' } })
      }
    }
    setEditingId('')
    setEditDraft(null)
  }

  const cancelEdit = () => { setEditingId(''); setEditDraft(null) }

  const removeItem = async (id) => {
    if (!confirm('¿Eliminar producto?')) return
    await api(`/manager/products/${id}`, { method:'DELETE', token })
    load()
  }

  const getAreaStock = (p, area) => area==='bodega' ? Number(p.stock_bodega||0) : Number(p.stock_surtido||0)

  const openHistory = async (p) => {
    try {
      setHistoryTitle(`${p.sku} · ${p.name||''}`)
      const res = await api(`/manager/products/${p.id}/price-history`, { token })
      setHistoryRows(res?.history || [])
      setHistoryOpen(true)
    } catch (e) {
      alert('No se pudo cargar el historial de precios')
    }
  }

  const applyTotalDelta = async (p) => {
    if (!editDraft) return
    const delta = Number(editDraft.totalDelta)
    if (!delta || delta === 0 || !Number.isFinite(delta)) return alert('Cantidad inválida')
    // Operamos sobre bodega por requerimiento
    const bodegaStock = Number(editDraft.stock_bodega || 0)
    if (delta < 0 && Math.abs(delta) > bodegaStock) {
      const ok = confirm(`Vas a restar ${Math.abs(delta)} de bodega pero solo hay ${bodegaStock}. ¿Continuar?`)
      if (!ok) return
    }
    try {
      // Ejecutar movimiento en backend
      await api('/manager/inventory/movement', { method:'POST', token, body: {
        sku: p.sku,
        area: 'bodega',
        type: delta > 0 ? 'ingreso' : 'salida',
        quantity: Math.abs(delta),
        reason: 'inventory_total_delta'
      }})
      // Refrescar draft y limpiar delta
      setEditDraft(d=>({
        ...d,
        totalDelta: '',
        stock_bodega: Number(d.stock_bodega||0) + delta,
        original_total: Number(d.original_total|| (Number(d.stock_bodega||0)+Number(d.stock_surtido||0))) + delta,
      }))
      setOpMsg(`Total ${delta>0?'+':''}${delta} aplicado en bodega para ${p.sku}.`)
      setOpErr('')
      load()
    } catch (e) {
      const detail = (e && (e.message || e.error || e.statusText)) || 'No se pudo aplicar el cambio de total'
      setOpErr(detail)
      alert(detail)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Inventario (Productos)</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={save}>
          <input className="border rounded px-3 py-2" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Categoría" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Unidad" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Compra" type="number" min="0" value={form.purchase_price} onChange={e=>setForm({...form, purchase_price:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Ganancia %" type="number" min="0" value={form.margin_percent} onChange={e=>setForm({...form, margin_percent:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Descuento %" type="number" min="0" value={form.discount_percent} onChange={e=>setForm({...form, discount_percent:e.target.value})} />
          <div className="flex items-center gap-2">
            <input className="border rounded px-3 py-2 w-full" placeholder="Venta (COP) opcional" type="number" min="0" value={form.sale_price_cop||''} onChange={e=>setForm({...form, sale_price_cop:e.target.value})} />
            <button type="button" className="border rounded px-2 py-1 text-sm" onClick={()=>{
              const net = netFrom(form.purchase_price, form.margin_percent, form.discount_percent)
              setForm(f=>({ ...f, sale_price_cop: round1000(net) }))
            }}>Recalcular</button>
          </div>
          <div className="md:col-span-4 flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">Guardar</button>
            {msg && <span className="text-green-700">{msg}</span>}
            {error && <span className="text-red-600">{error}</span>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded shadow p-4">
        {(opMsg||opErr) && (
          <div className={`mb-2 px-3 py-2 rounded ${opErr?'bg-red-50 text-red-700 border border-red-200':'bg-green-50 text-green-700 border border-green-200'}`}>
            {opErr || opMsg}
          </div>
        )}
        <div className="flex gap-2 mb-3">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Buscar por SKU o nombre" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="border rounded px-3 py-2" onClick={load}>Buscar</button>
          <button className="border rounded px-3 py-2" onClick={async()=>{ await api('/manager/products/populate-from-movements', { method:'POST', token }); load() }}>Poblar desde movimientos</button>
        </div>
        {listError && <div className="mb-2 text-red-600">{listError}</div>}
        {loading ? 'Cargando...' : (
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-1 pr-3">SKU</th>
                  <th className="py-1 pr-3">Nombre</th>
                  <th className="py-1 pr-3">Categoría</th>
                  <th className="py-1 pr-3">Unidad</th>
                  <th className="py-1 pr-3">Compra</th>
                  <th className="py-1 pr-3">Ganancia %</th>
                  <th className="py-1 pr-3">Descuento %</th>
                  <th className="py-1 pr-3">Neto (auto)</th>
                  <th className="py-1 pr-3">Venta (COP)</th>
                  <th className="py-1 pr-3">Cant. bodega</th>
                  <th className="py-1 pr-3">Cant. surtido</th>
                  <th className="py-1 pr-3">Cant. total</th>
                  <th className="py-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2 pr-3">{p.sku}</td>
                    <td className="py-2 pr-3">
                      {editingId===p.id ? (
                        <input className="border rounded px-2 py-1" value={editDraft?.name||''} onChange={e=>setEditDraft({...editDraft, name:e.target.value})} />
                      ) : p.name}
                    </td>
                    <td className="py-2 pr-3">
                      {editingId===p.id ? (
                        <input className="border rounded px-2 py-1" value={editDraft?.category||''} onChange={e=>setEditDraft({...editDraft, category:e.target.value})} />
                      ) : (p.category||'-')}
                    </td>
                    <td className="py-2 pr-3">
                      {editingId===p.id ? (
                        <input className="border rounded px-2 py-1" value={editDraft?.unit||''} onChange={e=>setEditDraft({...editDraft, unit:e.target.value})} />
                      ) : (p.unit||'-')}
                    </td>
                    <td className="py-2 pr-3">{editingId===p.id ? (
                        <input className="border rounded px-2 py-1" type="number" value={editDraft?.purchase_price??0} onChange={e=>setEditDraft({...editDraft, purchase_price:e.target.value})} />
                      ) : fmtCOP(p.purchase_price) }
                    </td>
                    <td className="py-2 pr-3">{editingId===p.id ? (
                        <input className="border rounded px-2 py-1" type="number" value={editDraft?.margin_percent??0} onChange={e=>setEditDraft({...editDraft, margin_percent:e.target.value})} />
                      ) : (Number(p.margin_percent||0).toFixed(2))}
                    </td>
                    <td className="py-2 pr-3">{editingId===p.id ? (
                        <input className="border rounded px-2 py-1" type="number" value={editDraft?.discount_percent??0} onChange={e=>setEditDraft({...editDraft, discount_percent:e.target.value})} />
                      ) : (Number(p.discount_percent||0).toFixed(2))}
                    </td>
                    {(()=>{ const net = netFrom(editingId===p.id?editDraft?.purchase_price:p.purchase_price, editingId===p.id?editDraft?.margin_percent:p.margin_percent, editingId===p.id?editDraft?.discount_percent:p.discount_percent); return (
                      <td className="py-2 pr-3"><span title="Calculado automáticamente">{fmtCOP(net)}</span><span className="ml-1 text-xs text-gray-500">auto</span></td>
                    ) })()}
                    <td className="py-2 pr-3">
                      {editingId===p.id ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <input className="border rounded px-2 py-1 w-32" type="number" value={editDraft?.sale_price_cop??0} onChange={e=>setEditDraft({...editDraft, sale_price_cop:e.target.value})} />
                          <button className="border rounded px-2 py-1 text-sm" title="Redondear al múltiplo de 1.000" onClick={()=>{
                            const net = netFrom(editDraft?.purchase_price, editDraft?.margin_percent, editDraft?.discount_percent)
                            setEditDraft(d=>({ ...d, sale_price_cop: round1000(net) }))
                          }}>Recalcular</button>
                          {String(user?.role||'').toLowerCase()==='manager' && (
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={!!editDraft?.price_locked} onChange={e=>setEditDraft(d=>({ ...d, price_locked: e.target.checked }))} />
                              <span>Bloquear precio (solo gerente)</span>
                            </label>
                          )}
                        </div>
                      ) : fmtCOP(p.sale_price_cop) }
                    </td>
                    <td className="py-2 pr-3">
                      {editingId===p.id ? (
                        <input className="border rounded px-2 py-1 w-24" type="number" value={editDraft?.stock_bodega??0} onChange={e=>handleStockChange('stock_bodega', e.target.value)} />
                      ) : fmtCOP(p.stock_bodega)}
                    </td>
                    <td className="py-2 pr-3">
                      {editingId===p.id ? (
                        <input className="border rounded px-2 py-1 w-24" type="number" value={editDraft?.stock_surtido??0} onChange={e=>handleStockChange('stock_surtido', e.target.value)} />
                      ) : fmtCOP(p.stock_surtido)}
                    </td>
                    <td className="py-2 pr-3">
                      <div>{fmtCOP(editingId===p.id ? Number(editDraft?.stock_bodega||0)+Number(editDraft?.stock_surtido||0) : p.stock_total)}</div>
                      {editingId===p.id && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-700">
                          <input className="border rounded px-2 py-1 w-24" type="number" placeholder="± total (bodega)" value={editDraft?.totalDelta||''} onChange={e=>setEditDraft({...editDraft, totalDelta:e.target.value})} />
                          <button
                            type="button"
                            className="border rounded px-2 py-1 disabled:opacity-50"
                            disabled={!Number(editDraft?.totalDelta)||Number(editDraft?.totalDelta)===0}
                            onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); applyTotalDelta(p) }}
                          >Aplicar</button>
                        </div>
                      )}
                    </td>
                    <td className="py-2">
                      {editingId===p.id ? (
                        <>
                          <button className="text-green-700 mr-2" onClick={()=>saveEdit(p.id)}>Guardar</button>
                          <button className="text-gray-600 mr-2" onClick={cancelEdit}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className="text-blue-700 mr-2" onClick={()=>startEdit(p)}>Editar</button>
                          {String(user?.role||'').toLowerCase()==='manager' && (
                            <button className="text-gray-700 mr-2" onClick={()=>openHistory(p)}>Historial</button>
                          )}
                        </>
                      )}
                      <button className="text-red-700" onClick={()=>removeItem(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {list.length===0 && (<tr><td className="py-2 text-gray-500" colSpan={12}>Sin resultados</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        {historyOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded shadow-xl max-w-3xl w-full mx-4">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Historial de precio · {historyTitle}</h3>
                <button className="text-sm" onClick={()=>{ setHistoryOpen(false); setHistoryRows([]) }}>Cerrar</button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-auto">
                {historyRows.length===0 ? (
                  <div className="text-gray-500">Sin cambios registrados</div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-1 pr-3">Fecha</th>
                        <th className="py-1 pr-3">Usuario</th>
                        <th className="py-1 pr-3">De</th>
                        <th className="py-1 pr-3">A</th>
                        <th className="py-1">Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyRows.map((h)=> (
                        <tr key={h.id} className="border-t">
                          <td className="py-2 pr-3">{fmtDate(h.created_at)}</td>
                          <td className="py-2 pr-3">{h.user_id ?? '-'}</td>
                          <td className="py-2 pr-3">{fmtCOP(h.old_price)}</td>
                          <td className="py-2 pr-3">{fmtCOP(h.new_price)}</td>
                          <td className="py-2">{h.reason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-4 border-t text-right">
                <button className="border rounded px-3 py-2" onClick={()=>{ setHistoryOpen(false); setHistoryRows([]) }}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
