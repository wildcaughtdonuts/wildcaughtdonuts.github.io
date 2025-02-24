const submitBtn = document.getElementById("submit-btn");
const submitBtn2 = document.getElementById("submit-btn2");
const submitBtn3 = document.getElementById("submit-btn3");
const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");

const API_KEY = "imXssiU8dEJ91x2cVSMl3TSW97VrK7cZpGXX5k9pEWgXyzuqmIAwpi9WTa29qcJek2OvrRClAXw0HrzKAlxIhg%3D%3D";
const BASE_URL = "https://apis.data.go.kr/1613000/BldRgstHubService";

// ✅ API 데이터 요청 함수
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

// ✅ 버튼 1: 건축물 기본 정보 조회
submitBtn.addEventListener("click", async () => {
  loadingDiv.classList.remove("hidden");
  resultDiv.innerHTML = "";

  const urlInput = document.getElementById("url-input").value;
  if (!urlInput) {
    alert("⚠️ 주소 검색을 먼저 실행해주세요!");
    loadingDiv.classList.add("hidden");
    return;
  }

  try {
    const allItems = await fetchApiData(`${urlInput}/getBrTitleInfo?serviceKey=${API_KEY}&numOfRows=150`);
    let resultHTML = `<h4><strong>건축물 수: ${allItems.length}개</strong></h4>`;

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
});

// ✅ 버튼 2: 건축물 요약 정보 조회
submitBtn2.addEventListener("click", async () => {
  loadingDiv.classList.remove("hidden");
  resultDiv.innerHTML = "";

  const urlInput = document.getElementById("url-input").value;
  if (!urlInput) {
    alert("⚠️ 주소 검색을 먼저 실행해주세요!");
    loadingDiv.classList.add("hidden");
    return;
  }

  try {
    const allItems = await fetchApiData(`${urlInput}/getBrRecapTitleInfo?serviceKey=${API_KEY}&numOfRows=150`);
    let resultHTML = "";

    for (const item of allItems) {
      const bldNm = item.getElementsByTagName("bldNm")[0]?.textContent || "건축물명 없음";
      const mainBldCnt = item.getElementsByTagName("mainBldCnt")[0]?.textContent || "정보없음";
      const totArea = item.getElementsByTagName("totArea")[0]?.textContent || "정보없음";

      resultHTML += `<h3>${bldNm}</h3>
        <ul>
          <li><strong>주 건축물 수:</strong> ${mainBldCnt}</li>
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
});

// ✅ 버튼 3: 층별 개요 정보 조회
submitBtn3.addEventListener("click", async () => {
  loadingDiv.classList.remove("hidden");
  resultDiv.innerHTML = "";

  const urlInput = document.getElementById("url-input").value;
  if (!urlInput) {
    alert("⚠️ 주소 검색을 먼저 실행해주세요!");
    loadingDiv.classList.add("hidden");
    return;
  }

  try {
    const allItems = await fetchApiData(`${urlInput}/getBrFlrOulnInfo?serviceKey=${API_KEY}&numOfRows=150`);
    let resultHTML = "";

    for (const item of allItems) {
      const bldNm = item.getElementsByTagName("bldNm")[0]?.textContent || "건축물명 없음";
      const flrNoNm = item.getElementsByTagName("flrNoNm")[0]?.textContent || "정보없음";
      const area = item.getElementsByTagName("area")[0]?.textContent || "정보없음";

      resultHTML += `<h3>${bldNm}</h3>
        <ul>
          <li><strong>층 정보:</strong> ${flrNoNm}</li>
          <li><strong>층별 면적(㎡):</strong> ${area}</li>
        </ul>`;
    }

    resultDiv.innerHTML = resultHTML;
  } catch (error) {
    resultDiv.innerHTML = "오류가 발생했습니다. 다시 시도해주세요.";
    console.error(error);
  } finally {
    loadingDiv.classList.add("hidden");
  }
});
