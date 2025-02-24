document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search-btn");
  const mapResultDiv = document.getElementById("mapResult");

  const API_KEY = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D";
  const BASE_URL = "https://apis.data.go.kr/1613000/BldRgstHubService";

  if (!searchBtn) {
    console.error("❌ 검색 버튼을 찾을 수 없습니다. HTML 파일을 확인하세요.");
    return;
  }

  searchBtn.addEventListener("click", () => {
    console.log("🔍 주소 검색 버튼 클릭됨"); // 버튼 클릭 여부 확인용 로그

    new daum.Postcode({
      oncomplete: function (data) {
        console.log("✅ 주소 검색 결과:", data);

        if (!data.buildingCode) {
          mapResultDiv.innerHTML = `<p>건물 코드가 없습니다. 다시 검색해주세요.</p>`;
          return;
        }

        const siggCd = data.buildingCode.substr(0, 5);
        const bjdCd = data.buildingCode.substr(5, 5);
        const bunCd = data.buildingCode.substr(10, 4);
        const jiCd = data.buildingCode.substr(14, 4);

        const queryParams = `?serviceKey=${API_KEY}&sigunguCd=${siggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}`;

        const apiUrl = `${BASE_URL}/getBrTitleInfo${queryParams}`;
        const recapUrl = `${BASE_URL}/getBrRecapTitleInfo${queryParams}`;
        const flrUrl = `${BASE_URL}/getBrFlrOulnInfo${queryParams}`;

        mapResultDiv.innerHTML = `<p>주소 불러오기에 성공했습니다.<br>아래 버튼을 눌러주세요.</p>`;

        document.getElementById("url-input").value = apiUrl;
      },
    }).open();
  });
});
