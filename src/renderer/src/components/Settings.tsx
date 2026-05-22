import { useState, useCallback, useEffect } from 'react'
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

  useEffect(() => {
    window.electronAPI?.getWindowSize?.()?.then(setWindowSize)
  }, [])

  const handleSave = useCallback(() => {
    onSave({ apiKey, baseUrl, model })
    onClose()
  }, [apiKey, baseUrl, model, onSave, onClose])

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value)
    setWindowSize(size)
    window.electronAPI?.resizeWindow?.(size)
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
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Settings</div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ opacity: 0.7 }}>Character</span>
        <select
          value={selectedCharacter || CHARACTER_NAMES[0]}
          onChange={(e) => onCharacterChange?.(e.target.value)}
          style={{
            ...inputStyle,
            cursor: 'pointer',
            appearance: 'auto' as any
          }}
        >
          {CHARACTER_NAMES.map((name) => (
            <option key={name} value={name} style={{ background: '#1a1a2e', color: 'white' }}>
              {name}
            </option>
          ))}
        </select>
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
          onClick={onClose}
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
