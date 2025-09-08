import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Manager() {
  const { token } = useAuth()
  const [kpis, setKpis] = useState(null)
  const [summary, setSummary] = useState({ low_stock: [], last_movements: [] })
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('7d') // today|7d|30d|custom
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')

  const queryParams = useMemo(() => {
    let f = from, t = to
    const now = new Date()
    if (range !== 'custom') {
      const end = new Date(now)
      const start = new Date(now)
      if (range === 'today') {
        // midnight to now
        start.setHours(0,0,0,0)
      } else if (range === '7d') {
        start.setDate(start.getDate() - 7)
      } else if (range === '30d') {
        start.setDate(start.getDate() - 30)
      }
      f = start.toISOString()
      t = end.toISOString()
    }
    const qp = []
    if (f) qp.push(`from=${encodeURIComponent(f)}`)
    if (t) qp.push(`to=${encodeURIComponent(t)}`)
    const qs = qp.length ? `?${qp.join('&')}` : ''
    return qs
  }, [range, from, to])

  const load = async () => {
    setLoading(true)
    try {
      const [k, s] = await Promise.all([
        api(`/manager/kpis/overview${queryParams}`, { token }),
        api('/manager/inventory/summary', { token }),
      ])
      setKpis(k)
      setSummary(s)
    } catch (e) {}
    finally { setLoading(false) }
  }

  useEffect(()=>{ if (token) load() }, [token, queryParams])

  const onImport = async () => {
    try {
      const parsed = JSON.parse(importText)
      await api('/manager/import', { method: 'POST', token, body: parsed })
      setShowImport(false)
      setImportText('')
      load()
    } catch (e) {
      alert('JSON inválido o error al importar')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Panel del gerente</h1>
      {loading && <div>Cargando...</div>}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Stock Bodega</div>
            <div className="text-2xl font-bold">{kpis.stock_bodega_total}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Stock Surtido</div>
            <div className="text-2xl font-bold">{kpis.stock_surtido_total}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Ventas (rango)</div>
            <div className="text-2xl font-bold">{kpis.ventas_total}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Devoluciones (rango)</div>
            <div className="text-2xl font-bold">{kpis.devoluciones_total}</div>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Rango</label>
          <select className="border rounded px-2 py-1" value={range} onChange={e=>setRange(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        {range === 'custom' && (
          <>
            <div>
              <label className="block text-sm mb-1">Desde</label>
              <input type="datetime-local" className="border rounded px-2 py-1" value={from} onChange={e=>setFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Hasta</label>
              <input type="datetime-local" className="border rounded px-2 py-1" value={to} onChange={e=>setTo(e.target.value)} />
            </div>
          </>
        )}
        <button onClick={load} className="ml-auto bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded">Aplicar</button>
        <button onClick={()=>setShowImport(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">Importar datos</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Stock bajo</h2>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="py-1 pr-3">Producto</th>
                <th className="py-1 pr-3">Área</th>
                <th className="py-1">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {summary.low_stock.length === 0 && (
                <tr><td className="py-2 text-gray-500" colSpan={3}>Sin alertas</td></tr>
              )}
              {summary.low_stock.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-3">{r.name}</td>
                  <td className="py-2 pr-3">{r.area}</td>
                  <td className="py-2">{r.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Últimos movimientos</h2>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="py-1 pr-3">Fecha</th>
                <th className="py-1 pr-3">Producto</th>
                <th className="py-1 pr-3">Área</th>
                <th className="py-1 pr-3">Tipo</th>
                <th className="py-1">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {summary.last_movements.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-3">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-3">{m.name}</td>
                  <td className="py-2 pr-3">{m.area}</td>
                  <td className="py-2 pr-3">{m.type}</td>
                  <td className="py-2">{m.quantity}</td>
                </tr>
              ))}
              {summary.last_movements.length === 0 && (
                <tr><td className="py-2 text-gray-500" colSpan={5}>Sin movimientos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Importar JSON</h3>
            <p className="text-sm text-gray-600 mb-2">Pega un objeto con claves products, inventory_stock e inventory_movements.</p>
            <textarea aria-label="Editor JSON" className="w-full h-60 border rounded p-2 font-mono text-sm" value={importText} onChange={e=>setImportText(e.target.value)} placeholder='{"products":[], "inventory_stock":[], "inventory_movements":[]}' />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={()=>setShowImport(false)} className="px-3 py-2 rounded border">Cancelar</button>
              <button onClick={onImport} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Importar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
