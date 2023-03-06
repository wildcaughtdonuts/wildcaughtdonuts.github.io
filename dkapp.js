fetch(apiUrl)
  .then(response => response.text())
  .then(data => {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(data, "text/xml");
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemData = Object.assign({}, { "bldNm": item.getElementsByTagName("bldNm")[0]?.textContent ?? "-" });
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
