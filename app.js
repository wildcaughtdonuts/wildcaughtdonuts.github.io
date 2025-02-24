document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submit-btn");
    const submitBtn2 = document.getElementById("submit-btn2");
    const submitBtn3 = document.getElementById("submit-btn3");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const urlInput = document.getElementById("url-input");

    // ✅ Encoding된 API 키 적용
    const API_KEY = encodeURIComponent("imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D");

    // ✅ API 데이터 요청 함수
    async function fetchApiData(apiUrl) {
        let pageNo = 1;
        let allItems = [];
        let totalCount = Infinity;

        while (true) {
            console.log(`🔍 API 요청 실행 (페이지: ${pageNo}): ${apiUrl}&pageNo=${pageNo}`);
            
            try {
                const response = await fetch(`${apiUrl}&pageNo=${pageNo}&_type=json`);
                const data = await response.json();

                if (!data.response || !data.response.body) {
                    console.error("❌ API 응답 오류: body가 없음", data);
                    break;
                }

                if (pageNo === 1) {
                    totalCount = parseInt(data.response.body.totalCount, 10) || 0;
                    console.log(`🔍 총 데이터 개수: ${totalCount}`);
                    if (totalCount === 0) {
                        console.warn("⚠️ API 응답에 데이터가 없음 (totalCount = 0)");
                        break;
                    }
                }

                let items = data.response.body.items?.item || [];
                if (!Array.isArray(items)) {
                    items = [items]; // 단일 객체일 경우 배열로 변환
                }

                allItems.push(...items);
                console.log(`📌 페이지 ${pageNo} 처리 완료, 누적 데이터: ${allItems.length}`);

                if (allItems.length >= totalCount || items.length === 0) {
                    break;
                }

                pageNo++;
            } catch (error) {
                console.error("❌ API 요청 중 오류 발생:", error);
                break;
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
            // URL 변경: 기존 "getBrTitleInfo"을 원하는 apiType으로 대체
            const apiUrl = `${urlInput.value.replace("getBrTitleInfo", apiType)}&numOfRows=150&serviceKey=${API_KEY}`;
            console.log(`🔍 API 요청 URL: ${apiUrl}`);

            const allItems = await fetchApiData(apiUrl);
            let resultHTML = `<h4><strong>조회 결과: ${allItems.length}개</strong></h4>`;

            for (const item of allItems) {
                const bldNm = item.bldNm || "건축물명 없음";
                const mainPurpsCdNm = item.mainPurpsCdNm || "정보없음";
                const totArea = item.totArea || "정보없음";
                const platPlc = item.platPlc || "정보없음";

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
            console.error("❌ API 요청 실패:", error);
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
