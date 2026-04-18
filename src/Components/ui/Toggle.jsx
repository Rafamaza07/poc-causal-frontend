export default function Toggle({ checked, onChange, label, disabled = false, size = 'md' }) {
  const track = size === 'sm'
    ? 'w-8 h-4'
    : 'w-11 h-6'
  const thumb = size === 'sm'
    ? 'w-3 h-3 translate-x-0.5 peer-checked:translate-x-4'
    : 'w-5 h-5 translate-x-0.5 peer-checked:translate-x-5'

  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`${track} rounded-full bg-gray-200 peer-checked:bg-brand-600 transition-colors duration-200`} />
        <div className={`absolute top-0.5 left-0 ${thumb} rounded-full bg-white shadow-sm transition-transform duration-200`} />
      </div>
      {label && <span className="text-sm text-gray-700 select-none">{label}</span>}
    </label>
  )
}
