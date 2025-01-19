const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60; // Adjust height based on needs

let isDrawing = false;
let color = 'black';
let pencilThickness = 5;
let eraserThickness = 10;

const colorPicker = document.getElementById('color-picker');
const thicknessSlider = document.getElementById('thickness');
const clearButton = document.getElementById('clear');
const eraserSizeSlider = document.getElementById('eraser-size');
const eraserButton = document.getElementById('eraser');

// Event listeners for drawing
canvas.addEventListener('mousedown', () => {
    isDrawing = true;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        if (color !== 'white') {
            // Pencil drawing
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.strokeStyle = color;
            ctx.lineWidth = pencilThickness;
            ctx.stroke();
        } else {
            // Eraser drawing
            ctx.clearRect(
                event.offsetX - eraserThickness / 2,
                event.offsetY - eraserThickness / 2,
                eraserThickness,
                eraserThickness
            );
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
    saveCanvasState();
});

// Event listeners for color and thickness
colorPicker.addEventListener('change', () => {
    color = colorPicker.value;
});

thicknessSlider.addEventListener('change', () => {
    pencilThickness = parseInt(thicknessSlider.value);
});

// Eraser functionality
eraserButton.addEventListener('click', () => {
    color = 'white';
});

// Event listener for the clear button
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Event listener for eraser size
eraserSizeSlider.addEventListener('change', () => {
    eraserThickness = parseInt(eraserSizeSlider.value);
});

// Icon references
const pencilIcon = document.getElementById('pencil');
const eraserIcon = document.getElementById('eraser');
const clearIcon = document.getElementById('clear');
const undoIcon = document.getElementById('undo');
const redoIcon = document.getElementById('redo');

// Event listeners for pencil, eraser, and clear
pencilIcon.addEventListener('click', () => {
    color = colorPicker.value;
});

eraserIcon.addEventListener('click', () => {
    color = 'white';
});

clearIcon.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

let history = [];
let historyIndex = -1;

// Functions for undo and redo
function saveCanvasState() {
    history = history.slice(0, historyIndex + 1);
    history.push(canvas.toDataURL());
    historyIndex = history.length - 1;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        drawImageFromHistory();
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        drawImageFromHistory();
    }
}

function drawImageFromHistory() {
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

// Event listeners for undo and redo
undoIcon.addEventListener('click', () => {
    undo();
});

redoIcon.addEventListener('click', () => {
    redo();
});

// Color sheets input and save canvas icon
const colorSheetsInput = document.getElementById('color-sheets');
const saveCanvasIcon = document.getElementById('save-canvas');

colorSheetsInput.addEventListener('input', () => {
    const isWhiteSheet = colorSheetsInput.value === '#ffffff';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
    history = [];
    historyIndex = -1;

    canvas.style.backgroundColor = colorSheetsInput.value;

    if (isWhiteSheet) {
        colorPicker.value = '#ffffff';
        color = '#ffffff';
    }
});

saveCanvasIcon.addEventListener('click', () => {
    const dataURL = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas_image.png';
    a.click();
});
