


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
            // ctx.arc(event.offsetX, event.offsetY, eraserThickness / 2, 0, 2 * Math.PI);
            // ctx.fillStyle = 'white';
            // ctx.fill();
            ctx.clearRect(
                event.offsetX - eraserThickness / 2,
                event.offsetY - eraserThickness / 2,
                eraserThickness,
                eraserThickness
            );
        }
    }
});

//const newPageButton = document.getElementById('new-page');

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
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
    color = 'white'; // Simulate erasing by drawing with white color
});

// Event listener for the clear button
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Event listener for eraser size
eraserSizeSlider.addEventListener('change', () => {
    eraserThickness = parseInt(eraserSizeSlider.value);
});


// Replace the existing button references with icon references
const pencilIcon = document.getElementById('pencil');
const eraserIcon = document.getElementById('eraser');
const clearIcon = document.getElementById('clear');
const undoIcon = document.getElementById('undo');
const redoIcon = document.getElementById('redo');


// Event listeners for pencil, eraser, and clear
pencilIcon.addEventListener('click', () => {
    // Pencil functionality
    color = colorPicker.value; // Set color to the selected color
});

eraserIcon.addEventListener('click', () => {
    // Eraser functionality
    color = 'white'; // Simulate erasing by drawing with white color
});

clearIcon.addEventListener('click', () => {
    // Clear functionality
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


let history = [];
let historyIndex = -1;

// Function to save the current state of the canvas
function saveCanvasState() {
    history = history.slice(0, historyIndex + 1);
    history.push(canvas.toDataURL());
    historyIndex = history.length - 1;
}

// Function to undo
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const img = new Image();
        img.src = history[historyIndex];
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Function to redo
function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const img = new Image();
        img.src = history[historyIndex];
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Event listeners for undo and redo
undoIcon.addEventListener('click', () => {
    undo();
});

redoIcon.addEventListener('click', () => {
    redo();
});

// Modify the existing mouseup event listener to save canvas state
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
    saveCanvasState(); // Save the state after each drawing action
});

/* ===================================== */
const colorSheetsInput = document.getElementById('color-sheets');
const saveCanvasIcon = document.getElementById('save-canvas');

colorSheetsInput.addEventListener('input', () => {
    // Check if the input value is white (#ffffff)
    const isWhiteSheet = colorSheetsInput.value === '#ffffff';

    // Clear the canvas and reset history when creating a new sheet
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState(); // Save the initial state
    history = []; // Clear the history
    historyIndex = -1; // Reset history index

    // Change the canvas background color based on the selected color sheet
    canvas.style.backgroundColor = colorSheetsInput.value;

    // If it's a white sheet, simulate selecting white color for the new post
    if (isWhiteSheet) {
        colorPicker.value = '#ffffff';
        color = '#ffffff';
    }
})
 /* ====================================== */


// Event listener for save canvas icon
saveCanvasIcon.addEventListener('click', () => {
    const dataURL = canvas.toDataURL(); // Get the data URL of the canvas content
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas_image.png'; // Set the filename for the downloaded image
    a.click();
});

/* ================================ */

