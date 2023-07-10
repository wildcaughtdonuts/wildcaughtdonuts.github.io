// Set up signature pad
const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', function(event) {
  startDrawing(event.clientX, event.clientY);
});

canvas.addEventListener('mouseup', stopDrawing);

canvas.addEventListener('mousemove', function(event) {
  if (drawing) {
    drawLine(event.clientX, event.clientY);
  }
});

function startDrawing(x, y) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
}

function stopDrawing() {
  drawing = false;
}

function drawLine(x, y) {
  ctx.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
  ctx.stroke();
}

function clearPad() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Form submission
document.getElementById('myForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const signature = canvas.toDataURL(); // Convert signature to data URL
  
  const data = {
    date: document.getElementById('date').value,
    name: document.getElementById('name').value,
    position: document.getElementById('position').value,
    phone: document.getElementById('phone').value,
    birthday: document.getElementById('birthday').value,
    signature: signature
  };

  fetch('https://script.google.com/macros/s/AKfycbzzyrqLYotbI5tZgiaVQlpRqjtSvdkVKeZp869UCoW4kZj4GX6ndKCjGXE9n5SDKI3dtg/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .then(data => {
    if (data.status === 'success') {
      alert('Form successfully submitted');
    } else {
      throw new Error('Error in server script');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
