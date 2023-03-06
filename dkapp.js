// 국토교통부 OpenAPI 인증키
const apiKey = "5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D";

function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      var address = data.address; // 검색된 주소
      var buildingCode = data.buildingCode; // 검색된 건물 코드
      $("#addressInput").val(address); // 검색된 주소를 input 요소에 표시
      $("#buildingCodeOutput").text(buildingCode); // 검색된 건물 코드를 출력

      // 건물 코드에서 필요한 정보 추출
      const sigunguCd = buildingCode.slice(0, 5);
      const bjdongCd = buildingCode.slice(5, 10);
      const bun = buildingCode.slice(11, 15);
      const ji = buildingCode.slice(15, 19);

      // API 요청 URL 생성
      const requestUrl = `https://apis.data.go.kr/1611000/AptBasisInfoService/getAphusBassInfo?serviceKey=${apiKey}&sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&bun=${bun}&ji=${ji}`;

      // API 요청
      $.get(requestUrl, function (data) {
        const item = $(data).find("item")[0]; // 건물 정보 객체

        if (item) {
          const name = $(item).find("aphusNm").text(); // 건물 이름
          const addr = $(item).find("aphusAddr").text(); // 건물 주소

          // 검색된 건물 정보를 출력
          $("#buildingNameOutput").text(name);
          $("#buildingAddrOutput").text(addr);
        } else {
          console.log(`건물 정보를 찾을 수 없습니다. 요청 URL: ${requestUrl}`);
        }
      }).fail(function () {
        console.log(`API 요청에 실패하였습니다. 요청 URL: ${requestUrl}`);
      });

    },
  }).open();
}
