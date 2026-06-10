import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registro central do GSAP. Importar sempre daqui,
// nunca direto de 'gsap', para garantir os plugins registrados.
gsap.registerPlugin(ScrollTrigger)

// Eases padrão do filme (Seção 5 do contexto):
// power4.inOut para câmera longa, expo.out para entradas,
// circ.inOut para parallax.

export { gsap, ScrollTrigger }
