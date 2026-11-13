# Proposta · Manifesto refeito e Cena 8 (Contato)

> v1 · 2026-11-13. Status: **proposta, aguardando o PO.** Nada disso está no código.
> Quadros-chave em `C:\Design\Leovox\curadoria\manifesto-e-cena-8\` (fora do repositório).

## O fio que liga as cenas

Hoje, três cenas já falam a mesma língua:

- o hero, com a Extenda em branco e o pixo escrito e desfeito pela mão;
- a Cena 7, com a folha de contato circulada pela mesma mão;
- o "simples e eficiente" que o PO pediu ao vetar a troca de fontes e a cursiva no meio do
  editorial.

O manifesto ficou de fora dessa língua: ele é de antes dessas decisões. A proposta é que ele
passe a falar como o resto: **uma voz tipográfica só, em escala de tela, e a mão verde como
única segunda voz.**

## Manifesto · diagnóstico do atual

Visto quadro a quadro em 1440x900:

1. **O lettering é pequeno para o que diz.** As frases ficam centralizadas em corpo de
   subtítulo, com muito vazio em volta. O manifesto é o momento da marca falar alto e fala
   baixo.
2. **Quatro vozes disputam cada tela:** Anton, a cursiva Lost in South ("recusa.", "feio."),
   adesivos verdes (IGNORA, INTENÇÃO) e a nota à mão ("sério?", "ei, psiu"). É o mesmo
   problema que o PO reprovou no hero.
3. **Os atos são slides, não planos.** Cada um entra com a sua animação de CSS ao cruzar a
   tela, e nada passa de um ato para o outro. O movimento não impressiona porque a escala não
   ajuda.
4. **A Lost in South é demo de uso pessoal.** Ela é um dos dois motivos de o site ainda estar
   fechado por senha. Tirá-la daqui resolve metade do problema de licença.
5. **O ato 4 repete o "DESENVOLVA SEUS SONHOS."**, que já é a frase do hero.

## Manifesto · direção proposta: "a mão no texto"

- **Tipo:** uma família só, a Extenda, em caixa alta, em escala de cartaz, ocupando a largura
  da tela. A Bebas fica só para os rótulos pequenos.
- **Segunda voz:** só a mão verde, desenhada com a mesma técnica do pixo do hero (traços por
  máscara, `pixo.ts`). Ela risca, circula, rasga e costura o texto, e cada gesto diz algo.
- **O que sai:** a cursiva, os adesivos e as notas digitadas.
- **Movimento:**
  - a escala e a entrada das palavras são câmera, scrubadas pelo scroll;
  - os riscos da mão são gestos com histerese, como na Cena 7.

### Os quatro atos

| Ato | O que o lettering faz | O que a mão faz |
| --- | --- | --- |
| 1 · Recusa | "A LEOVOX NASCEU DE UMA RECUSA." em duas linhas na largura da tela; cada palavra sobe da linha de base com o scroll | Risca, uma a uma, as coisas recusadas: "SE ENCAIXAR", "ESCOLHER CRIATIVO OU TÉCNICO", "LOGO BONITO" |
| 2 · Diagnóstico | "O MERCADO ERROU" e, embaixo, "FEIO." cresce até sangrar pela borda | Dá a volta em "FEIO.", como correção de revisor na margem |
| 3 · A tese | "DIVISÃO." em escala de tela **rasga ao meio** com o scroll, e no vão aparecem CRIATIVO e TÉCNICO | Quando as metades voltam a se juntar (a Leovox ignora a divisão), a mão **costura a emenda** em zigue-zague verde |
| 4 · Assinatura | "AQUI SE FAZ COM / INTENÇÃO, / TÉCNICA E / AUTENTICIDADE." em escala de cartaz | Sublinha cada palavra e, no fim, **o pixo do hero assina o manifesto**, escrito traço a traço; "ISSO É LEOVOX." fica como legenda |

**O momento para impressionar** é o ato 3: uma palavra do tamanho da tela que se rasga e é
costurada. A metáfora da tese vira o próprio movimento.

### Conexões

- **Com o hero:** a mesma mão. O pixo que se desfaz no disparo assina o manifesto no ato 4.
- **Com os Pilares:** o ato 4 termina com o pixo, e a tira começa. A chegada dos Pilares (a
  luz caindo) não muda.
- **Com a Cena 7:** o risco e o círculo são os mesmos da folha de contato.

## Cena 8 · Contato · direção proposta: "a última tomada"

O roteiro (PIPELINE) já pedia que "Desenvolva seus sonhos" vire o botão do filme e que a cena
feche o círculo com o hero. A proposta chega lá em três beats:

1. **A última tomada.** A frase que fecha a Cena 7 ("A PRÓXIMA CENA É A SUA.") continua em corte
   seco, e a câmera volta ao set da primeira tomada: os prédios em halftone, o pixo e o mascote,
   agora no escuro. É o inverso do hero: lá a cena encolhia para o card, aqui o card se abre
   para a cena.
2. **A palavra é sua.** A troca de palavra do hero ("DESENVOLVA SEUS ___") vira escolha:
   - quem chegou até aqui toca em SONHOS, PROJETOS, NEGÓCIOS ou PRODUTOS;
   - a mão sublinha a palavra escolhida;
   - aparece o botão "VAMOS DESENVOLVER SEUS PROJETOS →", que abre o WhatsApp ou o e-mail já com
     a frase escolhida.

   Fricção mínima: um clique. Formulário só se provar que merece existir.
3. **A claquete.** Os canais ficam escritos numa claquete ("CENA 08 · TAKE 1 · DIREÇÃO: VOCÊ ·
   PRODUÇÃO: LEOVOX STUDIOS"), e a haste bate uma vez quando a cena assenta (gesto). Depois
   vem o Footer: "Obrigado."

O botão **Contato** do menu passa a levar para esta cena.

## Decisões para o PO

1. O manifesto pode perder a cursiva, os adesivos e as notas digitadas, ficando só com a
   Extenda e a mão?
2. Topa o rasgo e a costura de "DIVISÃO." como momento-assinatura?
3. O ato 4 pode trocar o "DESENVOLVA SEUS SONHOS." pela assinatura com o pixo?
4. Cena 8: quais canais entram (e-mail, WhatsApp, Instagram) e com qual endereço e número?
5. Cena 8: a escolha da palavra vira mensagem pronta no WhatsApp e no e-mail?
6. A lista de palavras é a mesma do hero (SONHOS, PROJETOS, PLANOS, NEGÓCIOS, PRODUTOS)?

Com as respostas, o próximo passo é o protótipo de motion de cada uma, como no hero e na
Cena 7, antes do código.
