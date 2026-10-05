# BEYOND MOTION — Cinematic Web Experience

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Canvas 2D](https://img.shields.io/badge/Canvas_2D-60_FPS-FFC000?style=for-the-badge)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Una experiencia web interactiva de **scrollytelling cinemático** de alto rendimiento, inspirada en el diseño brutalista contemporáneo y la fluidez de las presentaciones de producto de alta gama (Apple, Porsche).

---

## ⚡ Características Principales

- **Motor Canvas 2D a 60 FPS:** Secuencia de 240 fotogramas WebP de alta definición sincronizados milimétricamente con el scroll del usuario.
- **Preloader Inteligente con Priorización Direccional:**
  - Descarga inmediata de ráfaga inicial (frames 0–30) para inicio instantáneo sin esperas.
  - Priorización dinámica en tiempo real según la dirección del scroll (hacia abajo o hacia arriba).
  - Concurrencia optimizada (`MAX_CONCURRENT_REQUESTS = 12`) que descarga los ~8.2 MB totales en segundos.
- **Arquitectura Zero-Flicker (Anti-Parpadeo):** Si la velocidad de scroll supera la red, el motor retiene el último frame estable (`lastDrawnIndex`) o consulta vecinos inmediatos (±1/2 frames), eliminando cualquier salto violento o temblor.
- **Soporte Retina / HiDPI:** Detección de `devicePixelRatio` con escalado visual nítido y anti-aliasing de alta calidad.
- **Cero Dependencias:** Construido íntegramente en Vanilla JavaScript moderno, HTML5 semántico y CSS3 puro.
- **Diseño Editorial Brutalista & Responsivo:** Tipografía industrial, espacios negativos calculados y adaptabilidad fluida para pantallas UltraWide, Desktop, tablets y móviles.
- **Modal de Reserva VIP:** Ventana modal accesible e interactiva para captura de solicitudes de la serie limitada 2026.
- **Accesibilidad:** Soporte completo para navegación por teclado y respeto del modo `prefers-reduced-motion`.

---

## 📁 Estructura del Proyecto

```text
cinematic-web/
├── assets/
│   ├── frames/             # Secuencia de 240 frames (frame_0001.webp - frame_0240.webp)
│   │   └── frames.json     # Manifiesto de configuración de la secuencia
│   ├── images/             # Imágenes estáticas de showcase, chasis, motor, interior y final
│   └── video/              # Video en bucle del Hero (hero.mp4)
├── css/
│   └── styles.css          # Estilos brutalistas, animaciones y layout responsive
├── js/
│   └── main.js             # Motor Cinematic Engine v3.0 con gestión de canvas y preloader
├── index.html              # Estructura semántica, metadatos Open Graph y modal
├── package.json            # Scripts de ejecución rápida
├── .gitignore              # Filtro de archivos del sistema y temporales
└── README.md               # Documentación del proyecto
```

---

## 🚀 Cómo Ejecutar en Local

Puedes correr el proyecto sin necesidad de instalar librerías pesadas:

### Opción 1: Con Node.js / NPX (Recomendado)
```bash
npx serve .
```
Abre tu navegador en la URL que indique la consola (por defecto `http://localhost:3000`).

### Opción 2: Con Python
```bash
# Si tienes Python 3 instalado:
python -m http.server 8080
```
Abre en tu navegador: `http://localhost:8080`.

### Opción 3: Con VS Code Live Server
1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

*(Nota: También es compatible abriendo directamente el archivo `index.html` en el navegador, gracias al fallback automático de manifiesto local).*

---

## 🌐 Cómo Desplegar Gratis en GitHub Pages

1. **Crea un repositorio en tu cuenta de GitHub** (ejemplo: `cinematic-web`).
2. **Sube tus cambios a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with optimized cinematic engine"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/cinematic-web.git
   git push -u origin main
   ```
3. **Activa GitHub Pages:**
   - En tu repositorio de GitHub, dirígete a la pestaña **Settings** (Configuración).
   - En el menú lateral izquierdo, haz clic en **Pages**.
   - En la sección **Build and deployment > Source**, selecciona **Deploy from a branch**.
   - En **Branch**, selecciona `main` y la carpeta `/ (root)`, luego pulsa **Save**.
4. ¡Listo! En 1 minuto tendrás tu web activa en:
   `https://TU_USUARIO.github.io/cinematic-web/`

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia **MIT**. Eres libre de usarlo, modificarlo y compartirlo.
