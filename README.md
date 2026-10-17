# BEYOND MOTION | Cinematic Scrollytelling

[Español](#espanol) · [English](#english)

[Demo](https://animacion-cinematica-web-para-landi.vercel.app) · [GitHub](https://github.com/Jp3528/Animacion-cinematica-web-para-landing)

<a id="espanol"></a>

## Español

### Descripción

Experiencia web de presentación automotriz que convierte el desplazamiento en una secuencia visual sobre Canvas 2D. El proyecto explora narrativa interactiva, carga progresiva de imágenes y animación con JavaScript nativo.

### Funcionalidades

- Secuencia de 240 fotogramas WebP sincronizada con el scroll.
- Precarga con concurrencia limitada y prioridad según la dirección del desplazamiento.
- Escalado del canvas según densidad de píxeles y tamaño de pantalla.
- Preferencia de movimiento reducido y pausa del renderizado al ocultar la pestaña.

### Tecnologías

HTML5 · CSS3 · JavaScript · Canvas 2D · WebP

### Ejecutar localmente

**Requisitos:** Python 3 para el servidor estático del ejemplo, o Node.js y npm para `npm start`.

```bash
git clone https://github.com/Jp3528/Animacion-cinematica-web-para-landing.git
cd Animacion-cinematica-web-para-landing
```

```bash
python -m http.server 8080 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8080`. Como alternativa, `npm start` inicia un servidor mediante `npx serve` y muestra su URL en la terminal.

### Estructura

| Ruta                               | Contenido                                |
| ---------------------------------- | ---------------------------------------- |
| [`index.html`](index.html)         | Documento y secciones de la experiencia. |
| [`js/main.js`](js/main.js)         | Motor de scroll, precarga y renderizado. |
| [`css/styles.css`](css/styles.css) | Diseño visual y estilos adaptables.      |
| [`assets/`](assets/)               | Fotogramas, imágenes y video.            |

### Alcance

Demostración frontend sin backend ni servicios de negocio. El rendimiento depende del dispositivo, la red y el tamaño de los recursos; el repositorio no incorpora una suite automatizada de benchmarks.

---

<a id="english"></a>

## English

### Overview

An automotive showcase that turns scrolling into a visual sequence rendered with Canvas 2D. The project explores interactive storytelling, progressive image loading and animation with vanilla JavaScript.

### Features

- A 240-frame WebP sequence synchronized with scrolling.
- Bounded concurrent preloading prioritized by scroll direction.
- Canvas scaling based on pixel density and viewport size.
- Reduced-motion support and rendering paused when the tab is hidden.

### Technology

HTML5 · CSS3 · JavaScript · Canvas 2D · WebP

### Run locally

**Requirements:** Python 3 for the example static server, or Node.js and npm for `npm start`.

```bash
git clone https://github.com/Jp3528/Animacion-cinematica-web-para-landing.git
cd Animacion-cinematica-web-para-landing
```

```bash
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080`. Alternatively, `npm start` launches a server through `npx serve` and prints its URL in the terminal.

### Structure

| Path                               | Contents                                    |
| ---------------------------------- | ------------------------------------------- |
| [`index.html`](index.html)         | Page markup and experience sections.        |
| [`js/main.js`](js/main.js)         | Scrolling, preloading and rendering engine. |
| [`css/styles.css`](css/styles.css) | Visual design and responsive styles.        |
| [`assets/`](assets/)               | Frames, images and video.                   |

### Scope

A frontend demonstration without a backend or business services. Performance depends on the device, network and asset sizes; the repository does not include an automated benchmark suite.
