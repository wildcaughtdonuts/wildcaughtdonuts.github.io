document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submit-btn");
    const submitBtn2 = document.getElementById("submit-btn2");
    const submitBtn3 = document.getElementById("submit-btn3");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const urlInput = document.getElementById("url-input");

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

    // ✅ API 데이터 요청 함수 (페이지네이션 지원)
    async function fetchApiData(apiUrl) {
        let pageNo = 1;
        let hasNextPage = true;
        let allItems = [];

        while (hasNextPage) {
            const response = await fetch(`${apiUrl}&pageNo=${pageNo}`);
            const data = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");
            const items = xmlDoc.getElementsByTagName("item");

            if (items.length > 0) {
                allItems.push(...items);
                pageNo++;
            } else {
                hasNextPage = false;
            }
        }

        return allItems;
    }

    // ✅ 공통 API 요청 함수
    async function fetchBuildingData(apiType) {
        loadingDiv.classList.remove("hidden");
        resultDiv.innerHTML = "";

        if (!urlInput.value) {
            alert("⚠️ 주소 검색을 먼저 실행해주세요!");
            loadingDiv.classList.add("hidden");
            return;
        }

        try {
            const apiUrl = `${urlInput.value}/${apiType}?serviceKey=${API_KEY}&numOfRows=150`;
            const allItems = await fetchApiData(apiUrl);
            let resultHTML = `<h4><strong>조회 결과: ${allItems.length}개</strong></h4>`;

            for (const item of allItems) {
                const bldNm = item.getElementsByTagName("bldNm")[0]?.textContent || "건축물명 없음";
                const mainPurpsCdNm = item.getElementsByTagName("mainPurpsCdNm")[0]?.textContent || "정보없음";
                const totArea = item.getElementsByTagName("totArea")[0]?.textContent || "정보없음";
                const platPlc = item.getElementsByTagName("platPlc")[0]?.textContent || "정보없음";
                
                resultHTML += `<h3>${bldNm}</h3>
                    <ul>
                        <li><strong>주용도:</strong> ${mainPurpsCdNm}</li>
                        <li><strong>주소:</strong> ${platPlc}</li>
                        <li><strong>연면적(㎡):</strong> ${totArea}</li>
                    </ul>`;
            }

            resultDiv.innerHTML = resultHTML;
        } catch (error) {
            resultDiv.innerHTML = "오류가 발생했습니다. 다시 시도해주세요.";
            console.error(error);
        } finally {
            loadingDiv.classList.add("hidden");
        }
    }

    // ✅ 버튼 1: 건축물 기본 정보 조회
    submitBtn.addEventListener("click", () => fetchBuildingData("getBrTitleInfo"));

    // ✅ 버튼 2: 건축물 요약 정보 조회
    submitBtn2.addEventListener("click", () => fetchBuildingData("getBrRecapTitleInfo"));

    // ✅ 버튼 3: 층별 개요 정보 조회
    submitBtn3.addEventListener("click", () => fetchBuildingData("getBrFlrOulnInfo"));
});
