import { app, BrowserWindow, screen, ipcMain, net, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'

const isDev = !app.isPackaged

import { readFileSync, writeFileSync, existsSync } from 'fs'
const configPath = join(app.getPath('userData'), 'window-config.json')

interface WindowConfig {
  windowX?: number
  windowY?: number
  windowSize?: number
}

function loadConfig(): WindowConfig {
  try {
    if (existsSync(configPath)) {
      return JSON.parse(readFileSync(configPath, 'utf-8'))
    }
  } catch {}
  return {}
}

function saveConfig(data: Partial<WindowConfig>) {
  try {
    const existing = loadConfig()
    writeFileSync(configPath, JSON.stringify({ ...existing, ...data }))
  } catch {}
}

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function getScreenBounds() {
  const { width, height } = screen.getPrimaryDisplay().bounds
  return { width, height }
}

function clampWindowPosition(x: number, y: number, windowSize: number) {
  const { width: screenWidth, height: screenHeight } = getScreenBounds()
  const clampedX = Math.max(0, Math.min(x, screenWidth - windowSize))
  const clampedY = Math.max(0, Math.min(y, screenHeight - windowSize))
  return { x: clampedX, y: clampedY }
}

function createWindow(): void {
  const { width: screenWidth, height: screenHeight } = getScreenBounds()
  const config = loadConfig()

  const windowSize = config.windowSize ?? 400
  const defaultX = Math.round((screenWidth - windowSize) / 2)
  const defaultY = Math.round((screenHeight - windowSize) / 2)

  // Clamp saved position to screen bounds
  const savedX = config.windowX ?? defaultX
  const savedY = config.windowY ?? defaultY
  const { x: clampedX, y: clampedY } = clampWindowPosition(savedX, savedY, windowSize)

  mainWindow = new BrowserWindow({
    width: windowSize,
    height: windowSize,
    x: clampedX,
    y: clampedY,
    transparent: true,
    frame: false,
    thickFrame: false,
    alwaysOnTop: true,
    resizable: true,
    maximizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Set min/max size to prevent actual resizing but keep resizable: true
  mainWindow.setMinimumSize(windowSize, windowSize)
  mainWindow.setMaximumSize(windowSize, windowSize)

  // Ensure window receives mouse events (not click-through)
  mainWindow.setIgnoreMouseEvents(false)

  // IPC: resize window
  ipcMain.handle('resize-window', (_event, size: number) => {
    if (!mainWindow || mainWindow.isDestroyed()) return 400
    const clamped = Math.max(200, Math.min(800, Math.round(size)))
    mainWindow.setMinimumSize(clamped, clamped)
    mainWindow.setMaximumSize(clamped, clamped)
    mainWindow.setSize(clamped, clamped)
    saveConfig({ windowSize: clamped })
    return clamped
  })

  // IPC: get window position (returns CONTENT position and size)
  ipcMain.handle('get-window-position', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return { x: 0, y: 0, w: 400, h: 400 }
    const content = mainWindow.getContentBounds()
    return { x: content.x, y: content.y, w: content.width, h: content.height }
  })

  // IPC: get screen bounds
  ipcMain.handle('get-screen-bounds', () => {
    return getScreenBounds()
  })

  // IPC: set window position. Returns actual content position and size.
  ipcMain.handle('set-window-position', (_event, contentX: number, contentY: number) => {
    if (!mainWindow || mainWindow.isDestroyed()) return { x: 0, y: 0, w: 400, h: 400 }
    if (typeof contentX !== 'number' || typeof contentY !== 'number' || isNaN(contentX) || isNaN(contentY)) {
      const cb = mainWindow.getContentBounds()
      return { x: cb.x, y: cb.y, w: cb.width, h: cb.height }
    }

    const { width: screenWidth, height: screenHeight } = getScreenBounds()
    const content = mainWindow.getContentBounds()
    const frame = mainWindow.getBounds()
    const offsetX = content.x - frame.x
    const offsetY = content.y - frame.y

    // Clamp so ball (15%-85%) stays on screen
    const margin = 0.15
    const minCX = -Math.round(content.width * margin)
    const maxCX = screenWidth - Math.round(content.width * (1 - margin))
    const minCY = -Math.round(content.height * margin)
    const maxCY = screenHeight - Math.round(content.height * (1 - margin))

    const cx = Math.max(minCX, Math.min(Math.round(contentX), maxCX))
    const cy = Math.max(minCY, Math.min(Math.round(contentY), maxCY))

    mainWindow.setPosition(cx - offsetX, cy - offsetY)
    saveConfig({ windowX: cx - offsetX, windowY: cy - offsetY })

    const actual = mainWindow.getContentBounds()
    return { x: actual.x, y: actual.y, w: actual.width, h: actual.height }
  })

  // IPC: get window size
  ipcMain.handle('get-window-size', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return 400
    const [w] = mainWindow.getSize()
    return w
  })

  // IPC: set ignore mouse events (click-through)
  ipcMain.on('set-ignore-mouse-events', (_event, ignore: boolean, options?: { forward: boolean }) => {
    if (!mainWindow || mainWindow.isDestroyed()) return
    mainWindow.setIgnoreMouseEvents(ignore, options)
  })

  // IPC: proxy fetch
  ipcMain.handle('api-fetch', async (_event, url: string, options: { method: string; headers: Record<string, string>; body: string }) => {
    return new Promise((resolve) => {
      const request = net.request({ method: options.method, url, headers: options.headers })
      let responseData = ''
      request.on('response', (response) => {
        response.on('data', (chunk) => { responseData += chunk.toString() })
        response.on('end', () => { resolve({ status: response.statusCode, data: responseData }) })
      })
      request.on('error', (err) => { resolve({ status: 0, data: '', error: err.message }) })
      if (options.body) request.write(options.body)
      request.end()
    })
  })

  // Save position on successful move
  mainWindow.on('moved', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const [x, y] = mainWindow.getPosition()
      saveConfig({ windowX: x, windowY: y })
    }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray() {
  // Create a simple 16x16 blue circle icon programmatically
  const size = 16
  const buffer = Buffer.alloc(size * size * 4)
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 1
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const dist = Math.hypot(x - cx, y - cy)
      if (dist <= r) {
        buffer[idx] = 100      // R
        buffer[idx + 1] = 200  // G
        buffer[idx + 2] = 255  // B
        buffer[idx + 3] = 255  // A
      }
    }
  }
  const icon = nativeImage.createFromBuffer(buffer, { width: size, height: size })
  tray = new Tray(icon)
  tray.setToolTip('CyberPet')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: 'Hide',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.hide()
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  // Don't quit - keep running in tray
})
