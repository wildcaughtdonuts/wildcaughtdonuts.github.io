
document.getElementById("search-btn").addEventListener("click", function () {

  new daum.Postcode({
    oncomplete: function (data) {
      var buildingCode = data.buildingCode;
      document.getElementById("address-input").value = data.address;


      var apiKey = "5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D";
      var siggCd = buildingCode.substr(0, 5);
      var bjdCd = buildingCode.substr(5, 5);
      var bunCd = buildingCode.substr(11, 4);
      var jiCd = buildingCode.substr(15, 4);

      var btns = document.querySelectorAll('[data-type]');
      btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var type = this.getAttribute("data-type");
          var apiUrl;
          if (type === "title") {
            apiUrl = "https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?sigunguCd=" + siggCd + "&bjdongCd=" + bjdCd + "&platGbCd=0&bun=" + bunCd + "&ji=" + jiCd + "&ServiceKey=" + apiKey;
          } else if (type === "recap") {
            apiUrl = "https://apis.data.go.kr/1613000/BldRgstService_v2/getBrRecapTitleInfo?sigunguCd=" + siggCd + "&bjdongCd=" + bjdCd + "&platGbCd=0&bun=" + bunCd + "&ji=" + jiCd + "&ServiceKey=" + apiKey;
          }


          // API 호출 및 데이터 출력
          fetch(apiUrl)
            .then(response => response.text())
            .then(str => {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(str, "text/xml");
              const item = xmlDoc.getElementsByTagName("item")[0];
              const itemData = {
                "건물명": item.getElementsByTagName("bldNm")[0].textContent,
                "용도": item.getElementsByTagName("etcPurps")[0].textContent,
                "주소": item.getElementsByTagName("platPlc")[0].textContent,
                "건축허가일": item.getElementsByTagName("pmsDay")[0].textContent,
                "사용승인일": item.getElementsByTagName("useAprDay")[0].textContent,
                "연면적": item.getElementsByTagName("totArea")[0].textContent + "㎡",
                "건축면적": item.getElementsByTagName("archArea")[0].textContent + "㎡",
                "세대수": item.getElementsByTagName("hhldCnt")[0].textContent,
              };
              let html = "<ul>";
              for (let key in itemData) {
                html += `<li>${key}: ${itemData[key]}</li>`;
              }
              html += "</ul>";
              document.getElementById("api-data").innerHTML = `API 정보: ${html}`;
            })
            .catch(error => {
              console.error(error);
              document.getElementById("api-data").innerHTML = "API 정보를 가져오는 중 오류가 발생했습니다.";
            });


        });
      });
    }
  }).open();
  
  // reset 버튼 클릭 이벤트 리스너 등록
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", function () {
  // 결과 출력 영역 초기화
  const buildingCode = document.getElementById("building-code");
  buildingCode.innerHTML = "";

  // API 응답 데이터 영역 초기화
  const apiData = document.getElementById("api-data");
  apiData.innerHTML = "";

  // 검색어 입력 폼 초기화
  const addressInput = document.getElementById("address-input");
  addressInput.value = "";

  // 각 API 요청 URL 초기화
  const titleApiUrl = document.getElementById("get-br-title-info-btn").setAttribute("data-url", "");
  const recapApiUrl = document.getElementById("get-br-recap-title-info-btn").setAttribute("data-url", "");
});

// 각 API 요청 버튼 클릭 시, 각 API 요청 URL 초기화
document.querySelectorAll('[data-type]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.setAttribute("data-url", "");
  });
  });

  
});


