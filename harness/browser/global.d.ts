import type { LeovoxHarness } from '../../src/harness/types'

declare global {
  interface Window {
    __LEOVOX_HARNESS__?: LeovoxHarness
  }
}

export {}
