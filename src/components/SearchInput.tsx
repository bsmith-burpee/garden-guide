'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  defaultValue?: string
  className?: string
  showButton?: boolean
}

export default function SearchInput({ 
  placeholder = "Search articles and recipes...", 
  onSearch,
  defaultValue = '',
  className = '',
  showButton = true
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue)
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue)
  const router = useRouter()

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [query])

  // Call onSearch when debounced query changes
  useEffect(() => {
    if (onSearch && debouncedQuery !== defaultValue) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch, defaultValue])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }, [query, router])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-colors text-black placeholder-gray-500"
        />
      </div>
      {showButton && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-green text-white px-3 py-1 rounded text-sm hover:bg-brand-green/90 transition-colors"
        >
          Search
        </button>
      )}
    </form>
  )
}