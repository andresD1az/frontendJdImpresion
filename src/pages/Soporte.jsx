import React from 'react'

export default function Soporte() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Panel Soporte</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">Bandeja devoluciones (placeholder)</div>
        <div className="bg-white rounded shadow p-4">Detalle de solicitud (placeholder)</div>
        <div className="bg-white rounded shadow p-4">Notificaciones a clientes (placeholder)</div>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">Reportes de devolución (placeholder)</div>
        <div className="bg-white rounded shadow p-4">SLA / Tiempos de respuesta (placeholder)</div>
      </div>
    </div>
  )
}
