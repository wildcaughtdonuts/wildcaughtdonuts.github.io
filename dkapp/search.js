// search.js

// 카카오 주소 API 불러오기
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

// 검색 버튼 클릭 시 실행될 함수
function searchAddress() {
  // 도로명 주소 검색 API 실행
  new daum.Postcode({
    oncomplete: function(data) {
      // 검색 결과 처리 로직 작성
      console.log(data);
    }
  }).open();
}

// 검색 버튼 클릭 이벤트 등록
document.getElementById("search-button").addEventListener("click", searchAddress);
