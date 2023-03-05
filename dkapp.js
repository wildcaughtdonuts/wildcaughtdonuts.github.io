function openDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = 
        'sigunguCode: ' + data.sigunguCode + '<br>' +
        'bcode: ' + data.bcode + '<br>' +
        'roadnameCode: ' + data.roadnameCode + '<br>' +
        'query: ' + data.query;
      document.getElementById('address').value = data.roadAddress;
    }
  }).open();
}
