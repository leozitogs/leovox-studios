import type { ReactNode } from 'react'
import type { ProjectAsset as ProjectAssetData } from '../frentes'

type ProjectAssetProps = {
  asset: ProjectAssetData
  className?: string
  children?: ReactNode
  reveal?: string
}

export function ProjectAsset({ asset, className = '', children, reveal }: ProjectAssetProps) {
  return (
    <figure
      className={`pl-asset ${asset.src ? 'has-asset' : 'is-placeholder'} ${className}`}
      data-asset-request={asset.request}
      data-reveal={reveal}
    >
      {asset.src && asset.kind === 'video' ? (
        <video
          src={asset.src}
          poster={asset.poster}
          aria-label={asset.alt}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : null}
      {asset.src && asset.kind !== 'video' ? (
        <img src={asset.src} alt={asset.alt} loading="lazy" />
      ) : null}
      {!asset.src ? children : null}
      {!asset.src ? (
        <figcaption>
          <span>ASSET SOLICITADO</span>
          <strong>{asset.request}</strong>
        </figcaption>
      ) : null}
    </figure>
  )
}
