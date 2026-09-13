import { Buffer } from 'buffer'

if (!('Buffer' in globalThis)) {
  ;(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
}
if (!('global' in globalThis)) {
  ;(globalThis as unknown as { global: typeof globalThis }).global = globalThis
}
