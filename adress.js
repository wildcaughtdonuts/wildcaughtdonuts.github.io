document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const mapResultDiv = document.getElementById("mapResult");
    const urlInput = document.getElementById("url-input");

    // 🔹 API 기본 정보
    const API_KEY = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D";
    const BASE_URL = "https://apis.data.go.kr/1613000/BldRgstHubService";

    searchBtn.addEventListener("click", () => {
        console.log("🔍 주소 검색 버튼 클릭됨");

        new daum.Postcode({
            oncomplete: function (data) {
                console.log("✅ 주소 검색 결과:", data);

                if (!data.buildingCode) {
                    mapResultDiv.innerHTML = `<p>⚠️ 건물 코드가 없습니다. 다시 검색해주세요.</p>`;
                    return;
                }

                // 🔹 `buildingCode`를 분해하여 API 요청 파라미터 설정
                const sigunguCd = data.buildingCode.substr(0, 5); // 시군구 코드
                const bjdongCd = data.buildingCode.substr(5, 5);  // 법정동 코드
                let bunCd = data.buildingCode.substr(10, 4).replace(/^0+/, ""); // 번지 앞 0 제거
                let jiCd = data.buildingCode.substr(14, 4).replace(/^0+/, "");  // 지번 앞 0 제거

                console.log(`🔍 변환된 시군구코드: ${sigunguCd}, 법정동코드: ${bjdongCd}, 번지: ${bunCd}, 지번: ${jiCd}`);

                // 🔹 API URL 생성 (unifiedCd 제거하고 sigunguCd 사용)
                const apiUrl = `${BASE_URL}/getBrTitleInfo?sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;
                const recapUrl = `${BASE_URL}/getBrRecapTitleInfo?sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;
                const flrUrl = `${BASE_URL}/getBrFlrOulnInfo?sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;

                // 🔹 URL을 `url-input`에 설정
                urlInput.value = apiUrl;
                console.log("✅ API URL 설정 완료:", apiUrl);

                // 🔹 사용자에게 검색 완료 메시지 표시
                mapResultDiv.innerHTML = `<p>✅ 주소 불러오기에 성공했습니다.<br>아래 버튼을 눌러 건축물 정보를 조회하세요.</p>`;
            },
            onclose: function () {
                console.log("❌ 주소 검색 창이 닫혔습니다.");
            }
        }).open();
    });
});
