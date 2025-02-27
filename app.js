// app.js 업데이트: 중복 API Key 문제 해결 및 JSON 응답 처리 개선

document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submit-btn");
    const submitBtn2 = document.getElementById("submit-btn2");
    const submitBtn3 = document.getElementById("submit-btn3");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const urlInput = document.getElementById("url-input");

    // ✅ 최신 API 적용 (Encoding된 API Key 사용)
    const API_KEY = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg==";

    async function fetchApiData(apiUrl) {
        console.log(`🔍 API 요청 실행: ${apiUrl}`);
        
        try {
            const response = await fetch(`${apiUrl}&_type=json`);
            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
            }
            const text = await response.text();
            
            try {
                const data = JSON.parse(text);
                if (!data.response || !data.response.body || !data.response.body.items) {
                    console.warn("⚠️ 데이터가 없음", data);
                    return [];
                }
                return data.response.body.items.item || [];
            } catch (error) {
                console.error("❌ JSON 파싱 오류:", text);
                alert("❌ API 응답이 JSON 형식이 아닙니다. API Key 또는 요청 형식을 확인하세요.");
                return [];
            }
        } catch (error) {
            console.error("❌ API 요청 실패:", error);
            alert("❌ API 요청 실패: 다시 시도해 주세요.");
            return [];
        }
    }

    async function fetchBuildingData(apiType) {
        loadingDiv.classList.remove("hidden");
        resultDiv.innerHTML = "";

        if (!urlInput.value) {
            alert("⚠️ 주소 검색을 먼저 실행해주세요!");
            loadingDiv.classList.add("hidden");
            return;
        }

        try {
            let apiUrl = urlInput.value.replace("getBrTitleInfo", apiType);
            apiUrl = apiUrl.replace(/&serviceKey=.*?(&|$)/, "&") + `&serviceKey=${API_KEY}`;
            console.log(`🔍 API 요청 URL: ${apiUrl}`);

            const allItems = await fetchApiData(apiUrl);
            if (allItems.length === 0) {
                resultDiv.innerHTML = "⚠️ 해당 주소에 대한 건축물 정보가 없습니다.";
                return;
            }

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
            resultDiv.innerHTML = "❌ 오류가 발생했습니다. 다시 시도해주세요.";
            console.error("❌ API 요청 실패:", error);
        } finally {
            loadingDiv.classList.add("hidden");
        }
    }

    submitBtn.addEventListener("click", () => fetchBuildingData("getBrTitleInfo"));
    submitBtn2.addEventListener("click", () => fetchBuildingData("getBrRecapTitleInfo"));
    submitBtn3.addEventListener("click", () => fetchBuildingData("getBrFlrOulnInfo"));
});
