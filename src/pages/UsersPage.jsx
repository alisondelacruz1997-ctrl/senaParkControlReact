import React, { useEffect, useState } from 'react'
import api from '../services/api'


export default function UsersPage(){
const [users, setUsers] = useState([])
const [error, setError] = useState(null)


useEffect(()=>{ load() }, [])
async function load(){
try{
const data = await api.request('/users', { method: 'GET' })
setUsers(data)
}catch(err){ setError(err.message) }
}


async function remove(id){
if(!confirm('Eliminar usuario?')) return
try{ await api.request('/users/' + id, { method: 'DELETE' }); setUsers(users.filter(u=>u.IdUsuario !== id)) }
catch(err){ alert(err.message) }
}


return (
<div className="container">
<h1>Usuarios</h1>
{error && <div className="error">{error}</div>}
<table className="table">
<thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
<tbody>
{users.map(u=> (
<tr key={u.IdUsuario}>
<td>{u.IdUsuario}</td>
<td>{u.NombreCompleto}</td>
<td>{u.Correo}</td>
<td>{u.NombreRol}</td>
<td><button className="btn small" onClick={()=>remove(u.IdUsuario)}>Eliminar</button></td>
</tr>
))}
</tbody>
</table>
</div>
)
}