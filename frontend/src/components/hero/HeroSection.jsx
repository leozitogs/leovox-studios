/**
 * HeroSection.jsx — Leovox Studios (v8)
 *
 * FRAMING baseado em análise pixel-a-pixel da referência:
 *
 * Layout grid (% da altura do viewport):
 *   0%  ─── topo (header)
 *  12%  ─── topo do modelo 3D
 *  42%  ─── centro do watermark / cursivos
 *  72%  ─── topo dos blocos inferiores
 * 100%  ─── fundo
 *
 * Watermark: Bebas Neue, edge-to-edge (~95vw),
 *            centro em top:42%, letras com gradiente cinza
 *
 * Cursivos: mesmo top:42% translateY(-50%) que watermark,
 *           flanqueiam o modelo sem colidir
 *
 * Modelo: câmera z=6.0, fov=34 → menor, ocupa ~62% do viewport height
 *         posicionado levemente acima do centro (camera y=0.35)
 *
 * Blocos: bottom:4vh, left/right padding = 5vw
 */

import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

/* ══════════════════════
   CONSTANTES
══════════════════════ */
const TARGET_SIZE = 1.85;
const GREEN       = "#19bc00";

/* ══════════════════════
   FRAMER MOTION
══════════════════════ */
const vFadeIn  = (d=0) => ({ initial:{opacity:0},       animate:{opacity:1},     transition:{duration:1.1, delay:d, ease:"easeOut"} });
const vFadeUp  = (d=0) => ({ initial:{opacity:0,y:34},  animate:{opacity:1,y:0}, transition:{duration:0.75,delay:d, ease:[.22,1,.36,1]} });
const vSlideL  = (d=0) => ({ initial:{opacity:0,x:-48}, animate:{opacity:1,x:0}, transition:{duration:0.80,delay:d, ease:[.22,1,.36,1]} });
const vSlideR  = (d=0) => ({ initial:{opacity:0,x:48},  animate:{opacity:1,x:0}, transition:{duration:0.80,delay:d, ease:[.22,1,.36,1]} });

function SplitText({ text, delay=0, stagger=0.044 }) {
  return (
    <span style={{display:"inline-block"}}>
      {text.split("").map((ch,i) => (
        <motion.span key={i}
          initial={{opacity:0,y:24,rotate:i%2===0?-6:6}}
          animate={{opacity:1,y:0,rotate:0}}
          transition={{duration:.50,delay:delay+i*stagger,ease:[.22,1,.36,1]}}
          style={{display:"inline-block"}}
        >{ch}</motion.span>
      ))}
    </span>
  );
}

