// Globo hub do canto do hero. No hover (ou foco por teclado),
// o rótulo "portfólio" surge acima dele.

export function GlobeHub() {
  return (
    <button className="globe-hub" type="button" aria-label="Hub do portfólio">
      <span className="globe-label">portfólio</span>
      <img src="/components/component-globe.png" alt="" draggable={false} />
    </button>
  )
}
