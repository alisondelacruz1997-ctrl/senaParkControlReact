import React, { useState } from 'react'
import api from '../services/api'


export default function ReportesPage(){
const [start, setStart] = useState(new Date().toISOString().slice(0,10))
const [end, setEnd] = useState(new Date().toISOString().slice(0,10))
const [tipo, setTipo] = useState('todos')
const [data, setData] = useState([])


async function generate(){
try{
const res = await api.request(`/reportes?fechaInicio=${start}&fechaFin=${end}&tipoVehiculo=${tipo}`, { method: 'GET' })
setData(res)
}catch(err){ alert(err.message) }
}


return (
<div className="container">
<h1>Reportes</h1>
<div className="card form-inline">
<label>Desde</label><input type="date" value={start} onChange={e=>setStart(e.target.value)} />
<label>Hasta</label><input type="date" value={end} onChange={e=>setEnd(e.target.value)} />
<select value={tipo} onChange={e=>setTipo(e.target.value)}>
<option value="todos">Todos</option>
<option value="carro">Carro</option>
<option value="moto">Moto</option>
<option value="bicicleta">Bicicleta</option>
</select>
<button className="btn" onClick={generate}>Generar</button>
</div>


<table className="table">
<thead><tr><th>Fecha</th><th>Tipo</th><th>Total</th></tr></thead>
<tbody>
{data.map((row, i) => (
<tr key={i}><td>{row.fecha}</td><td>{row.Tipo}</td><td>{row.total}</td></tr>
))}
</tbody>
</table>
</div>
)
}