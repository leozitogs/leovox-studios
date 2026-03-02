/**
 * cloudShader.js — GLSL Volumetric Cloud Shader
 * 
 * Adaptado do componente Clouds3D (clouds_3d_effect) para uso no projeto
 * Leovox Studios. Baseado no shader original Vanta.js/iq (Shadertoy).
 * 
 * Características:
 * - Nuvens volumétricas via raymarching com 3D noise (FBM)
 * - Gradiente de céu cinematográfico com 3 cores
 * - Lens flare e sun glare
 * - Vinheta sutil
 * - Uniforms expostos para controle dinâmico via React
 */

export const cloudVertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

export const cloudFragmentShader = `
precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

uniform float speed;
uniform float cloudDensity;
uniform float cloudHeight;
uniform vec3 skyColor;
uniform vec3 skyColorTop;
uniform vec3 skyColorBottom;
uniform vec3 cloudColor;
uniform vec3 cloudShadowColor;
uniform vec3 sunColor;
uniform vec3 sunlightColor;
uniform vec3 sunGlareColor;
uniform float sunIntensity;
uniform float fogDensity;
uniform float fadeOut;

// ─── Hash & Noise (identical to Vanta/iq) ───────────────────────────────────

float hash(float p) {
  p = fract(p * 0.011);
  p *= (p + 7.5);
  p *= (p + p);
  return fract(p);
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 57.0 + 113.0 * p.z;
  return mix(
    mix(mix(hash(n + 0.0),   hash(n + 1.0),   f.x),
        mix(hash(n + 57.0),  hash(n + 58.0),  f.x), f.y),
    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
    f.z
  );
}

// ─── Cloud Density Maps (LOD) ───────────────────────────────────────────────

const float constantTime = 1000.0;

float map5(in vec3 p) {
  vec3 speed1 = vec3(0.5, 0.01, 1.0) * 0.5 * speed;
  vec3 q = p - speed1 * (iTime + constantTime);
  float f;
  f  = 0.50000 * noise(q); q = q * 2.02;
  f += 0.25000 * noise(q); q = q * 2.03;
  f += 0.12500 * noise(q); q = q * 2.01;
  f += 0.06250 * noise(q); q = q * 2.02;
  f += 0.03125 * noise(q);
  return clamp(cloudDensity - p.y - cloudHeight + 1.75 * f, 0.0, 1.0);
}

float map4(in vec3 p) {
  vec3 speed1 = vec3(0.5, 0.01, 1.0) * 0.5 * speed;
  vec3 q = p - speed1 * (iTime + constantTime);
  float f;
  f  = 0.50000 * noise(q); q = q * 2.02;
  f += 0.25000 * noise(q); q = q * 2.03;
  f += 0.12500 * noise(q); q = q * 2.01;
  f += 0.06250 * noise(q);
  return clamp(cloudDensity - p.y - cloudHeight + 1.75 * f, 0.0, 1.0);
}

float map3(in vec3 p) {
  vec3 speed1 = vec3(0.5, 0.01, 1.0) * 0.5 * speed;
  vec3 q = p - speed1 * (iTime + constantTime);
  float f;
  f  = 0.50000 * noise(q); q = q * 2.02;
  f += 0.25000 * noise(q); q = q * 2.03;
  f += 0.12500 * noise(q);
  return clamp(cloudDensity - p.y - cloudHeight + 1.75 * f, 0.0, 1.0);
}

float map2(in vec3 p) {
  vec3 speed1 = vec3(0.5, 0.01, 1.0) * 0.5 * speed;
  vec3 q = p - speed1 * (iTime + constantTime);
  float f;
  f  = 0.50000 * noise(q); q = q * 2.02;
  f += 0.25000 * noise(q);
  return clamp(cloudDensity - p.y - cloudHeight + 1.75 * f, 0.0, 1.0);
}

// ─── Sun Direction ──────────────────────────────────────────────────────────

vec3 sundir = normalize(vec3(-1.0, 0.0, -1.0));

// ─── Cloud Integration ──────────────────────────────────────────────────────

vec4 integrate(in vec4 sum, in float dif, in float den, in vec3 bgcol, in float t) {
  vec3 lin = cloudColor * 1.4 + sunlightColor * dif;
  vec4 col = vec4(mix(vec3(1.0, 0.95, 0.8), cloudShadowColor, den), den);
  col.xyz *= lin;
  col.xyz = mix(col.xyz, bgcol, 1.0 - exp(-fogDensity * t * t));
  col.a *= 0.4;
  col.rgb *= col.a;
  return sum + col * (1.0 - sum.a);
}

// ─── Raymarching ────────────────────────────────────────────────────────────

#define MARCH(STEPS, MAPLOD) for(int i = 0; i < STEPS; i++) { \\
  vec3 pos = ro + t * rd; \\
  if(pos.y < -3.0 || pos.y > 2.0 || sum.a > 0.99) break; \\
  float den = MAPLOD(pos); \\
  if(den > 0.01) { \\
    float dif = clamp((den - MAPLOD(pos + 0.3 * sundir)) / 0.6, 0.0, 1.0); \\
    sum = integrate(sum, dif, den, bgcol, t); \\
  } \\
  t += max(0.075, 0.02 * t); \\
}

vec4 raymarch(in vec3 ro, in vec3 rd, in vec3 bgcol, in ivec2 px) {
  vec4 sum = vec4(0.0);
  float t = 0.0;
  MARCH(30, map5);
  MARCH(30, map4);
  MARCH(35, map3);
  MARCH(45, map2);
  return clamp(sum, 0.0, 1.0);
}

// ─── Camera ─────────────────────────────────────────────────────────────────

mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
  vec3 cw = normalize(ta - ro);
  vec3 cp = vec3(sin(cr), cos(cr), 0.0);
  vec3 cu = normalize(cross(cw, cp));
  vec3 cv = normalize(cross(cu, cw));
  return mat3(cu, cv, cw);
}

// ─── Render ─────────────────────────────────────────────────────────────────

vec4 render(in vec3 ro, in vec3 rd, in ivec2 px) {
  float sun = clamp(dot(sundir, rd), 0.0, 1.0);
  
  // Sky gradient
  float skyGrad = clamp(rd.y, 0.0, 1.0);
  vec3 col;
  
  if (skyGrad > 0.15) {
    col = mix(skyColor, skyColorTop, smoothstep(0.15, 0.6, skyGrad));
  } else {
    col = mix(skyColorBottom, skyColor, smoothstep(-0.1, 0.15, skyGrad));
  }
  
  col -= rd.y * 0.1 * vec3(0.8, 0.4, 0.8);
  col += 0.06;
  
  // Sun glow
  col += sunIntensity * 0.2 * sunColor * pow(sun, 8.0);

  // Clouds
  vec4 res = raymarch(ro, rd, col, px);
  col = col * (1.0 - res.w) + res.xyz;

  // Sun glare
  col += sunIntensity * 0.2 * sunGlareColor * pow(sun, 3.0);
  
  // Lens flare
  col += sunIntensity * 0.06 * vec3(1.0, 0.95, 0.85) * pow(sun, 32.0);

  // Vignette
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float vignette = 1.0 - 0.08 * length((uv - 0.5) * 1.5);
  col *= vignette;

  // Fade out (para transição entre atos)
  col = mix(col, vec3(0.973, 0.976, 0.98), fadeOut);

  return vec4(col, 1.0);
}

// ─── Main ───────────────────────────────────────────────────────────────────

void main() {
  vec2 p = (-iResolution.xy + 2.0 * gl_FragCoord.xy) / iResolution.y;

  vec2 m = iMouse.xy / iResolution.xy;
  
  m.y = (1.0 - m.y) * 0.33 + 0.28;
  m.x *= 0.25;
  m.x += sin(iTime * 0.1 + 3.1415) * 0.25 + 0.25;

  vec3 ro = 4.0 * normalize(vec3(sin(3.0 * m.x), 0.4 * m.y, cos(3.0 * m.x)));
  vec3 ta = vec3(0.0, -1.0, 0.0);
  mat3 ca = setCamera(ro, ta, 0.0);
  
  vec3 rd = ca * normalize(vec3(p.xy, 1.5));

  gl_FragColor = render(ro, rd, ivec2(gl_FragCoord - 0.5));
}
`;

/**
 * Valores padrão dos uniforms para o shader de nuvens.
 * Podem ser sobrescritos via props do componente CloudsBackground.
 */
export const defaultCloudUniforms = {
  speed: 1.0,
  cloudDensity: 1.5,
  cloudHeight: 2.0,
  skyColor: '#68b8d7',
  skyColorTop: '#3a6fa8',
  skyColorBottom: '#c8dced',
  cloudColor: '#adc1de',
  cloudShadowColor: '#183550',
  sunColor: '#ff9919',
  sunlightColor: '#ff9933',
  sunGlareColor: '#ff6633',
  sunIntensity: 1.0,
  fogDensity: 0.003,
};
