const canvas = document.getElementById('fractal_canvas');
const ctx = canvas.getContext('2d');

const SIZE = 400;

ctx.canvas.width = SIZE;
ctx.canvas.height = SIZE;

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, SIZE, SIZE);

const origin = {
  x: SIZE / 2,
  y: SIZE,
};

ctx.beginPath();
ctx.moveTo(origin.x, origin.y);
ctx.lineTo(origin.x, origin.y * (2 / 3));
ctx.strokeStyle = 'white';
ctx.stroke();
ctx.closePath();

