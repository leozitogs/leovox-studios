import { Canvas } from '@react-three/fiber'
import { Totem } from './Totem'

// Canvas R3F único e fixo (Seção 2 do contexto).
// Vive fora do container de rotas do Barba e sobrevive às transições.
// O totem (mascote) viaja dentro dele entre as cenas.
export function PersistentCanvas() {
  return (
    <div className="persistent-canvas" aria-hidden="true">
      <Canvas gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 5], fov: 45 }}>
        <Totem />
      </Canvas>
    </div>
  )
}
