function openDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('address').value = data.roadAddress;

      // 검색 결과 데이터 추출
      const sigunguCode = data.sigunguCode;
      const bcode = data.bcode;
      const roadnameCode = data.roadnameCode;
      const query = data.query;

      // 검색 결과 출력
      const result = document.getElementById('result');
      result.innerHTML = `sigunguCode: ${sigunguCode}<br>`;
      result.innerHTML += `bcode: ${bcode}<br>`;
      result.innerHTML += `roadnameCode: ${roadnameCode}<br>`;
      result.innerHTML += `query: ${query}`;
    }
  }).open();
}
