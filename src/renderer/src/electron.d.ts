export interface ElectronAPI {
  resizeWindow: (size: number) => Promise<number>
  getWindowSize: () => Promise<number>
  getWindowPosition: () => Promise<{ x: number, y: number }>
  setWindowPosition: (x: number, y: number) => Promise<{ x: number, y: number }>
  getScreenBounds: () => Promise<{ width: number, height: number }>
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
  apiFetch: (url: string, options: { method: string; headers: Record<string, string>; body: string }) => Promise<{ status: number; data: string; error?: string }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
