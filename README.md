# BEYOND MOTION — Cinematic Scrollytelling Experience

[![Live Demo](https://img.shields.io/badge/Demo-En_Vivo-FFC000?style=for-the-badge&logo=googlechrome&logoColor=black)](https://jp3528.github.io/Animacion-cinematica-web-para-landing/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript ES6+](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Canvas 2D](https://img.shields.io/badge/Canvas_2D-60_FPS-FFC000?style=for-the-badge)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Una experiencia web interactiva de **scrollytelling cinemático** de alto rendimiento, desarrollada desde cero con arquitectura **Vanilla JavaScript**, renderizado sobre **HTML5 Canvas 2D** y principios de diseño brutalista editorial.

🔗 **Demo en Producción:** [https://jp3528.github.io/Animacion-cinematica-web-para-landing/](https://jp3528.github.io/Animacion-cinematica-web-para-landing/)

---

## 📐 Aspectos Técnicos & Arquitectura de Software

El proyecto fue diseñado con un enfoque estricto en rendimiento, eficiencia de cómputo y fidelidad visual a 60 FPS:

### 1. Motor de Renderizado en Canvas 2D
* **Interpolación Temporal en RAF:** Sincronización continua de fotogramas mediante `requestAnimationFrame`, desacoplando la tasa de refresco del ciclo de eventos del DOM.
* **Escalado HiDPI Dinámico:** Ajuste automático del buffer del canvas basado en `window.devicePixelRatio` (limitado a 2x para evitar consumo desmedido de memoria en pantallas Ultra Retina) garantizando nitidez sin distorsión subpixel.
* **Aspect-Ratio Cover:** Algoritmo matemático para encuadrar la imagen a pantalla completa preservando la relación de aspecto original (`16:9`) en cualquier resolución de pantalla.

### 2. Preloader Inteligente con Priorización Direccional
* **Ráfaga Inicial (Fast First Paint):** Descarga prioritaria de los primeros 30 fotogramas para garantizar interactividad instantánea sin pantallas de espera.
* **Pipeline Concurrente:** Procesamiento de cola con concurrencia controlada (`MAX_CONCURRENT_REQUESTS = 12`), descargando la secuencia completa (~8.2 MB) en pocos segundos sobre conexiones de banda ancha modernas.
* **Priorización según Trayectoria de Scroll:** Reordenamiento dinámico de la cola de descarga en tiempo real en función de la velocidad y dirección del usuario (adelante/atrás).

### 3. Arquitectura Anti-Parpadeo (Zero-Flicker Hold-Last)
* Si el usuario se desplaza a una velocidad superior al tiempo de respuesta de red, el motor retiene de forma determinista el último fotograma válido (`lastDrawnIndex`) o consulta vecinos inmediatos (±1 o 2 frames).
* Elimina cualquier salto abrupto o temblor entre fotogramas distantes.

### 4. Accesibilidad y Rendimiento (a11y & Performance)
* **Prefers-Reduced-Motion:** Detección de la preferencia del sistema operativo para deshabilitar animaciones pesadas y proporcionar un estado estático accesible.
* **Lifecycle Awareness:** Detección del estado de visibilidad del documento (`visibilitychange`) para pausar el bucle de render cuando la pestaña pasa a segundo plano, optimizando el consumo de CPU y batería.
* **Cero Dependencias Externas:** 100% código nativo, sin frameworks pesados, minimizando el First Contentful Paint (FCP) y el Total Blocking Time (TBT).

---

## 📊 Métricas de Rendimiento

| Métrica | Valor | Detalle |
| :--- | :--- | :--- |
| **Framerate Objetivo** | 60 FPS | Render sincronizado en Canvas 2D |
| **Peso Total de Secuencia** | ~8.2 MB | 240 fotogramas WebP optimizados |
| **Peso Promedio por Frame** | ~34 KB | Formato WebP con compresión con pérdidas de alta calidad |
| **Dependencias NPM** | 0 | Vanilla JS / CSS3 / HTML5 nativo |
| **Tiempo de Carga Inicial** | < 0.5s | Ráfaga inicial de fotogramas esenciales |

---

## 📁 Estructura del Proyecto

```text
Animacion-cinematica-web-para-landing/
├── assets/
│   ├── frames/             # Secuencia de 240 frames (frame_0001.webp - frame_0240.webp)
│   │   └── frames.json     # Manifiesto de metadatos de la secuencia
│   ├── images/             # Activos gráficos estáticos (showcase, specs, final)
│   └── video/              # Video en bucle del Hero (hero.mp4)
├── css/
│   └── styles.css          # Estilos brutalistas, variables CSS y layout responsivo
├── js/
│   └── main.js             # Motor Cinematic Engine v3.0 (Canvas 2D + Preloader)
├── index.html              # Documento semántico con metadatos Open Graph y SEO
├── package.json            # Metadatos del proyecto y scripts de ejecución
├── .gitignore              # Reglas de exclusión para control de versiones
└── README.md               # Documentación técnica
```

---

## 🚀 Entorno de Desarrollo Local

Para clonar e iniciar el entorno localmente:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jp3528/Animacion-cinematica-web-para-landing.git

# 2. Entrar al directorio
cd Animacion-cinematica-web-para-landing

# 3. Iniciar el servidor local
npm start
```

Alternativamente, puede servirse con cualquier servidor estático local:
```bash
# Con Python
python -m http.server 8080

# O mediante la extensión Live Server de VS Code
```

---

## 🛠️ Tecnologías Empleadas

* **Lenguaje:** JavaScript ES6+ (Clases, Async/Await, Web APIs)
* **Renderizado:** HTML5 Canvas API (2D Context)
* **Estilos:** CSS3 Moderno (Custom Properties, CSS Grid, Flexbox, Backdrop Filter)
* **Formatos Multimedia:** WebP (Frames de animación e imágenes), MP4 (H.264 Hero video)
* **Tipografías:** Barlow Condensed & Inter (Google Fonts)

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo de licencia para más detalles.
