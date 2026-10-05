/**
 * BEYOND MOTION - Cinematic Engine v3.0
 * High-performance scrollytelling & interactive experience.
 * Optimized WebP frame preloading, directional prioritization, and zero-stutter rendering.
 */

class CinematicExperience {
    constructor() {
        // DOM Elements
        this.menuTrigger = document.querySelector('.menu-trigger');
        this.mainMenu = document.getElementById('main-menu');
        this.menuLinks = document.querySelectorAll('.menu-links a');
        this.header = document.getElementById('main-header');
        this.hero = document.getElementById('hero');
        this.heroTitle = document.querySelector('.hero-title');
        this.heroBg = document.querySelector('.hero-bg');
        this.heroVideo = document.getElementById('hero-video');
        this.canvas = document.getElementById('sequence-canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.progressFill = document.querySelector('.progress-fill');
        this.progressLabel = document.getElementById('progress-label');
        this.narrativeOverlays = document.querySelectorAll('.narrative-overlay');

        // Scroll & Frame State
        this.scrollY = window.scrollY;
        this.targetScrollY = window.scrollY;
        this.lastScrollY = window.scrollY;
        this.scrollDirection = 1; // 1 = down, -1 = up
        this.currentFrame = 0;
        this.targetFrame = 0;
        this.lastDrawnIndex = -1;
        this.lerpFactor = 0.18; // Responsive, fluid frame progression

        // Canvas Dimensions
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.dpr = 1;

        // Frame Management
        this.frames = [];
        this.totalFrames = 240;
        this.framePrefix = 'frame_';
        this.frameExtension = '.webp';
        this.framePadding = 4;
        this.isReady = false;
        this.loadedFrames = new Set();
        this.loadingFrames = new Set();
        this.loadQueue = [];
        this.activeRequests = 0;
        this.MAX_CONCURRENT_REQUESTS = 12; // High-throughput parallel pipeline

        // Default Manifest (fallback when opened directly from disk via file://)
        this.defaultFrameManifest = {
            count: 240,
            prefix: 'frame_',
            extension: '.webp',
            padding: 4,
        };

        // Performance & Accessibility
        this.animationId = null;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.needsRedraw = true;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupInteractivity();
        this.handleResize();
        await this.loadFramesManifest();
        this.resumeRender();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            this.scrollDirection = currentY >= this.lastScrollY ? 1 : -1;
            this.lastScrollY = currentY;
            this.targetScrollY = currentY;
            this.needsRedraw = true;
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Fullscreen Menu Logic
        if (this.menuTrigger) {
            this.menuTrigger.addEventListener('click', () => this.toggleMenu());
        }

        if (this.menuLinks) {
            this.menuLinks.forEach(link => {
                link.addEventListener('click', () => this.toggleMenu(false));
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.mainMenu?.classList.contains('active')) {
                    this.toggleMenu(false);
                }
                const modal = document.getElementById('reservation-modal');
                if (modal?.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            }
        });

        // Hero Video Autoplay Assurance & Fallback
        if (this.heroVideo) {
            this.heroVideo.onerror = () => {
                this.heroVideo.style.display = 'none';
            };
            const playPromise = this.heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay prevented by browser, fallback background is active
                });
            }
        }

        // Visibility Change (pause loop when tab is hidden to save GPU/battery)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseRender();
            } else {
                this.resumeRender();
            }
        });
    }

    setupInteractivity() {
        // Reservation Modal trigger
        const reserveBtns = document.querySelectorAll('.btn-reserve');
        const modal = document.getElementById('reservation-modal');
        const modalClose = document.getElementById('modal-close');
        const reserveForm = document.getElementById('reservation-form');
        const formSuccess = document.getElementById('form-success');

        if (modal) {
            reserveBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('active');
                    const input = modal.querySelector('input');
                    if (input) setTimeout(() => input.focus(), 100);
                });
            });

            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            if (reserveForm) {
                reserveForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (formSuccess) {
                        reserveForm.style.display = 'none';
                        formSuccess.style.display = 'block';
                    }
                });
            }
        }
    }

    toggleMenu(forceState) {
        if (!this.mainMenu || !this.menuTrigger) return;

        const shouldClose = forceState !== undefined ? !forceState : this.mainMenu.classList.contains('active');
        if (shouldClose) {
            this.mainMenu.classList.remove('active');
            this.mainMenu.setAttribute('aria-hidden', 'true');
            this.menuTrigger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            requestAnimationFrame(() => this.menuTrigger.focus({ preventScroll: true }));
        } else {
            this.mainMenu.classList.add('active');
            this.mainMenu.setAttribute('aria-hidden', 'false');
            this.menuTrigger.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            requestAnimationFrame(() => this.menuLinks[0]?.focus({ preventScroll: true }));
        }
    }

    handleResize() {
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        const newWidth = this.canvas.clientWidth || window.innerWidth;
        const newHeight = this.canvas.clientHeight || window.innerHeight;

        if (newWidth === this.canvasWidth && newHeight === this.canvasHeight) {
            return;
        }

        this.canvasWidth = newWidth;
        this.canvasHeight = newHeight;

        this.canvas.width = Math.round(this.canvasWidth * this.dpr);
        this.canvas.height = Math.round(this.canvasHeight * this.dpr);

        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.needsRedraw = true;
    }

    async loadFramesManifest() {
        let manifest = this.defaultFrameManifest;

        try {
            if (window.location.protocol !== 'file:') {
                const manifestUrl = new URL('assets/frames/frames.json', document.baseURI);
                const response = await fetch(manifestUrl);
                if (response.ok) {
                    const data = await response.json();
                    if (typeof data.count === 'number' && data.count > 0) {
                        manifest = data;
                    }
                }
            }
        } catch (e) {
            console.warn('CinematicExperience: using default frame manifest.', e);
            manifest = this.defaultFrameManifest;
        }

        this.totalFrames = manifest.count || 240;
        this.framePrefix = manifest.prefix || 'frame_';
        this.frameExtension = manifest.extension || '.webp';
        this.framePadding = manifest.padding || 4;
        this.frames = new Array(this.totalFrames).fill(null);

        this.isReady = true;
        this.enqueueInitialFrames();
    }

    enqueueInitialFrames() {
        // Priority 1: First 30 frames for instantaneous start of the sequence
        const initialBatch = Math.min(30, this.totalFrames);
        for (let i = 0; i < initialBatch; i++) {
            this.addToQueue(i, 1);
        }

        // Priority 2: Next batch (frames 30 to 60)
        const secondBatch = Math.min(60, this.totalFrames);
        for (let i = initialBatch; i < secondBatch; i++) {
            this.addToQueue(i, 2);
        }

        // Priority 3: Remaining frames
        for (let i = secondBatch; i < this.totalFrames; i++) {
            this.addToQueue(i, 3);
        }
    }

    addToQueue(index, priority) {
        if (index < 0 || index >= this.totalFrames) return;
        if (this.loadedFrames.has(index) || this.loadingFrames.has(index)) return;
        if (this.loadQueue.some(item => item.index === index)) return;

        this.loadQueue.push({ index, priority });
        this.sortQueue();
        this.processQueue();
    }

    sortQueue() {
        this.loadQueue.sort((a, b) => a.priority - b.priority);
    }

    reprioritizeQueue() {
        const dir = this.scrollDirection;
        const currentTarget = this.targetFrame;

        this.loadQueue.forEach(item => {
            const diff = item.index - currentTarget;
            const inDirection = (dir >= 0 && diff >= 0) || (dir < 0 && diff <= 0);
            const absDiff = Math.abs(diff);

            // Prioritize items in scroll direction, de-prioritize opposite direction
            item.priority = inDirection ? absDiff : absDiff + 500;
        });

        this.sortQueue();
        this.processQueue();
    }

    processQueue() {
        while (this.activeRequests < this.MAX_CONCURRENT_REQUESTS && this.loadQueue.length > 0) {
            const { index } = this.loadQueue.shift();
            this.loadFrame(index);
        }
    }

    loadFrame(index) {
        this.loadingFrames.add(index);
        this.activeRequests++;

        const img = new Image();
        const frameNum = String(index + 1).padStart(this.framePadding, '0');
        const frameUrl = new URL(
            `assets/frames/${this.framePrefix}${frameNum}${this.frameExtension}`,
            document.baseURI
        );

        img.onload = () => {
            this.frames[index] = img;
            this.loadedFrames.add(index);
            this.loadingFrames.delete(index);
            this.activeRequests--;
            this.needsRedraw = true;

            // Draw frame 0 immediately when loaded so canvas is ready before user scrolls
            if (this.lastDrawnIndex === -1 && (index === 0 || this.targetFrame === index)) {
                this.drawFrame();
            }

            this.processQueue();
        };

        img.onerror = () => {
            this.loadingFrames.delete(index);
            this.activeRequests--;
            this.processQueue();
        };

        img.src = frameUrl.href;
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    updateScrollProgress() {
        this.scrollY = this.targetScrollY;

        // Hero Parallax & Fade
        const heroHeight = window.innerHeight;
        const heroProgress = Math.min(this.scrollY / (heroHeight * 0.15), 1);

        if (this.heroTitle && !this.reducedMotion) {
            this.heroTitle.style.opacity = 1 - heroProgress;
            this.heroTitle.style.transform = `translateY(${-30 * heroProgress}px)`;
        }

        if (this.heroBg && !this.reducedMotion) {
            this.heroBg.style.transform = `scale(${1 + (0.06 * heroProgress)})`;
        }

        if (this.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Scrollytelling Sequence Progress
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;

        const sectionTop = experienceSection.offsetTop;
        const sectionHeight = experienceSection.offsetHeight - window.innerHeight;
        const relativeScroll = this.scrollY - sectionTop;

        let progress = 0;
        if (relativeScroll > 0 && relativeScroll < sectionHeight) {
            progress = relativeScroll / sectionHeight;
        } else if (relativeScroll >= sectionHeight) {
            progress = 1;
        }

        this.updateStory(progress);
    }

    updateStory(progress) {
        const clampedProgress = Math.max(0, Math.min(1, progress));

        if (this.progressFill) {
            this.progressFill.style.width = `${clampedProgress * 100}%`;
        }

        const prevTarget = this.targetFrame;
        if (this.isReady && !this.reducedMotion) {
            this.targetFrame = clampedProgress >= 0.999
                ? this.totalFrames - 1
                : Math.floor(clampedProgress * (this.totalFrames - 1));
        } else if (this.isReady && this.reducedMotion) {
            this.targetFrame = 0;
        }

        // Direction-aware dynamic queue reprioritization
        if (this.isReady && prevTarget !== this.targetFrame) {
            this.reprioritizeQueue();
        }

        // Narrative Overlays
        const scenes = [
            { id: 'narrative-1', start: 0.05, end: 0.15, label: '01 / 04' },
            { id: 'narrative-2', start: 0.25, end: 0.40, label: '02 / 04' },
            { id: 'narrative-3', start: 0.50, end: 0.65, label: '03 / 04' },
            { id: 'narrative-4', start: 0.75, end: 0.95, label: '04 / 04' },
        ];

        let activeSceneLabel = '01 / 04';
        if (clampedProgress >= 0.70) activeSceneLabel = '04 / 04';
        else if (clampedProgress >= 0.45) activeSceneLabel = '03 / 04';
        else if (clampedProgress >= 0.20) activeSceneLabel = '02 / 04';
        else activeSceneLabel = '01 / 04';

        this.narrativeOverlays.forEach((overlay, idx) => {
            const scene = scenes[idx];
            if (!scene) return;

            const isActive = clampedProgress >= scene.start && clampedProgress < scene.end;
            const isLastAndEnd = (idx === 3 && clampedProgress >= 0.999);

            if (isActive || isLastAndEnd) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        });

        if (this.progressLabel) {
            this.progressLabel.textContent = activeSceneLabel;
        }
    }

    calculateCoverRect(img) {
        const canvasAspect = this.canvasWidth / this.canvasHeight;
        const imgW = img.naturalWidth || img.width || 1600;
        const imgH = img.naturalHeight || img.height || 900;
        const imgAspect = imgW / imgH;

        let renderX, renderY, renderW, renderH;

        if (canvasAspect > imgAspect) {
            renderW = this.canvasWidth;
            renderH = this.canvasWidth / imgAspect;
            renderX = 0;
            renderY = (this.canvasHeight - renderH) / 2;
        } else {
            renderW = this.canvasHeight * imgAspect;
            renderH = this.canvasHeight;
            renderX = (this.canvasWidth - renderW) / 2;
            renderY = 0;
        }

        return { renderX, renderY, renderW, renderH };
    }

    drawFrame() {
        if (!this.ctx || !this.isReady) return;

        const effectiveLerp = this.reducedMotion ? 1 : this.lerpFactor;
        this.currentFrame = this.lerp(this.currentFrame, this.targetFrame, effectiveLerp);
        const frameIndex = Math.max(0, Math.min(this.totalFrames - 1, Math.round(this.currentFrame)));

        let img = this.frames[frameIndex];
        let drawnIdx = frameIndex;

        // 1. Direct hit: target frame is ready
        // 2. Near hit: check immediate neighbors (±1 or 2 frames)
        if (!img) {
            for (let offset = 1; offset <= 2; offset++) {
                if (frameIndex - offset >= 0 && this.frames[frameIndex - offset]) {
                    img = this.frames[frameIndex - offset];
                    drawnIdx = frameIndex - offset;
                    break;
                }
                if (frameIndex + offset < this.totalFrames && this.frames[frameIndex + offset]) {
                    img = this.frames[frameIndex + offset];
                    drawnIdx = frameIndex + offset;
                    break;
                }
            }
        }

        // 3. Fallback: Hold last successfully drawn frame (eliminates flickering & jumping)
        if (!img && this.lastDrawnIndex !== -1 && this.frames[this.lastDrawnIndex]) {
            img = this.frames[this.lastDrawnIndex];
            drawnIdx = this.lastDrawnIndex;
        }

        // 4. Initial fallback: frame 0 if nothing has been drawn yet
        if (!img && this.frames[0]) {
            img = this.frames[0];
            drawnIdx = 0;
        }

        if (img) {
            const rect = this.calculateCoverRect(img);
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.drawImage(img, rect.renderX, rect.renderY, rect.renderW, rect.renderH);
            this.lastDrawnIndex = drawnIdx;
        } else {
            this.drawFallback();
        }
    }

    drawFallback() {
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        grad.addColorStop(0, '#181818');
        grad.addColorStop(1, '#000000');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    render() {
        this.updateScrollProgress();

        const frameChanged = Math.abs(this.currentFrame - this.targetFrame) > 0.05;

        if (this.needsRedraw || frameChanged) {
            this.drawFrame();
            this.needsRedraw = false;
        }

        this.animationId = requestAnimationFrame(() => this.render());
    }

    pauseRender() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resumeRender() {
        if (this.animationId === null) {
            this.render();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cinematicExperience = new CinematicExperience();
});
