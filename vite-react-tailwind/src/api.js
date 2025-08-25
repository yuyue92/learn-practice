const API_BASE = '/api'

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`)
  return res.json()
}

export async function createUser(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteUser(id) {
  return fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
}

// 同样写 Orders API
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`)
  return res.json()
}

export async function createOrder(data) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function updateOrder(id, data) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteOrder(id) {
  return fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' })
}
