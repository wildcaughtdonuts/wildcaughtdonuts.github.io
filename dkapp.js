document.getElementById("search-btn").addEventListener("click", function() {
  new daum.Postcode({
    oncomplete: function(data) {
      var buildingCode = data.buildingCode;
      document.getElementById("address-input").value = data.address;
      document.getElementById("building-code").innerHTML = "건물 코드: " + buildingCode;
      
      var apiKey = "5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D";
      var siggCd = buildingCode.substr(0, 5);
      var bjdCd = buildingCode.substr(5, 5);
      var bunCd = buildingCode.substr(11, 4);
      var jiCd = buildingCode.substr(15, 4);
      var apiUrl = "https://apis.data.go.kr/1613000/BldRgstService_v2/getBrBasisOulnInfo?sigunguCd=" + siggCd + "&bjdongCd=" + bjdCd + "&platGbCd=0&bun=" + bunCd + "&ji=" + jiCd + "&ServiceKey=" + apiKey;
      document.getElementById("api-url").innerHTML = "API URL: " + apiUrl;
      
      fetch(apiUrl)
  .then(response => response.text())
  .then(data => {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(data, "text/xml");
    var items = xmlDoc.getElementsByTagName("item")[0];
    var itemData = {};
    if (items.getElementsByTagName("mainPurpsCdNm").length > 0) {
      itemData["주용도"] = items.getElementsByTagName("mainPurpsCdNm")[0].textContent;
    }
    if (items.getElementsByTagName("purpsCdNm").length > 0) {
      itemData["용도"] = items.getElementsByTagName("purpsCdNm")[0].textContent;
    }
    if (items.getElementsByTagName("bcRgstKindCdNm").length > 0) {
      itemData["구조"] = items.getElementsByTagName("bcRgstKindCdNm")[0].textContent;
    }
    if (items.getElementsByTagName("archArea").length > 0) {
      itemData["면적"] = items.getElementsByTagName("archArea")[0].textContent + "㎡";
    }
    if (items.getElementsByTagName("hhldCnt").length > 0) {
      itemData["층수"] = items.getElementsByTagName("hhldCnt")[0].textContent + "층";
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
