import { useState, useCallback, useEffect, useRef } from 'react'
import { CHARACTER_NAMES } from '../configs/characters'

interface SettingsProps {
  config: { apiKey: string; baseUrl: string; model: string }
  onSave: (config: { apiKey: string; baseUrl: string; model: string }) => void
  onClose: () => void
  selectedCharacter?: string
  onCharacterChange?: (name: string) => void
}

export default function Settings({ config, onSave, onClose, selectedCharacter, onCharacterChange }: SettingsProps) {
  const [apiKey, setApiKey] = useState(config.apiKey)
  const [baseUrl, setBaseUrl] = useState(config.baseUrl)
  const [model, setModel] = useState(config.model)
  const [windowSize, setWindowSize] = useState(400)
  const [pendingCharacter, setPendingCharacter] = useState(selectedCharacter || CHARACTER_NAMES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    window.electronAPI?.getWindowSize?.()?.then(setWindowSize)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    setPendingCharacter(selectedCharacter || CHARACTER_NAMES[0])
  }, [selectedCharacter])

  const handleSave = useCallback(() => {
    onSave({ apiKey, baseUrl, model })
    if (pendingCharacter !== selectedCharacter) {
      onCharacterChange?.(pendingCharacter)
    }
    onClose()
  }, [apiKey, baseUrl, model, onSave, onClose, pendingCharacter, selectedCharacter, onCharacterChange])

  const handleCancel = useCallback(() => {
    setPendingCharacter(selectedCharacter || CHARACTER_NAMES[0])
    onClose()
  }, [selectedCharacter, onClose])

  const rafRef = useRef(0)
  const pendingSizeRef = useRef(0)

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value)
    setWindowSize(size)
    pendingSizeRef.current = size
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        window.electronAPI?.resizeWindow?.(pendingSizeRef.current)
      })
    }
  }, [])

  const handleSizeCommit = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    window.electronAPI?.resizeWindow?.(pendingSizeRef.current)
  }, [])

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 6,
    padding: '6px 10px',
    color: 'white',
    outline: 'none',
    width: '100%'
  }

  return (
    <div
      onClick={() => { if (dropdownOpen) setDropdownOpen(false) }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        padding: 20,
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflowY: 'auto'
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Settings</div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ opacity: 0.7 }}>Character</span>
        <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none'
            }}
          >
            <span>{pendingCharacter}</span>
            <span style={{ opacity: 0.5, fontSize: 10 }}>{dropdownOpen ? '▲' : '▼'}</span>
          </div>
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              marginTop: 2,
              zIndex: 10,
              overflow: 'hidden'
            }}>
              {CHARACTER_NAMES.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    setPendingCharacter(name)
                    setDropdownOpen(false)
                  }}
                  style={{
                    padding: '6px 10px',
                    color: name === pendingCharacter ? '#64c8ff' : 'white',
                    background: name === pendingCharacter ? 'rgba(100,200,255,0.1)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={(e) => { (e.target as HTMLDivElement).style.background = name === pendingCharacter ? 'rgba(100,200,255,0.1)' : 'transparent' }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ opacity: 0.7 }}>Pet Size ({windowSize}px)</span>
        <input
          type="range"
          min={200}
          max={800}
          step={50}
          value={windowSize}
          onChange={handleSizeChange}
          onMouseUp={handleSizeCommit}
          onTouchEnd={handleSizeCommit}
          style={{ width: '100%' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ opacity: 0.7 }}>API Key</span>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ opacity: 0.7 }}>Base URL</span>
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://api.deepseek.com"
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ opacity: 0.7 }}>Model</span>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="deepseek-chat"
          style={inputStyle}
        />
      </label>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button
          onClick={handleCancel}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 6,
            padding: 8,
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            background: 'rgba(100, 200, 255, 0.3)',
            border: 'none',
            borderRadius: 6,
            padding: 8,
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
