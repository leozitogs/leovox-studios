// Abertura · LVX vira LEOVOX e a tela oficial sobe como folha.
// Este componente e so a view: o progresso real vive em
// useLoadProgress e a coreografia em useLoaderChoreography.

import { useEffect, useRef, useState, type RefObject } from 'react'
import { LeovoxMark, LvxMark } from './marks'
import { useLoadProgress } from './useLoadProgress'
import { useLoaderChoreography } from './useLoaderChoreography'
import './loader.css'

interface LoaderProps {
  siteRef: RefObject<HTMLDivElement | null>
}

export function Loader({ siteRef }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lvxRef = useRef<HTMLDivElement>(null)
  const leoRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLParagraphElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const [gone, setGone] = useState(false)

  const progressRef = useLoadProgress()

  // pagina travada enquanto a abertura roda
  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    return () => document.documentElement.classList.remove('is-loading')
  }, [])

  useLoaderChoreography({
    rootRef,
    lvxRef,
    leoRef,
    hudRef,
    ringRef,
    arcRef,
    siteRef,
    progressRef,
    onDone: () => setGone(true),
  })

  if (gone) return null

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Carregando Leovox Studios">
      <p ref={hudRef} className="ld-hud">
        0%
      </p>
      <div className="ld-stage">
        <div ref={lvxRef} className="ld-lvx">
          <LvxMark />
        </div>
        <div ref={leoRef} className="ld-leo">
          <LeovoxMark />
        </div>
      </div>
      <div ref={ringRef} className="ld-ring" aria-hidden="true">
        <svg viewBox="0 0 56 56">
          <circle className="ld-ring-bg" cx="28" cy="28" r="24" />
          <circle ref={arcRef} className="ld-ring-arc" cx="28" cy="28" r="24" />
        </svg>
      </div>
    </div>
  )
}
