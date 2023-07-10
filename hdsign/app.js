// Set up signature pad
const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', function(event) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

canvas.addEventListener('mouseup', function() {
  drawing = false;
});

canvas.addEventListener('mousemove', function(event) {
  if (drawing) {
    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
  }
});

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
  },
  mode: 'no-cors' // 추가
})
.then(response => {
  if (response.ok) {
    alert('Form successfully submitted');
  } else {
    throw new Error('Network response was not ok');
  }
})
.catch(error => {
  console.error('Error:', error);
});

});
