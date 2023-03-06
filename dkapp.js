document.getElementById("search-btn").addEventListener("click", function() {
  new daum.Postcode({
    oncomplete: function(data) {
      var buildingCode = data.buildingCode;
      document.getElementById("address-input").value = data.address;
      document.getElementById("building-code").innerHTML = "건물 코2드: " + buildingCode;

      var apiKey = "5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D";
      var siggCd = buildingCode.substr(0, 5);
      var bjdCd = buildingCode.substr(5, 5);
      var bunCd = buildingCode.substr(11, 4);
      var jiCd = buildingCode.substr(15, 4);
      var apiUrl = "https://apis.data.go.kr/1613000/BldRgstService_v2/getBrRecapTitleInfo?sigunguCd=" + siggCd + "&bjdongCd=" + bjdCd + "&platGbCd=0&bun=" + bunCd + "&ji=" + jiCd + "&ServiceKey=" + apiKey;
      document.getElementById("api-url").innerHTML = "API URL: " + apiUrl;

      fetch(apiUrl)
      .then(response => response.text())
      .then(data => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, "text/xml");
        var item = xmlDoc.getElementsByTagName("item")[0];
        var itemData = {};
        if (item) {
          itemData = {
            "건물명": item.getElementsByTagName("bldNm")[0].textContent,
            "용도": item.getElementsByTagName("etcPurps")[0].textContent,
            "주소": item.getElementsByTagName("platPlc")[0].textContent,
            "건축허가일": item.getElementsByTagName("pmsDay")[0].textContent,
            "사용승인일": item.getElementsByTagName("useAprDay")[0].textContent,
            "연면적": item.getElementsByTagName("totArea")[0].textContent + "㎡",
            "건축면적": item.getElementsByTagName("archArea")[0].textContent + "㎡",
            "세대수": item.getElementsByTagName("hhldCnt")[0].textContent,
            "지상층수": item.getElementsByTagName("grndFlrCnt")[0].textContent,
            "지하층수": item.getElementsByTagName("ugrndFlrCnt")[0].textContent,
            "건축물구조": item.getElementsByTagName("strctCdNm")[0].textContent,
            "지붕구조": item.getElementsByTagName("etcRoof")[0].textContent,
            "승용승강기": item.getElementsByTagName("rideUseElvtCnt")[0].textContent + "대",
            "비상용승강기": item.getElementsByTagName("emgenUseElvtCnt")[0].textContent + "대"
          };
        } else {
          itemData = {
            "건물명": "정보 없음",
            "용도": "정보 없음",
            "주소": "정보 없음",
            "건축허가일": "정보 없음",
            "사용승인일": "정보 없음",
            "연면적": "정보 없음",
            "건축면적": "정보 없음",
            "세대수": "정보 없음",
            "지상/지하층수": "정보 없음",
            "건축물구조": "정보 없음",
            "지붕구조": "정보 없음",
            "승강기(승용/비상)": "정보 없음"
          };
        }
        var html = "<ul>";
        for (var key in itemData) {
          html += "<li>" + key + ": " + itemData[key] + "</li>";
        }
        html += "</ul>";
        document.getElementById("api-data").innerHTML = "API 정보:" + html;
      })
      .catch(error => {
        console.error(error);
        document.getElementById("api-data").innerHTML = "API 정보를 가져오는 중 오류가 발생했습니다.";
      });




    }
  }).open();
});
