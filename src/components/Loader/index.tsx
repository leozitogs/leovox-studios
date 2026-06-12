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
  const coverRef = useRef<HTMLSpanElement>(null)
  const leoRef = useRef<HTMLDivElement>(null)
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
    coverRef,
    leoRef,
    siteRef,
    progressRef,
    onDone: () => setGone(true),
  })

  if (gone) return null

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Carregando Leovox Studios">
      <div className="ld-stage">
        <div ref={lvxRef} className="ld-lvx">
          <LvxMark />
          <span ref={coverRef} className="ld-wipe" aria-hidden="true" />
        </div>
        <div ref={leoRef} className="ld-leo">
          <LeovoxMark />
        </div>
      </div>
    </div>
  )
}
