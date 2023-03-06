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

      var apiUrl1 = "https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?sigunguCd=" + siggCd + "&bjdongCd=" + bjdCd + "&platGbCd=0&bun=" + bunCd + "&ji=" + jiCd + "&ServiceKey=" + apiKey;
      document.getElementById("api-url").innerHTML = "API URL: " + apiUrl1;
      var apiUrl2 = "https://apis.data.go.kr/1613000/BldRgstService_v2/getBrRecapTitleInfo?sigunguCd=" + siggCd + "&bjdongCd=" + bjdCd + "&platGbCd=0&bun=" + bunCd + "&ji=" + jiCd + "&ServiceKey=" + apiKey;
  
      fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(data, "text/xml");
          var item = xmlDoc.getElementsByTagName("item")[0];
          var itemData = {
            "건물명": item.getElementsByTagName("bldNm")[0].textContent,
            "용도": item.getElementsByTagName("etcPurps")[0].textContent,
            "주소": item.getElementsByTagName("platPlc")[0].textContent,
            "건축허가일": item.getElementsByTagName("pmsDay")[0].textContent,
            "사용승인일": item.getElementsByTagName("useAprDay")[0].textContent,
            "연면적": item.getElementsByTagName("totArea")[0].textContent + "㎡",
            "건축면적": item.getElementsByTagName("archArea")[0].textContent + "㎡",
            "세대수": item.getElementsByTagName("hhldCnt")[0].textContent,
          };
          var html = "<ul>";
          for (var key in itemData) {
            html += "<li>" + key + ": " + itemData[key] + "</li>";
          }
          html += "</ul>";
          document.getElementById("api-data").innerHTML = "API 정보:" + html;
        })
        .catch(error => {
          console.error(error);
          fetch(apiUrl2)
            .then(response2 => response2.text())
            .then(data2 => {
              var parser2 = new DOMParser();
              var xmlDoc2 = parser2.parseFromString(data2, "text/xml");
              var item2 = xmlDoc2.getElementsByTagName("item")[0];
              var itemData2 = {
                "건물명": item2.getElementsByTagName("bldNm")[0].textContent,
                "용도": item2.getElementsByTagName("etcPurps")[0].textContent,
                "주소": item2.getElementsByTagName("platPlc")[0].textContent,
                "건축허가일": item2.getElementsByTagName("pmsDay")[0].textContent,
                "사용승인일": item2.getElementsByTagName("useAprDay")[0].textContent,
                "연면적": item2.getElementsByTagName("totArea")[0].textContent + "㎡",
                "건축면적": item2.getElementsByTagName("archArea")[0].textContent + "㎡",
                "세대수": item2.getElementsByTagName("hhldCnt")[0].textContent,
              };
              var html2 = "<ul>";
              for (var key in itemData2) {
                html2 += "<li>" + key + ": " + itemData2[key] + "</li>";
              }
              html2 += "</ul>";
              document.getElementById("api-data").innerHTML = "API 정보:" + html2;
            })
            .catch(error2 => {
              console.error(error2);
              document.getElementById("api-data").innerHTML = "API 정보를 가져오는 중 오류가 발생했습니다.";
            });
        });
    }
  }).open();
});