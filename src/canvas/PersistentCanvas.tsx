import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { hasWebGL } from '../lib/webgl'
import { Totem } from './Totem'

// Canvas R3F único e fixo (Seção 2 do contexto).
// Vive fora do container de rotas do Barba e sobrevive às transições.
// O totem (mascote) viaja dentro dele entre as cenas.
// Sem WebGL, o contêiner continua no DOM e o canvas simplesmente não nasce.
export function PersistentCanvas() {
  const [webgl] = useState(hasWebGL)

  return (
    <div className="persistent-canvas" aria-hidden="true" data-webgl={webgl ? 'on' : 'off'}>
      {webgl ? (
        <Canvas gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 5], fov: 45 }}>
          <Totem />
        </Canvas>
      ) : null}
    </div>
  )
}
