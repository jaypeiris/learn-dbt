import { useEffect, useRef, useState } from 'react'
import { search, getSuggestedSearches, type SearchResult } from '../../lib/searchEngine'
import './SearchBar.css'

type SearchBarProps = {
  onNavigate: (route: string) => void
}

export default function SearchBar({ onNavigate }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const suggestedSearches = getSuggestedSearches()

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Perform search
  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults = search(query, 8)
      setResults(searchResults)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  const handleSelect = (route: string) => {
    onNavigate(route)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const handleKeyboardNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex].route)
    }
  }

  const handleSuggestedClick = (suggested: string) => {
    setQuery(suggested)
    inputRef.current?.focus()
  }

  return (
    <>
      <button type="button" className="search-trigger" onClick={() => setIsOpen(true)} title="Search (⌘K)">
        <span className="search-trigger__icon">🔍</span>
        <span className="search-trigger__text">Search...</span>
        <kbd className="search-trigger__kbd">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="search-overlay">
          <div className="search-dialog" ref={dialogRef}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search lessons, concepts, topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyboardNav}
              />
              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    inputRef.current?.focus()
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="search-results">
              {results.length > 0 ? (
                <ul className="search-results__list">
                  {results.map((result, index) => (
                    <li
                      key={result.id}
                      className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
                      onClick={() => handleSelect(result.route)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="search-result__header">
                        <span className={`search-result__type search-result__type--${result.type}`}>
                          {result.type}
                        </span>
                        <span className="search-result__title">{result.title}</span>
                      </div>
                      <p className="search-result__description">{result.description}</p>
                      {result.matchedText && (
                        <p className="search-result__snippet">{result.matchedText}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : query.trim().length >= 2 ? (
                <div className="search-empty">
                  <p>No results found for "{query}"</p>
                  <p className="search-empty__hint">Try searching for concepts like "ref", "staging", or "tests"</p>
                </div>
              ) : (
                <div className="search-suggestions">
                  <p className="search-suggestions__label">Popular searches</p>
                  <div className="search-suggestions__tags">
                    {suggestedSearches.map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        className="search-suggestion-tag"
                        onClick={() => handleSuggestedClick(suggested)}
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="search-footer">
              <div className="search-footer__shortcuts">
                <span>
                  <kbd>↑</kbd> <kbd>↓</kbd> Navigate
                </span>
                <span>
                  <kbd>↵</kbd> Select
                </span>
                <span>
                  <kbd>ESC</kbd> Close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