/* ══════════════════════
   PARTÍCULAS
══════════════════════ */
function ParticleField() {
  const ref = useRef();
  useEffect(() => {
    const cv=ref.current; if(!cv)return;
    const ctx=cv.getContext("2d");
    let W=cv.width=window.innerWidth, H=cv.height=window.innerHeight;
    const pts=Array.from({length:40},()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.1+.3,
      vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18,
      a:Math.random()*.18+.03,
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      for(const p of pts){
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(25,188,0,${p.a})`; ctx.fill();
        p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    const onR=()=>{W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;};
    window.addEventListener("resize",onR);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",onR);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",opacity:.38}}/>;
}

/* ══════════════════════
   MODELO 3D
══════════════════════ */
function LeovoxModel({mousePos}) {
  const gr  = useRef();
  const t   = useRef(0);
  const rot = useRef({x:0,y:0});
  const {scene} = useGLTF("/LeovoxIsologo3D.glb");

  const scale = useMemo(()=>{
    if(!scene) return 1;
    const cl=scene.clone(true); cl.updateWorldMatrix(true,true);
    const box=new THREE.Box3().setFromObject(cl);
    const sz=new THREE.Vector3(); box.getSize(sz);
    const max=Math.max(sz.x,sz.y,sz.z);
    return max===0?1:TARGET_SIZE/max;
  },[scene]);

  useFrame((_s,dt)=>{
    if(!gr.current) return;
    t.current+=dt;
    gr.current.position.y=Math.sin(t.current*1.1)*0.055;
    rot.current.x=-mousePos.current.y*0.14;
    rot.current.y=-mousePos.current.x*0.20;
    gr.current.rotation.x=THREE.MathUtils.lerp(gr.current.rotation.x,rot.current.x,.05);
    gr.current.rotation.y=THREE.MathUtils.lerp(gr.current.rotation.y,rot.current.y,.05);
  });

  return (
    <group ref={gr} scale={scale}>
      <Center><primitive object={scene}/></Center>
    </group>
  );
}
function ModelFallback(){
  return <mesh><sphereGeometry args={[.8,24,24]}/><meshStandardMaterial color="#19bc00" wireframe opacity={.3} transparent/></mesh>;
}

/* ══════════════════════
   ÍCONE OLHO
══════════════════════ */
function EyeIcon({size=20}){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden style={{flexShrink:0}}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

/* ══════════════════════
   HERO SECTION
══════════════════════ */
export default function HeroSection() {
  const mousePos = useRef({x:0,y:0});

  useEffect(()=>{
    const fn=(e)=>{
      mousePos.current={
        x:(e.clientX/window.innerWidth)*2-1,
        y:(e.clientY/window.innerHeight)*2-1,
      };
    };
    window.addEventListener("mousemove",fn);
    return()=>window.removeEventListener("mousemove",fn);
  },[]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @font-face{font-family:'Anton';      src:url('../../assets/fonts/Anton/Anton-Regular.ttf')                    format('truetype');font-weight:400;font-display:swap;}
        @font-face{font-family:'Schoolbell'; src:url('../../assets/fonts/Schoolbell/Schoolbell-Regular.ttf')          format('truetype');font-weight:400;font-display:swap;}
        @font-face{font-family:'Poppins';    src:url('../../assets/fonts/Poppins/Poppins-Regular.ttf')                format('truetype');font-weight:400;font-display:swap;}
        @font-face{font-family:'Poppins';    src:url('../../assets/fonts/Poppins/Poppins-SemiBold.ttf')               format('truetype');font-weight:600;font-display:swap;}
        @font-face{font-family:'Montserrat'; src:url('../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf')      format('truetype');font-weight:700;font-display:swap;}
        @font-face{font-family:'Montserrat'; src:url('../../assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf') format('truetype');font-weight:800;font-display:swap;}

        /* ══════════════════════════════
           HERO — CONTAINER
        ══════════════════════════════ */
        .lv-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: #080808;
          background-image: radial-gradient(
            ellipse 70% 58% at 50% 46%,
            #1c1c1c 0%, #111 26%, #080808 58%, #030303 100%
          );
        }
        /* Vignette */
        .lv-hero::after {
          content:''; position:absolute; inset:0; z-index:3; pointer-events:none;
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 44%, rgba(0,0,0,.56) 100%);
        }
        /* Scanlines */
        .lv-hero::before {
          content:''; position:absolute; inset:0; z-index:3; pointer-events:none;
          background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.022) 3px,rgba(0,0,0,.022) 4px);
        }

        /* ══════════════════════════════
           CANVAS — cobre toda a tela
           (o modelo fica centralizado
           pelo próprio Three.js)
        ══════════════════════════════ */
        .lv-canvas-wrap {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }
        .lv-canvas-wrap canvas { pointer-events: auto !important; }

        /* ══════════════════════════════
           MARCA D'ÁGUA — Bebas Neue

           Análise referência:
           • O texto ocupa quase toda a largura da tela
           • Centro vertical em ~46% do viewport
           • Letras cinzas com gradiente topo→baixo
           • Sem fill, apenas stroke + gradient clip
        ══════════════════════════════ */
        .lv-watermark {
          position: absolute;
          left: 0;
          right: 0;
          /* Centro do texto em ~46% */
          top: 46%;
          transform: translateY(-50%);
          z-index: 1;
          pointer-events: none;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .lv-watermark-text {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          /*
            Calibrado para ~95% da largura:
            no viewport de 1440px → ~13.8vw → ~199px
            no viewport de  375px → clamp mínimo 68px
          */
          font-size: clamp(68px, 13.8vw, 210px);
          line-height: 1;
          white-space: nowrap;
          letter-spacing: 0.018em;

          /* Apenas stroke, sem fill (como na referência) */
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(75,75,75,.50);

          /* Gradiente vertical: mais claro em cima, escurece */
          background-image: linear-gradient(
            180deg,
            rgba(90,90,90,.65)  0%,
            rgba(62,62,62,.48) 35%,
            rgba(30,30,30,.25) 70%,
            rgba(8,8,8,.10)   100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          filter: drop-shadow(0 4px 24px rgba(0,0,0,.82));
        }

        /* ══════════════════════════════
           CURSIVOS
           Exatamente no mesmo eixo
           vertical do watermark (top:46%)
           Flanqueiam o modelo.
        ══════════════════════════════ */
        .lv-cursive {
          position: absolute;
          top: 46%;
          transform: translateY(-50%);
          z-index: 20;
          pointer-events: none;
          user-select: none;
          font-family: 'Schoolbell', cursive;
          color: ${GREEN};
          /*
            Tamanho proporcional ao watermark.
            Na referência os cursivos têm ~55-60% da altura
            das letras do watermark.
          */
          font-size: clamp(38px, 6.0vw, 104px);
          line-height: 1;
          text-shadow:
            0 0 28px rgba(25,188,0,.55),
            0 0 55px rgba(25,188,0,.18);
        }
        /*
          Posicionamento lateral calibrado:
          Na referência, "Portfólio" começa em ~5% da largura
          e "Criativo" termina em ~5% da direita.
          O modelo ocupa ~38-62% central da tela.
        */
        .lv-cursive-left  { left:  clamp(12px, 4.8vw, 78px); }
        .lv-cursive-right { right: clamp(12px, 4.8vw, 78px); }

        /* ══════════════════════════════
           BLOCOS INFERIORES
           Na referência: começam em ~72% do viewport,
           terminam em ~93%.
           bottom: ~7vh cobre isso em qualquer tela.
        ══════════════════════════════ */
        .lv-block-base {
          position: absolute;
          bottom: clamp(20px, 6vh, 60px);
          z-index: 30;
        }
        .lv-block-left {
          left: clamp(12px, 4.8vw, 78px);
          /*
            Largura máxima: ~28vw para não colidir
            com o modelo em telas médias
          */
          max-width: clamp(220px, 28vw, 400px);
        }
        .lv-block-right {
          right: clamp(12px, 4.8vw, 78px);
          max-width: clamp(220px, 26vw, 360px);
          text-align: right;
        }

        /* ══════════════════════════════
           LIQUID GLASS CARD
        ══════════════════════════════ */
        .lv-glass {
          position: relative;
          padding: 20px 24px;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,.052);
          backdrop-filter: blur(30px) saturate(165%);
          -webkit-backdrop-filter: blur(30px) saturate(165%);
          box-shadow:
            inset 0  1px 0  rgba(255,255,255,.18),
            inset 0 -1px 0  rgba(255,255,255,.04),
            inset 1px  0 0  rgba(255,255,255,.08),
            inset -1px 0 0  rgba(255,255,255,.04),
                  0 0 0 1px rgba(255,255,255,.09),
                  0 8px 34px rgba(0,0,0,.48);
        }
        .lv-glass::before {
          content:''; position:absolute; inset:0;
          border-radius:inherit; pointer-events:none; z-index:0;
          background: linear-gradient(138deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.05) 28%,transparent 56%);
        }
        .lv-glass > * { position:relative; z-index:1; }

        /* ══════════════════════════════
           TIPOGRAFIA
        ══════════════════════════════ */
        .lv-block-title {
          font-family: 'Anton', sans-serif;
          font-weight: 900;
          -webkit-font-smoothing: antialiased;
          color: ${GREEN};
          font-size: clamp(22px, 2.5vw, 46px);
          line-height: 1.05;
          margin-bottom: 9px;
          text-shadow: 0 0 18px rgba(25,188,0,.28);
          -webkit-text-stroke: .5px ${GREEN};
          paint-order: stroke fill;
        }
        .lv-block-body {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: clamp(10.5px, .85vw, 13.5px);
          color: rgba(210,210,210,.84);
          line-height: 1.62;
        }
        .lv-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: clamp(9px, .78vw, 12.5px);
          letter-spacing: .16em;
          color: #fff;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-top: 14px;
          position: relative;
          transition: color .24s, text-shadow .24s;
        }
        .lv-btn::after {
          content:''; position:absolute; bottom:-3px; left:0;
          width:0; height:1px;
          background:${GREEN}; box-shadow:0 0 6px rgba(25,188,0,.6);
          transition:width .34s;
        }
        .lv-btn:hover { color:${GREEN}; text-shadow:0 0 10px rgba(25,188,0,.48); }
        .lv-btn:hover::after { width:calc(100% - 28px); }

        /* ══════════════════════════════
           RESPONSIVIDADE
        ══════════════════════════════ */

        /* Tablet landscape (768–1199px) */
        @media (max-width:1199px) and (min-width:768px) {
          .lv-cursive        { font-size: clamp(32px, 5.2vw, 76px); }
          .lv-block-left     { max-width: clamp(200px, 32vw, 360px); }
          .lv-block-right    { max-width: clamp(200px, 30vw, 320px); }
          .lv-block-title    { font-size: clamp(20px, 2.8vw, 38px); }
          .lv-block-body     { font-size: clamp(10px, 1.0vw, 13px); }
        }

        /* Mobile (< 768px): esconde elements desktop, mostra layout mobile */
        @media (max-width:767px) {
          .lv-watermark,
          .lv-cursive,
          .lv-block-left,
          .lv-block-right { display:none !important; }
          .lv-mobile-layout { display:flex !important; }
        }

        /* ── MOBILE LAYOUT ── */
        .lv-mobile-layout {
          display: none;
          position: absolute;
          bottom:0; left:0; right:0;
          z-index: 30;
          flex-direction: column;
          gap: 10px;
          padding: 0 16px 18px;
        }
        .lv-m-cursives {
          display:flex; justify-content:space-between;
          pointer-events:none; user-select:none;
        }
        .lv-m-cursives span {
          font-family:'Schoolbell',cursive;
          font-size:clamp(26px,7.5vw,50px);
          color:${GREEN};
          text-shadow:0 0 24px rgba(25,188,0,.42);
        }
        .lv-m-title {
          font-family:'Anton',sans-serif; font-weight:900;
          -webkit-font-smoothing:antialiased;
          color:${GREEN};
          font-size:clamp(18px,5vw,28px);
          line-height:1.05; margin-bottom:5px;
          -webkit-text-stroke:.4px ${GREEN};
        }
        .lv-m-body {
          font-family:'Poppins',sans-serif; font-weight:600;
          font-size:clamp(10px,2.8vw,12.5px);
          color:rgba(210,210,210,.84); line-height:1.55;
        }
        .lv-m-glass {
          position:relative; overflow:hidden;
          background:rgba(255,255,255,.052);
          backdrop-filter:blur(24px) saturate(160%);
          -webkit-backdrop-filter:blur(24px) saturate(160%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.17),
            0 0 0 1px rgba(255,255,255,.09),
            0 6px 26px rgba(0,0,0,.42);
          border-radius:14px; padding:14px 18px; text-align:right;
        }
        .lv-m-glass::before {
          content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
          background:linear-gradient(138deg,rgba(255,255,255,.12) 0%,transparent 52%);
        }
        .lv-m-glass > * { position:relative; z-index:1; }
        .lv-m-btn {
          display:inline-flex; align-items:center; gap:5px;
          font-family:'Montserrat',sans-serif; font-weight:800;
          font-size:clamp(8.5px,2.5vw,11.5px); letter-spacing:.12em;
          color:#fff; background:none; border:none; cursor:pointer;
          padding:0; margin-top:9px; transition:color .22s;
        }
        .lv-m-btn:hover{color:${GREEN};}
      `}</style>

      <section className="lv-hero">

        {/* Partículas */}
        <ParticleField />

        {/* ─── MARCA D'ÁGUA ─── */}
        <motion.div {...vFadeIn(.06)} className="lv-watermark" aria-hidden="true">
          <span className="lv-watermark-text">LEOVOX STUDIOS</span>
        </motion.div>

        {/* ═══════════════════════════════════════
            CANVAS THREE.JS

            Decisão de câmera (fiel à referência):
            • z=6.0 afasta bastante → modelo ocupa
              ~58% da altura do viewport
            • y=0.32 levanta ligeiramente o modelo,
              liberando espaço na base para os blocos
            • fov=34 campo fechado → sem distorção,
              personagem parece "recortado" limpo
        ═══════════════════════════════════════ */}
        <div className="lv-canvas-wrap">
          <Canvas
            camera={{ position:[0, 0.32, 6.0], fov:34 }}
            gl={{
              antialias:true, alpha:true,
              toneMapping:THREE.ACESFilmicToneMapping,
              toneMappingExposure:1.08,
            }}
            style={{background:"transparent"}}
          >
            {/* KEY — branca sup-esq, alta intensidade */}
            <pointLight position={[-3.5, 4.2, 3.0]} intensity={55} color="#ffffff" distance={22} decay={2}/>
            {/* RIM — verde dir-baixo, ilumina contorno */}
            <pointLight position={[ 3.2,-1.2, 1.5]} intensity={20} color="#19bc00" distance={10} decay={2}/>
            {/* FILL — branca suave frontal */}
            <pointLight position={[ 0.5,-2.5, 4.2]} intensity={9}  color="#e8f5e8" distance={14} decay={2}/>
            {/* BACK — verde escuro, profundidade */}
            <pointLight position={[ 0,  0.5,-4.5]}  intensity={4.5} color="#0a2a00" distance={12} decay={2}/>
            <ambientLight intensity={0.11} color="#ffffff"/>

            <Suspense fallback={<ModelFallback/>}>
              <LeovoxModel mousePos={mousePos}/>
            </Suspense>
          </Canvas>
        </div>

        {/* ─── "Portfólio" ─── */}
        <div className="lv-cursive lv-cursive-left">
          <SplitText text="Portfólio" delay={.30} stagger={.042}/>
        </div>

        {/* ─── "Criativo" ─── */}
        <div className="lv-cursive lv-cursive-right">
          <SplitText text="Criativo" delay={.40} stagger={.042}/>
        </div>

        {/* ─── Bloco Qualidade ─── */}
        <motion.div {...vSlideL(.56)} className="lv-block-base lv-block-left">
          <motion.h2
            className="lv-block-title"
            initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}}
            transition={{duration:.62,delay:.60,ease:[.22,1,.36,1]}}
          >Qualidade</motion.h2>
          <motion.p
            className="lv-block-body"
            initial={{opacity:0}} animate={{opacity:1}}
            transition={{duration:.75,delay:.78}}
          >
            Não criamos apenas sites.<br/>
            Construímos experiências digitais<br/>
            memoráveis. Unimos estratégia, engenharia e<br/>
            identidade visual para transformar ideias em<br/>
            produtos reais.
          </motion.p>
        </motion.div>

        {/* ─── Bloco Diferenciação Técnica — Liquid Glass ─── */}
        <motion.div {...vSlideR(.66)} className="lv-block-base lv-block-right">
          <div className="lv-glass">
            <motion.h2
              className="lv-block-title"
              initial={{opacity:0,x:24}} animate={{opacity:1,x:0}}
              transition={{duration:.62,delay:.70,ease:[.22,1,.36,1]}}
            >Diferenciação Técnica</motion.h2>
            <motion.p
              className="lv-block-body"
              initial={{opacity:0}} animate={{opacity:1}}
              transition={{duration:.75,delay:.88}}
            >
              Design sem engenharia é superfície. Engenharia
              sem design é invisível. Na Leovox, ambos são
              estrutura.
            </motion.p>
            <motion.button
              className="lv-btn"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              transition={{duration:.52,delay:1.04}}
              whileHover={{scale:1.04}} whileTap={{scale:.96}}
              aria-label="Ver Projetos"
            >
              VIEW PROJECTS <EyeIcon size={18}/>
            </motion.button>
          </div>
        </motion.div>

        {/* ─── Mobile ─── */}
        <div className="lv-mobile-layout">
          <motion.div {...vFadeUp(.16)} className="lv-m-cursives">
            <span>Portfólio</span><span>Criativo</span>
          </motion.div>
          <motion.div {...vFadeUp(.30)}>
            <h2 className="lv-m-title">Qualidade</h2>
            <p className="lv-m-body">
              Não criamos apenas sites. Construímos experiências digitais memoráveis.
              Unimos estratégia, engenharia e identidade visual para transformar ideias em produtos reais.
            </p>
          </motion.div>
          <motion.div {...vFadeUp(.44)}>
            <div className="lv-m-glass">
              <h2 className="lv-m-title">Diferenciação Técnica</h2>
              <p className="lv-m-body">
                Design sem engenharia é superfície. Engenharia sem design é invisível.
                Na Leovox, ambos são estrutura.
              </p>
              <button className="lv-btn-sm lv-m-btn">
                VIEW PROJECTS <EyeIcon size={13}/>
              </button>
            </div>
          </motion.div>
        </div>

      </section>
    </>
  );
}

useGLTF.preload("/LeovoxIsologo3D.glb");