// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // The default preset (Tailwind-compatible)
    presetAttributify(), // Allows using utilities as attributes like <div text="red">
    presetIcons() // Access to thousands of icons
  ]
})
