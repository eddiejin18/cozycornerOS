// CozyCorner OS - Main JavaScript
class CozyCornerOS {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.desktop = document.getElementById('desktop');
        this.taskbarItems = document.querySelector('.taskbar-items');
        this.windows = new Map();
        this.windowCounter = 0;
        
        // Enhanced canvas state for fluid interaction
        this.canvasState = {
            x: -9000,
            y: -9000,
            scale: 1,
            minScale: 0.1,
            maxScale: 5,
            isDragging: false,
            dragStart: { x: 0, y: 0 },
            lastPanPoint: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            lastTime: 0,
            isAnimating: false
        };
        
        this.init();
    }
    
    init() {
        this.setupFluidCanvas();
        this.setupDesktopIcons();
        this.setupStartButton();
        this.addWelcomeMessage();
        this.addZoomControls();
        this.startAnimationLoop();
        this.preventPageZoom();
    }
    
    setupFluidCanvas() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.target === this.canvas) {
                this.canvasState.isDragging = true;
                this.canvasState.dragStart = { x: e.clientX, y: e.clientY };
                this.canvasState.lastPanPoint = { x: e.clientX, y: e.clientY };
                this.canvas.style.cursor = 'grabbing';
                this.canvasState.velocity = { x: 0, y: 0 };
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.canvasState.isDragging) {
                const deltaX = e.clientX - this.canvasState.dragStart.x;
                const deltaY = e.clientY - this.canvasState.dragStart.y;
                
                this.canvasState.x += deltaX;
                this.canvasState.y += deltaY;
                
                // Calculate velocity for momentum
                const now = Date.now();
                const timeDelta = now - this.canvasState.lastTime;
                if (timeDelta > 0) {
                    this.canvasState.velocity.x = (e.clientX - this.canvasState.lastPanPoint.x) / timeDelta;
                    this.canvasState.velocity.y = (e.clientY - this.canvasState.lastPanPoint.y) / timeDelta;
                }
                
                this.canvasState.dragStart = { x: e.clientX, y: e.clientY };
                this.canvasState.lastPanPoint = { x: e.clientX, y: e.clientY };
                this.canvasState.lastTime = now;
                
                this.updateCanvasTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.canvasState.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        
        // Mouse wheel zoom - only on canvas, not HUD elements
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Better zoom factor for trackpad
            const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
            const newScale = Math.max(this.canvasState.minScale, 
                                    Math.min(this.canvasState.maxScale, 
                                           this.canvasState.scale * zoomFactor));
            
            if (newScale !== this.canvasState.scale) {
                // Zoom towards mouse position
                const scaleChange = newScale / this.canvasState.scale;
                this.canvasState.x = mouseX - (mouseX - this.canvasState.x) * scaleChange;
                this.canvasState.y = mouseY - (mouseY - this.canvasState.y) * scaleChange;
                this.canvasState.scale = newScale;
                
                this.updateCanvasTransform();
                this.updateZoomDisplay();
            }
        }, { passive: false });
        
        // Touch support for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
                if (e.touches.length === 1) {
                    this.canvasState.isDragging = true;
                    const touch = e.touches[0];
                    this.canvasState.dragStart = { x: touch.clientX, y: touch.clientY };
                    this.canvasState.lastPanPoint = { x: touch.clientX, y: touch.clientY };
                    this.canvasState.velocity = { x: 0, y: 0 };
                } else if (e.touches.length === 2) {
                    // Pinch zoom
                    this.canvasState.isDragging = false;
                    this.setupPinchZoom(e);
                }
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.canvasState.isDragging && e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.canvasState.dragStart.x;
                const deltaY = touch.clientY - this.canvasState.dragStart.y;
                
                this.canvasState.x += deltaX;
                this.canvasState.y += deltaY;
                
                this.canvasState.dragStart = { x: touch.clientX, y: touch.clientY };
                this.updateCanvasTransform();
            } else if (e.touches.length === 2) {
                e.preventDefault();
                this.handlePinchZoom(e);
            }
        });
        
        document.addEventListener('touchend', () => {
            this.canvasState.isDragging = false;
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Prevent zoom on HUD elements and allow normal scrolling
        document.addEventListener('wheel', (e) => {
            // If the target is a HUD element, allow normal scrolling
            if (e.target.closest('.taskbar') || 
                e.target.closest('.zoom-controls') || 
                e.target.closest('.window') ||
                e.target.closest('.desktop-icon')) {
                return; // Allow normal scrolling on HUD elements
            }
            
            // For the canvas area, prevent default to avoid page zoom
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupPinchZoom(e) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) + 
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        this.canvasState.lastPinchDistance = distance;
        this.canvasState.lastPinchCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }
    
    handlePinchZoom(e) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) + 
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        if (this.canvasState.lastPinchDistance) {
            const scaleChange = distance / this.canvasState.lastPinchDistance;
            const newScale = Math.max(this.canvasState.minScale, 
                                    Math.min(this.canvasState.maxScale, 
                                           this.canvasState.scale * scaleChange));
            
            if (newScale !== this.canvasState.scale) {
                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                
                const scaleFactor = newScale / this.canvasState.scale;
                this.canvasState.x = centerX - (centerX - this.canvasState.x) * scaleFactor;
                this.canvasState.y = centerY - (centerY - this.canvasState.y) * scaleFactor;
                this.canvasState.scale = newScale;
                
                this.updateCanvasTransform();
            }
        }
        
        this.canvasState.lastPinchDistance = distance;
    }
    
    updateCanvasTransform() {
        const transform = `translate(${this.canvasState.x}px, ${this.canvasState.y}px) scale(${this.canvasState.scale})`;
        this.canvas.style.transform = transform;
        this.canvasState.isAnimating = true;
        
        // Ensure HUD elements are never affected by canvas zoom
        this.ensureHUDIsolation();
    }
    
    ensureHUDIsolation() {
        // Force HUD elements to maintain their scale and position
        const hudElements = document.querySelectorAll('.taskbar, .zoom-controls, .window, .desktop-icon');
        hudElements.forEach(element => {
            element.style.transform = 'scale(1) !important';
            element.style.transformOrigin = 'initial !important';
        });
    }
    
    startAnimationLoop() {
        const animate = () => {
            // Apply momentum if not dragging
            if (!this.canvasState.isDragging && (Math.abs(this.canvasState.velocity.x) > 0.1 || Math.abs(this.canvasState.velocity.y) > 0.1)) {
                this.canvasState.x += this.canvasState.velocity.x * 16; // 16ms frame time
                this.canvasState.y += this.canvasState.velocity.y * 16;
                
                // Apply friction
                this.canvasState.velocity.x *= 0.95;
                this.canvasState.velocity.y *= 0.95;
                
                this.updateCanvasTransform();
            }
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    setupDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const appName = icon.dataset.app;
                this.openApp(appName);
            });
        });
    }
    
    setupStartButton() {
        const startButton = document.querySelector('.start-button');
        startButton.addEventListener('click', () => {
            this.showStartMenu();
        });
    }
    
    addWelcomeMessage() {
        // Add a cute welcome message to the canvas
        const welcome = document.createElement('div');
        welcome.style.position = 'absolute';
        welcome.style.left = '50%';
        welcome.style.top = '50%';
        welcome.style.transform = 'translate(-50%, -50%)';
        welcome.style.fontSize = '16px';
        welcome.style.color = 'white';
        welcome.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        welcome.style.textAlign = 'center';
        welcome.style.pointerEvents = 'none';
        welcome.style.zIndex = '1';
        welcome.innerHTML = `
            <div style="margin-bottom: 20px;">🌸 Welcome to CozyCorner OS 🌸</div>
            <div style="font-size: 12px; opacity: 0.8;">Double-click icons to open apps</div>
            <div style="font-size: 12px; opacity: 0.8;">Drag to explore the infinite canvas</div>
        `;
        this.canvas.appendChild(welcome);
    }
    
    openApp(appName) {
        const windowId = `window-${++this.windowCounter}`;
        const window = this.createWindow(windowId, appName);
        this.windows.set(windowId, window);
        this.addToTaskbar(windowId, appName);
        this.loadAppContent(window, appName);
    }
    
    createWindow(windowId, appName) {
        const template = document.getElementById('window-template');
        const window = template.cloneNode(true);
        window.id = windowId;
        window.classList.remove('hidden');
        
        const title = window.querySelector('.window-title');
        title.textContent = this.getAppTitle(appName);
        
        // Position window randomly but within view
        const x = Math.random() * (window.innerWidth - 400) + 50;
        const y = Math.random() * (window.innerHeight - 300) + 50;
        window.style.left = `${x}px`;
        window.style.top = `${y}px`;
        
        this.setupWindowControls(window, windowId);
        this.desktop.appendChild(window);
        
        return window;
    }
    
    setupWindowControls(window, windowId) {
        const header = window.querySelector('.window-header');
        const closeBtn = window.querySelector('.close-btn');
        const minimizeBtn = window.querySelector('.minimize-btn');
        const maximizeBtn = window.querySelector('.maximize-btn');
        
        // Make window draggable
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        let windowStart = { x: 0, y: 0 };
        
        header.addEventListener('mousedown', (e) => {
            if (e.target === header || e.target === header.querySelector('.window-title')) {
                isDragging = true;
                dragStart = { x: e.clientX, y: e.clientY };
                windowStart = { 
                    x: parseInt(window.style.left) || 0, 
                    y: parseInt(window.style.top) || 0 
                };
                window.style.zIndex = 1000;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStart.x;
                const deltaY = e.clientY - dragStart.y;
                window.style.left = `${windowStart.x + deltaX}px`;
                window.style.top = `${windowStart.y + deltaY}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        closeBtn.addEventListener('click', () => {
            this.closeWindow(windowId);
        });
        
        minimizeBtn.addEventListener('click', () => {
            this.minimizeWindow(windowId);
        });
        
        maximizeBtn.addEventListener('click', () => {
            this.maximizeWindow(windowId);
        });
    }
    
    loadAppContent(window, appName) {
        const content = window.querySelector('.window-content');
        
        switch (appName) {
            case 'notepad':
                this.loadNotepad(content);
                break;
            case 'calculator':
                this.loadCalculator(content);
                break;
            case 'paint':
                this.loadPaint(content);
                break;
            case 'snake':
                this.loadSnake(content);
                break;
            case 'tetris':
                this.loadTetris(content);
                break;
            default:
                content.innerHTML = '<div class="app-content">App not implemented yet! 🌸</div>';
        }
    }
    
    loadNotepad(content) {
        content.innerHTML = `
            <textarea class="notepad-content" placeholder="Start typing your thoughts... 💭"></textarea>
        `;
    }
    
    loadCalculator(content) {
        content.innerHTML = `
            <div class="calculator">
                <div class="calc-display" id="calc-display">0</div>
                <button class="calc-btn" onclick="calc.clear()">C</button>
                <button class="calc-btn" onclick="calc.backspace()">⌫</button>
                <button class="calc-btn" onclick="calc.operation('/')">/</button>
                <button class="calc-btn" onclick="calc.operation('*')">×</button>
                <button class="calc-btn" onclick="calc.number('7')">7</button>
                <button class="calc-btn" onclick="calc.number('8')">8</button>
                <button class="calc-btn" onclick="calc.number('9')">9</button>
                <button class="calc-btn" onclick="calc.operation('-')">-</button>
                <button class="calc-btn" onclick="calc.number('4')">4</button>
                <button class="calc-btn" onclick="calc.number('5')">5</button>
                <button class="calc-btn" onclick="calc.number('6')">6</button>
                <button class="calc-btn" onclick="calc.operation('+')">+</button>
                <button class="calc-btn" onclick="calc.number('1')">1</button>
                <button class="calc-btn" onclick="calc.number('2')">2</button>
                <button class="calc-btn" onclick="calc.number('3')">3</button>
                <button class="calc-btn" onclick="calc.equals()" style="grid-row: span 2;">=</button>
                <button class="calc-btn" onclick="calc.number('0')" style="grid-column: span 2;">0</button>
                <button class="calc-btn" onclick="calc.number('.')">.</button>
            </div>
        `;
        
        // Initialize calculator
        if (!window.calc) {
            window.calc = new Calculator();
        }
    }
    
    loadPaint(content) {
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <button onclick="paint.clear()" style="margin: 0 5px; padding: 5px 10px;">Clear</button>
                <input type="color" id="paint-color" value="#000000" style="margin: 0 5px;">
                <input type="range" id="paint-size" min="1" max="10" value="3" style="margin: 0 5px;">
            </div>
            <canvas id="paint-canvas" width="250" height="200" style="border: 1px solid #ccc; cursor: crosshair;"></canvas>
        `;
        
        // Initialize paint app
        if (!window.paint) {
            window.paint = new PaintApp();
        }
    }
    
    loadSnake(content) {
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <button onclick="snake.start()" style="margin: 0 5px; padding: 5px 10px;">Start Game</button>
                <div style="font-size: 8px; margin-top: 5px;">Score: <span id="snake-score">0</span></div>
            </div>
            <canvas id="snake-canvas" width="250" height="200" style="border: 1px solid #ccc;"></canvas>
        `;
        
        // Initialize snake game
        if (!window.snake) {
            window.snake = new SnakeGame();
        }
    }
    
    loadTetris(content) {
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <button onclick="tetris.start()" style="margin: 0 5px; padding: 5px 10px;">Start Game</button>
                <div style="font-size: 8px; margin-top: 5px;">Score: <span id="tetris-score">0</span></div>
            </div>
            <canvas id="tetris-canvas" width="200" height="300" style="border: 1px solid #ccc;"></canvas>
        `;
        
        // Initialize tetris game
        if (!window.tetris) {
            window.tetris = new TetrisGame();
        }
    }
    
    getAppTitle(appName) {
        const titles = {
            'notepad': '📝 Notepad',
            'calculator': '🧮 Calculator',
            'paint': '🎨 Paint',
            'snake': '🐍 Snake Game',
            'tetris': '🧩 Tetris'
        };
        return titles[appName] || '🌸 App';
    }
    
    addToTaskbar(windowId, appName) {
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item active';
        taskbarItem.textContent = this.getAppTitle(appName);
        taskbarItem.addEventListener('click', () => {
            this.focusWindow(windowId);
        });
        this.taskbarItems.appendChild(taskbarItem);
    }
    
    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.remove();
            this.windows.delete(windowId);
            
            // Remove from taskbar
            const taskbarItems = document.querySelectorAll('.taskbar-item');
            taskbarItems.forEach(item => {
                if (item.textContent.includes(this.getAppTitle(windowId.split('-')[1]))) {
                    item.remove();
                }
            });
        }
    }
    
    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.style.display = 'none';
        }
    }
    
    maximizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            if (window.style.width === '100vw' && window.style.height === '100vh') {
                // Restore
                window.style.width = '';
                window.style.height = '';
                window.style.left = '';
                window.style.top = '';
            } else {
                // Maximize
                window.style.width = '100vw';
                window.style.height = '100vh';
                window.style.left = '0';
                window.style.top = '0';
            }
        }
    }
    
    focusWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.style.zIndex = 1000;
            window.style.display = 'block';
        }
    }
    
    showStartMenu() {
        // Simple start menu - could be expanded
        alert('🌸 Start Menu 🌸\n\nThis is where you would see:\n• All Programs\n• Settings\n• Shutdown\n• And more cute features!');
    }
    
    addZoomControls() {
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-btn" onclick="os.zoomIn()">+</button>
            <div class="zoom-level" id="zoom-level">100%</div>
            <button class="zoom-btn" onclick="os.zoomOut()">−</button>
            <button class="zoom-btn" onclick="os.resetZoom()">⌂</button>
        `;
        this.desktop.appendChild(zoomControls);
        
        // Update zoom level display
        this.updateZoomDisplay();
    }
    
    zoomIn() {
        const newScale = Math.min(this.canvasState.maxScale, this.canvasState.scale * 1.2);
        this.setZoom(newScale);
    }
    
    zoomOut() {
        const newScale = Math.max(this.canvasState.minScale, this.canvasState.scale * 0.8);
        this.setZoom(newScale);
    }
    
    resetZoom() {
        this.setZoom(1);
        this.canvasState.x = -9000;
        this.canvasState.y = -9000;
        this.updateCanvasTransform();
        this.updateZoomDisplay();
    }
    
    setZoom(scale) {
        this.canvasState.scale = scale;
        this.updateCanvasTransform();
        this.updateZoomDisplay();
    }
    
    updateZoomDisplay() {
        const zoomLevel = document.getElementById('zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.canvasState.scale * 100) + '%';
        }
    }
    
    preventPageZoom() {
        // Prevent page zoom with Ctrl/Cmd + scroll
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent page zoom with keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
                e.preventDefault();
            }
        });
        
        // Additional protection for HUD elements
        document.addEventListener('wheel', (e) => {
            // If hovering over HUD elements, prevent any zoom behavior
            if (e.target.closest('.taskbar') || 
                e.target.closest('.zoom-controls') || 
                e.target.closest('.window') ||
                e.target.closest('.desktop-icon')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { passive: false });
    }
}

// Calculator Class
class Calculator {
    constructor() {
        this.display = document.getElementById('calc-display');
        this.current = '0';
        this.previous = null;
        this.operation = null;
        this.waitingForOperand = false;
    }
    
    updateDisplay() {
        this.display.textContent = this.current;
    }
    
    number(num) {
        if (this.waitingForOperand) {
            this.current = num;
            this.waitingForOperand = false;
        } else {
            this.current = this.current === '0' ? num : this.current + num;
        }
        this.updateDisplay();
    }
    
    operation(nextOperation) {
        const inputValue = parseFloat(this.current);
        
        if (this.previous === null) {
            this.previous = inputValue;
        } else if (this.operation) {
            const currentValue = this.previous || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operation);
            
            this.current = String(newValue);
            this.previous = newValue;
        }
        
        this.waitingForOperand = true;
        this.operation = nextOperation;
        this.updateDisplay();
    }
    
    performCalculation(firstValue, secondValue, operation) {
        switch (operation) {
            case '+': return firstValue + secondValue;
            case '-': return firstValue - secondValue;
            case '*': return firstValue * secondValue;
            case '/': return firstValue / secondValue;
            default: return secondValue;
        }
    }
    
    equals() {
        const inputValue = parseFloat(this.current);
        
        if (this.previous !== null && this.operation) {
            const newValue = this.performCalculation(this.previous, inputValue, this.operation);
            this.current = String(newValue);
            this.previous = null;
            this.operation = null;
            this.waitingForOperand = true;
        }
        this.updateDisplay();
    }
    
    clear() {
        this.current = '0';
        this.previous = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }
    
    backspace() {
        if (this.current.length > 1) {
            this.current = this.current.slice(0, -1);
        } else {
            this.current = '0';
        }
        this.updateDisplay();
    }
}

// Paint App Class
class PaintApp {
    constructor() {
        this.canvas = document.getElementById('paint-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.color = '#000000';
        this.size = 3;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        document.getElementById('paint-color').addEventListener('change', (e) => {
            this.color = e.target.value;
        });
        
        document.getElementById('paint-size').addEventListener('input', (e) => {
            this.size = e.target.value;
        });
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        this.draw(e);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.lineCap = 'round';
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }
    
    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Snake Game Class
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 10;
        this.tileCount = this.canvas.width / this.gridSize;
        this.snake = [{ x: 10, y: 10 }];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch (e.key) {
                case 'ArrowUp': if (this.dy !== 1) { this.dx = 0; this.dy = -1; } break;
                case 'ArrowDown': if (this.dy !== -1) { this.dx = 0; this.dy = 1; } break;
                case 'ArrowLeft': if (this.dx !== 1) { this.dx = -1; this.dy = 0; } break;
                case 'ArrowRight': if (this.dx !== -1) { this.dx = 1; this.dy = 0; } break;
            }
        });
    }
    
    start() {
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = true;
        this.generateFood();
        this.gameLoop();
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.gameLoop(), 150);
    }
    
    update() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snake-score').textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });
        
        // Draw food
        this.ctx.fillStyle = '#f44336';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }
    
    gameOver() {
        this.gameRunning = false;
        alert(`Game Over! Score: ${this.score}`);
    }
}

// Tetris Game Class (simplified)
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.board = Array(20).fill().map(() => Array(10).fill(0));
        this.score = 0;
        this.gameRunning = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch (e.key) {
                case 'ArrowLeft': this.movePiece(-1, 0); break;
                case 'ArrowRight': this.movePiece(1, 0); break;
                case 'ArrowDown': this.movePiece(0, 1); break;
                case ' ': this.rotatePiece(); break;
            }
        });
    }
    
    start() {
        this.board = Array(20).fill().map(() => Array(10).fill(0));
        this.score = 0;
        this.gameRunning = true;
        document.getElementById('tetris-score').textContent = this.score;
        this.draw();
    }
    
    movePiece(dx, dy) {
        // Simplified - would need full tetris implementation
    }
    
    rotatePiece() {
        // Simplified - would need full tetris implementation
    }
    
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const blockSize = 15;
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = '#0f0';
                    this.ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                }
            }
        }
    }
}

// Initialize the OS when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.os = new CozyCornerOS();
});
