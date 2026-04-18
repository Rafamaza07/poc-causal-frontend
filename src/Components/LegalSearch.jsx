import { useState, useCallback } from 'react'
import { Scale, Search, ChevronDown, ChevronUp, Copy, Check, Loader2 } from 'lucide-react'
import API from '../api/client'
import { useToast } from './Toast'

// ── Keyword highlighter ────────────────────────────────────────────────────────
function highlightKeywords(text, query) {
  if (!query?.trim()) return text
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  if (!words.length) return text
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    words.some(w => part.toLowerCase() === w)
      ? <mark key={i} className="bg-yellow-100 rounded px-0.5 not-italic">{part}</mark>
      : part
  )
}

// ── Single result card ─────────────────────────────────────────────────────────
function LegalCard({ article, query, onSelect }) {
  const [expanded, setExpanded]   = useState(false)
  const [copied,   setCopied]     = useState(false)
  const { showToast }             = useToast()

  const excerpt = article.content.slice(0, 200) + (article.content.length > 200 ? '…' : '')

  const copyText = async () => {
    const text = `${article.source} — ${article.article}\n${article.title}\n\n${article.content}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('Artículo copiado al portapapeles', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('No se pudo copiar', 'error')
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold
              bg-brand-50 text-brand-700 border border-brand-100 flex-shrink-0">
              {article.source}
            </span>
            <span className="text-sm font-semibold text-gray-900">{article.article}</span>
            {article.relevance_score > 0 && (
              <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                relevancia {article.relevance_score}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-gray-600 leading-snug">{article.title}</p>
        </div>
      </div>

      {/* Excerpt */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {highlightKeywords(excerpt, query)}
        </p>
      </div>

      {/* Expanded full content */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-50 pt-3">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {highlightKeywords(article.content, query)}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 pb-3 flex-wrap">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700
            px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-all duration-150 font-medium"
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" />Ocultar</>
            : <><ChevronDown className="w-3.5 h-3.5" />Ver completo</>
          }
        </button>

        <button
          onClick={copyText}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700
            px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-150"
        >
          {copied
            ? <><Check className="w-3.5 h-3.5 text-green-500" />Copiado</>
            : <><Copy className="w-3.5 h-3.5" />Copiar</>
          }
        </button>

        {onSelect && (
          <button
            onClick={() => onSelect(article)}
            className="ml-auto flex items-center gap-1 text-xs font-medium text-white
              bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Usar en chat
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LegalSearch({ onSelect, compact = false, className = '' }) {
  const [query,   setQuery]   = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)   // null = no search yet

  const search = useCallback(async (q) => {
    const trimmed = (q ?? query).trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const { data } = await API.get('/api/v1/legal/buscar', {
        params: { q: trimmed, top_k: 5 },
      })
      setResults(data.resultados ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search()
  }

  return (
    <div className={className}>
      {/* Search input */}
      <div className="relative">
        <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar en normativa colombiana…"
          className={`w-full pl-10 pr-28 py-3 border border-gray-200 rounded-xl text-sm
            bg-white placeholder:text-gray-400 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            transition-all duration-150 ${compact ? 'py-2 text-xs' : ''}`}
        />
        <button
          onClick={() => search()}
          disabled={!query.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2
            h-8 px-3 bg-brand-600 text-white text-xs font-semibold rounded-lg
            hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors flex items-center gap-1.5"
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Search className="w-3.5 h-3.5" />
          }
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="mt-3 space-y-3">
          {results.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              <Scale className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              No se encontraron artículos para esa búsqueda.
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500">
                {results.length} resultado{results.length !== 1 ? 's' : ''} para «{query}»
              </p>
              {results.map((art, i) => (
                <LegalCard
                  key={`${art.source}-${art.article}-${i}`}
                  article={art}
                  query={query}
                  onSelect={onSelect}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
