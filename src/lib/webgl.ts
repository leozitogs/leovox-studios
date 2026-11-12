// O canvas persistente só nasce quando o navegador consegue criar um
// contexto WebGL. Sem isso, o Three.js loga erro e derruba o render
// (GPU bloqueada, driver na lista negra, CI sem GPU). O site inteiro
// vive no DOM, então a experiência continua completa sem o canvas.
export function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl')
    if (!gl) return false
    // Devolve o contexto de teste na hora: o navegador limita quantos
    // contextos WebGL vivos uma página pode ter.
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
