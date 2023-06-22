var canvas = document.getElementById('signature-pad');
var context = canvas.getContext('2d');
var isDrawing = false;

canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  context.beginPath();
  context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener('mousemove', function(e) {
  if (isDrawing) {
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
  }
});

canvas.addEventListener('mouseup', function() {
  isDrawing = false;
});

document.getElementById('clear-button').addEventListener('click', function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('info-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    var dataUrl = canvas.toDataURL('image/png');
  
    var data = {
      date: document.getElementById('edu-date').value,
      name: document.getElementById('name').value,
      position: document.getElementById('position').value,
      contact: document.getElementById('contact').value,
      birthdate: document.getElementById('birthdate').value,
      signature: dataUrl
    };
  
    fetch('https://script.google.com/macros/s/1mza4TkWBYsZNrLNhsGz5n03_KOh8E1ONIRjBiW6Gkrli5gnBv7yKmT2A/exec', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function(error) {
      console.error(error);
    });
  });
  
