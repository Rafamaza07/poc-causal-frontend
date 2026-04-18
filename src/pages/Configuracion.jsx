import { useState, useEffect, useCallback } from 'react'
import {
  Users, Building2, Bell, UserPlus, Edit, UserX,
  X, Loader2, Save, Info,
} from 'lucide-react'
import API from '../api/client'
import DataTable from '../Components/DataTable'
import StatCard from '../Components/StatCard'
import { useToast } from '../Components/Toast'

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Hace un momento'
  if (m < 60) return `Hace ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  if (d < 30) return `Hace ${d} días`
  return new Date(dateStr).toLocaleDateString('es-CO')
}

const ROL_STYLES = {
  medico:  'bg-blue-100 text-blue-700 border-blue-200',
  empresa: 'bg-green-100 text-green-700 border-green-200',
  legal:   'bg-amber-100 text-amber-700 border-amber-200',
  admin:   'bg-red-100 text-red-700 border-red-200',
}
const ROL_LABELS = {
  medico: 'Médico', empresa: 'Empresa', legal: 'Legal', admin: 'Admin',
}

function RolBadge({ rol }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ROL_STYLES[rol] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {ROL_LABELS[rol] || rol}
    </span>
  )
}

const ROLES = ['medico', 'empresa', 'legal', 'admin']

const MILESTONES = [
  { dias: 90,  label: '90 días — Primera revisión' },
  { dias: 120, label: '120 días — Prórroga EPS' },
  { dias: 180, label: '180 días — Calificación PCL' },
  { dias: 540, label: '540 días — Período máximo' },
]

// ─── Modal wrapper ───────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 pb-5 flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  )
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'usuarios',      label: 'Usuarios',      icon: Users },
  { id: 'organizacion',  label: 'Organización',   icon: Building2 },
  { id: 'alertas',       label: 'Alertas',        icon: Bell },
]

// ─── Tab: Usuarios ───────────────────────────────────────────────────────────

function TabUsuarios({ tenantId, tenantNombre }) {
  const toast = useToast()
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)   // user object
  const [modalDel, setModalDel]   = useState(null)   // user object
  const [saving, setSaving]     = useState(false)

  const EMPTY_FORM = { nombre: '', email: '', username: '', password: '', rol: 'medico' }
  const [form, setForm] = useState(EMPTY_FORM)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await API.get(`/api/v1/tenants/${tenantId}/users`)
      setUsers(Array.isArray(data) ? data : data.users ?? [])
    } catch {
      toast('No se pudieron cargar los usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => { loadUsers() }, [loadUsers])

  const openAdd = () => { setForm(EMPTY_FORM); setModalAdd(true) }
  const openEdit = (u) => { setForm({ nombre: u.nombre, email: u.email, username: u.username, password: '', rol: u.rol, activo: u.activo }); setModalEdit(u) }

  const handleAdd = async () => {
    if (!form.nombre || !form.email || !form.username || !form.password) {
      toast('Completa todos los campos', 'warning'); return
    }
    setSaving(true)
    try {
      await API.post(`/api/v1/tenants/${tenantId}/users`, form)
      toast('Usuario creado', 'success')
      setModalAdd(false)
      loadUsers()
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al crear usuario', 'error')
    } finally { setSaving(false) }
  }

  const handleEdit = async () => {
    setSaving(true)
    try {
      const payload = { rol: form.rol, activo: form.activo }
      if (form.password) payload.password = form.password
      await API.put(`/api/v1/users/${modalEdit.id}`, payload)
      toast('Usuario actualizado', 'success')
      setModalEdit(null)
      loadUsers()
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al actualizar', 'error')
    } finally { setSaving(false) }
  }

  const handleDeactivate = async () => {
    setSaving(true)
    try {
      await API.put(`/api/v1/users/${modalDel.id}`, { activo: false })
      toast('Usuario desactivado', 'success')
      setModalDel(null)
      loadUsers()
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al desactivar', 'error')
    } finally { setSaving(false) }
  }

  const columns = [
    { key: 'nombre',         label: 'Nombre' },
    { key: 'email',          label: 'Email', cellClassName: 'text-gray-500' },
    { key: 'rol',            label: 'Rol',    sortable: false,
      render: (v) => <RolBadge rol={v} /> },
    { key: 'activo',         label: 'Estado', sortable: false,
      render: (v) => v
        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Activo</span>
        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Inactivo</span>
    },
    { key: 'ultimo_acceso',  label: 'Último acceso', render: (v) => <span className="text-gray-500 text-xs">{timeAgo(v)}</span> },
    { key: '_actions',       label: '', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={e => { e.stopPropagation(); openEdit(row) }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
            title="Editar"
          ><Edit className="w-3.5 h-3.5" /></button>
          <button
            onClick={e => { e.stopPropagation(); setModalDel(row) }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Desactivar"
          ><UserX className="w-3.5 h-3.5" /></button>
        </div>
      )
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Usuarios de <span className="text-brand-600">{tenantNombre}</span>
        </h2>
        <button onClick={openAdd} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Agregar usuario
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            emptyTitle="Sin usuarios"
            emptyDescription="Agrega el primer usuario del tenant"
          />
        )}
      </div>

      {/* Modal — Agregar */}
      <Modal
        open={modalAdd}
        onClose={() => setModalAdd(false)}
        title="Agregar usuario"
        footer={
          <>
            <button onClick={() => setModalAdd(false)} className="btn-secondary px-4 py-2 text-sm">Cancelar</button>
            <button onClick={handleAdd} disabled={saving} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Crear
            </button>
          </>
        }
      >
        <UserForm form={form} setForm={setForm} showPassword />
      </Modal>

      {/* Modal — Editar */}
      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Editar usuario"
        footer={
          <>
            <button onClick={() => setModalEdit(null)} className="btn-secondary px-4 py-2 text-sm">Cancelar</button>
            <button onClick={handleEdit} disabled={saving} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Guardar
            </button>
          </>
        }
      >
        <UserForm form={form} setForm={setForm} showPassword editMode />
      </Modal>

      {/* Modal — Confirmar desactivar */}
      <Modal
        open={!!modalDel}
        onClose={() => setModalDel(null)}
        title="Desactivar usuario"
        footer={
          <>
            <button onClick={() => setModalDel(null)} className="btn-secondary px-4 py-2 text-sm">Cancelar</button>
            <button
              onClick={handleDeactivate}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Desactivar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          ¿Confirmas que deseas desactivar a{' '}
          <span className="font-semibold text-gray-900">{modalDel?.nombre}</span>?
          El usuario no podrá iniciar sesión.
        </p>
      </Modal>
    </div>
  )
}

function UserForm({ form, setForm, showPassword, editMode }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="space-y-4">
      {!editMode && (
        <>
          <Field label="Nombre completo">
            <input className="input" value={form.nombre} onChange={e => f('nombre', e.target.value)} placeholder="Ej. Dra. Ana López" />
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="ana@eps.com" />
          </Field>
          <Field label="Nombre de usuario">
            <input className="input" value={form.username} onChange={e => f('username', e.target.value)} placeholder="ana_lopez" />
          </Field>
        </>
      )}
      {showPassword && (
        <Field label={editMode ? 'Nueva contraseña (opcional)' : 'Contraseña'}>
          <input className="input" type="password" value={form.password} onChange={e => f('password', e.target.value)} placeholder={editMode ? 'Dejar en blanco para no cambiar' : '••••••••'} />
        </Field>
      )}
      <Field label="Rol">
        <select className="input" value={form.rol} onChange={e => f('rol', e.target.value)}>
          {ROLES.map(r => (
            <option key={r} value={r}>{ROL_LABELS[r]}</option>
          ))}
        </select>
      </Field>
      {editMode && (
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={!!form.activo} onChange={e => f('activo', e.target.checked)} />
            <div className={`w-10 h-5 rounded-full transition-colors ${form.activo ? 'bg-brand-600' : 'bg-gray-300'}`} />
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.activo ? 'translate-x-5' : ''}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">Usuario activo</span>
        </label>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ─── Tab: Organización ───────────────────────────────────────────────────────

function TabOrganizacion({ tenantId }) {
  const [info, setInfo]       = useState(null)
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [meRes, statsRes] = await Promise.allSettled([
          API.get('/api/me'),
          API.get('/api/estadisticas'),
        ])
        if (meRes.status === 'fulfilled') setInfo(meRes.value.data)
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    )
  }

  const tenant = info?.tenant || {}
  const rows = [
    { label: 'Nombre',            value: tenant.nombre        || '—' },
    { label: 'NIT',               value: tenant.nit           || '—' },
    { label: 'Plan',              value: tenant.plan          || 'Estándar' },
    { label: 'Fecha de registro', value: tenant.created_at
        ? new Date(tenant.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Datos de la organización</h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {rows.map(({ label, value }) => (
            <div key={label} className="border-b border-gray-50 pb-4 last:border-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            value={stats.total_usuarios ?? '—'}
            label="Total usuarios"
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            value={stats.total_casos ?? stats.total_evaluaciones ?? '—'}
            label="Total casos"
            icon={Building2}
            iconBg="bg-brand-100"
            iconColor="text-brand-600"
          />
          <StatCard
            value={stats.casos_mes ?? stats.evaluaciones_mes ?? '—'}
            label="Casos este mes"
            icon={Bell}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
        </div>
      )}
    </div>
  )
}

// ─── Tab: Alertas ────────────────────────────────────────────────────────────

function TabAlertas({ tenantId }) {
  const toast = useToast()
  const [windows, setWindows]     = useState(Object.fromEntries(MILESTONES.map(m => [m.dias, 15])))
  const [readOnly, setReadOnly]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await API.get(`/api/v1/tenants/${tenantId}/settings`)
        if (data?.alert_windows) {
          setWindows(prev => ({ ...prev, ...data.alert_windows }))
        }
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 405) {
          setReadOnly(true)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await API.put(`/api/v1/tenants/${tenantId}/settings`, { alert_windows: windows })
      toast('Configuración guardada', 'success')
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Ventanas de alerta por milestone</h2>
          <p className="text-sm text-gray-500 mt-0.5">Días de anticipación para alertar antes de cada hito</p>
        </div>
      </div>

      {readOnly && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Configuración por defecto — el endpoint de configuración no está disponible. Contacta al equipo de soporte para personalizar estas ventanas.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {MILESTONES.map(({ dias, label }) => (
          <div key={dias} className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
            <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
            <p className="text-xs text-gray-400 mb-3">Alertar con anticipación:</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={60}
                value={windows[dias]}
                disabled={readOnly}
                onChange={e => setWindows(p => ({ ...p, [dias]: Number(e.target.value) }))}
                className="input w-24 text-center disabled:bg-gray-50 disabled:text-gray-400"
              />
              <span className="text-sm text-gray-500">días antes</span>
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar configuración
        </button>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('usuarios')

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return {} }
  })()

  const tenantId     = storedUser?.tenant?.id     || storedUser?.tenant_id     || ''
  const tenantNombre = storedUser?.tenant?.nombre || storedUser?.tenant_nombre || 'mi organización'

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestiona usuarios, organización y preferencias del sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'usuarios'     && <TabUsuarios     tenantId={tenantId} tenantNombre={tenantNombre} />}
      {activeTab === 'organizacion' && <TabOrganizacion tenantId={tenantId} />}
      {activeTab === 'alertas'      && <TabAlertas      tenantId={tenantId} />}
    </div>
  )
}
