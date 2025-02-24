document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const mapResultDiv = document.getElementById("mapResult");
    const urlInput = document.getElementById("url-input");

    // 🔹 API 기본 정보
    const API_KEY = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D";
    const BASE_URL = "https://apis.data.go.kr/1613000/BldRgstHubService";

    let unifiedCodeMap = {};

    // 🔹 JSON 파일에서 통합분류코드 데이터 로드
    fetch("./unifiedCodes.json")
        .then(response => response.json())
        .then(data => {
            unifiedCodeMap = data;
            console.log("✅ 통합분류코드 매핑 데이터 로드 완료");
        })
        .catch(error => console.error("❌ 통합분류코드 데이터 로드 실패:", error));

    // 🔹 시군구코드 → 통합분류코드 변환 함수
    function getUnifiedCode(sigunguCd) {
        return unifiedCodeMap[sigunguCd] || sigunguCd;  // 매핑 데이터가 있으면 변환
    }

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
                const bjdCd = data.buildingCode.substr(5, 5);  // 법정동 코드
                const bunCd = data.buildingCode.substr(10, 4); // 번지 코드
                const jiCd = data.buildingCode.substr(14, 4);  // 지번 코드

                // 🔹 통합분류코드 변환
                const unifiedCd = getUnifiedCode(sigunguCd);

                // 🔹 API URL 생성
                const apiUrl = `${BASE_URL}/getBrTitleInfo?unifiedCd=${unifiedCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;
                const recapUrl = `${BASE_URL}/getBrRecapTitleInfo?unifiedCd=${unifiedCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;
                const flrUrl = `${BASE_URL}/getBrFlrOulnInfo?unifiedCd=${unifiedCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&serviceKey=${API_KEY}`;

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
