document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search-btn");
  const mapResultDiv = document.getElementById("mapResult");

  const API_KEY = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D";
  const BASE_URL = "https://apis.data.go.kr/1613000/BldRgstHubService";

  searchBtn.addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: function (data) {
        if (!data.buildingCode) {
          mapResultDiv.innerHTML = `<p>건물 코드가 없습니다. 다시 검색해주세요.</p>`;
          return;
        }

        document.getElementById("url-input").value = BASE_URL + "?serviceKey=" + API_KEY;
        mapResultDiv.innerHTML = `<p>주소 불러오기에 성공했습니다.<br>아래 버튼을 눌러주세요.</p>`;
      },
    }).open();
  });
});
