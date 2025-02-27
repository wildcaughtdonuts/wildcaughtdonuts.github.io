document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submit-btn");
    const submitBtn2 = document.getElementById("submit-btn2");
    const submitBtn3 = document.getElementById("submit-btn3");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const urlInput = document.getElementById("url-input");

    async function fetchApiData(apiUrl) {
        const fixedApiUrl = apiUrl.replace(/&serviceKey=.*?(&|$)/, "&") + 
                            "serviceKey=imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg==&_type=json";

        try {
            console.log(`🔍 API 요청 실행: ${fixedApiUrl}`);
            const response = await fetch(fixedApiUrl);
            const text = await response.text();
            console.log("📥 API 응답 원본:", text);

            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error("❌ API 요청 오류:", error);
            alert("API 요청 실패: API Key 또는 요청 형식을 확인하세요.");
            return null;
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
            const apiUrl = urlInput.value.replace("getBrTitleInfo", apiType);
            console.log(`🔍 API 요청 URL: ${apiUrl}`);

            const allItems = await fetchApiData(apiUrl);
            let resultHTML = `<h4><strong>조회 결과: ${allItems?.response?.body?.totalCount || 0}개</strong></h4>`;

            if (!allItems || !allItems.response || !allItems.response.body || !allItems.response.body.items) {
                resultDiv.innerHTML = "<p>데이터를 찾을 수 없습니다.</p>";
                return;
            }

            let items = allItems.response.body.items.item || [];
            if (!Array.isArray(items)) items = [items];

            for (const item of items) {
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

    submitBtn.addEventListener("click", () => fetchBuildingData("getBrTitleInfo"));
    submitBtn2.addEventListener("click", () => fetchBuildingData("getBrRecapTitleInfo"));
    submitBtn3.addEventListener("click", () => fetchBuildingData("getBrFlrOulnInfo"));
});
