# Performance

## Sinais

- Core Web Vitals no percentil 75 em telemetria de produção quando disponível.
- LCP até 2,5 s, INP até 200 ms e CLS até 0,1 como metas de produto.
- Peso por rota, cena e asset.
- Frames longos durante scroll e travessia.
- Crescimento de listeners, ScrollTriggers, timelines e memória após ida e volta.

## Orçamentos

A primeira medição versionada vira baseline, não licença para regressão. Cada melhoria reduz o teto gradualmente. Assets acima do orçamento definido no contrato da cena falham antes do browser.

`collectFrameMetrics()` mede intervalos de `requestAnimationFrame` para comparação local. Ele não substitui métricas de campo nem profiling dedicado.
