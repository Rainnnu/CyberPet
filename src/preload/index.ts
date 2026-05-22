import { ipcRenderer, contextBridge } from 'electron'

const api = {
  resizeWindow: (size: number): Promise<number> => {
    return ipcRenderer.invoke('resize-window', size)
  },
  getWindowSize: (): Promise<number> => {
    return ipcRenderer.invoke('get-window-size')
  },
  getWindowPosition: (): Promise<{ x: number, y: number }> => {
    return ipcRenderer.invoke('get-window-position')
  },
  setWindowPosition: (x: number, y: number): Promise<{ x: number, y: number }> => {
    return ipcRenderer.invoke('set-window-position', x, y)
  },
  getScreenBounds: (): Promise<{ width: number, height: number }> => {
    return ipcRenderer.invoke('get-screen-bounds')
  },
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options)
  },
  apiFetch: (url: string, options: { method: string; headers: Record<string, string>; body: string }) => {
    return ipcRenderer.invoke('api-fetch', url, options)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electronAPI = api
}
