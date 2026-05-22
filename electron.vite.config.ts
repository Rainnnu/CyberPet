import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    publicDir: resolve('public'),
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.fbx'],
    plugins: [react()]
  }
})
