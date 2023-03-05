function openDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('address').value = data.roadAddress;
    }
  }).open();
}
