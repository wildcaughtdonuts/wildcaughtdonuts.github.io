// adress.js 업데이트: 새로운 건축HUB API 적용

document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const mapResultDiv = document.getElementById("mapResult");
    const urlInput = document.getElementById("url-input");

    // ✅ 최신 API 적용 (Encoding된 API Key 사용)
    const API_KEY = encodeURIComponent("imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D");
    const BASE_URL = "https://apis.data.go.kr/1613000/BldRgstHubService";

    searchBtn.addEventListener("click", () => {
        console.log("🔍 주소 검색 버튼 클릭됨");

        new daum.Postcode({
            oncomplete: function (data) {
                console.log("✅ Daum API 응답 데이터:", data);

                if (!data.buildingCode) {
                    mapResultDiv.innerHTML = `<p>⚠️ 건물 코드가 없습니다. 다시 검색해주세요.</p>`;
                    return;
                }

                // 🔹 `buildingCode`에서 API 요청에 필요한 값 추출
                const sigunguCd = data.buildingCode.substr(0, 5);
                const bjdongCd = data.buildingCode.substr(5, 5);
                let bunCd = data.buildingCode.substr(10, 4).padStart(4, "0");
                let jiCd = data.buildingCode.substr(14, 4).padStart(4, "0");

                console.log(`🔍 변환된 시군구코드: ${sigunguCd}`);
                console.log(`🔍 변환된 법정동코드: ${bjdongCd}`);
                console.log(`🔍 변환된 번지: ${bunCd}, 지번: ${jiCd}`);

                // 🔹 새로운 API 엔드포인트 적용
                const apiUrl = `${BASE_URL}/getBrTitleInfo?sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;
                
                // 🔹 URL을 `url-input`에 설정
                urlInput.value = apiUrl;
                console.log("✅ API URL 설정 완료:", apiUrl);

                mapResultDiv.innerHTML = `<p>✅ 주소 불러오기에 성공했습니다.<br>아래 버튼을 눌러 건축물 정보를 조회하세요.</p>`;
            },
            onclose: function () {
                console.log("❌ 주소 검색 창이 닫혔습니다.");
            }
        }).open();
    });
});
