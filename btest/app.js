//app.js

const submitBtn = document.getElementById("submit-btn");
const submitBtn2 = document.getElementById("submit-btn2");
const submitBtn3 = document.getElementById("submit-btn3");
window.resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");

function createAccordionMenu() {
  const accordions = document.getElementsByClassName("accordion");

  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function () {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      const arrow = this.querySelector(".arrow");
      arrow.classList.toggle("rotate");
    });
  }

  // 동명을 클릭하면 해당 동에 대한 정보를 펼치도록 설정
  const dongNames = document.querySelectorAll(".dong-name");
  for (const dongName of dongNames) {
    dongName.addEventListener("click", function () {
      const unit = this.parentElement.nextElementSibling;
      unit.classList.toggle("active");
      const panel = unit.lastElementChild;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }

  if (accordions.length > 0) {
    accordions[0].classList.add("active");
    const panel = accordions[0].nextElementSibling;
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}


function applyRowDivider(tbody) {
  const rows = tbody.querySelectorAll("tr");
  let groundFloorIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const floorCell = row.querySelector("td:nth-child(2)");

    if (floorCell.textContent === "지상1층") {
      groundFloorIndex = i;
      break;
    }
  }

  if (groundFloorIndex !== -1) {
    for (let i = groundFloorIndex - 5; i >= 0; i -= 5) {
      rows[i].classList.add("row-divider");
    }
  }
}


submitBtn.addEventListener("click", () => {
  loadingDiv.classList.remove("hidden"); // 로딩중 메시지 표시
  resultDiv.innerHTML = ""; // 결과 영역 초기화

  const apiUrl = document.getElementById("url-input").value + "&numOfRows=150";

  fetch(apiUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.getElementsByTagName("item");
      let itemInfo = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const bldNm =
          item.getElementsByTagName("bldNm")[0]?.textContent || "건축물명 없음";
        const dongNm =
          item.getElementsByTagName("dongNm")[0]?.textContent || "동명 없음";
        const archArea = parseInt(
          item.getElementsByTagName("archArea")[0]?.textContent || 0
        );

        const info = {
          주용도:
            item.getElementsByTagName("mainPurpsCdNm")[0]?.textContent ||
            "정보없음",
          기타용도:
            item.getElementsByTagName("etcPurps")[0]?.textContent || "정보없음",
          주소:
            item.getElementsByTagName("platPlc")[0]?.textContent || "정보없음",

          건축허가일:
            item.getElementsByTagName("pmsDay")[0]?.textContent || "정보없음",
          사용승인일:
            item.getElementsByTagName("useAprDay")[0]?.textContent ||
            "정보없음",

          "연면적(㎡)":
            item.getElementsByTagName("totArea")[0]?.textContent || "정보없음",
          "건축면적(㎡)":
            item.getElementsByTagName("archArea")[0]?.textContent || "정보없음",
          세대수:
            item.getElementsByTagName("hhldCnt")[0]?.textContent || "정보없음",

          지상층수:
            item.getElementsByTagName("grndFlrCnt")[0]?.textContent ||
            "정보없음",
          지하층수:
            item.getElementsByTagName("ugrndFlrCnt")[0]?.textContent ||
            "정보없음",
          높이: item.getElementsByTagName("heit")[0]?.textContent || "정보없음",

          건축물구조:
            item.getElementsByTagName("strctCdNm")[0]?.textContent ||
            "정보없음",
          지붕구조:
            item.getElementsByTagName("roofCdNm")[0]?.textContent || "정보없음",

          "승용승강기(대)":
            item.getElementsByTagName("rideUseElvtCnt")[0]?.textContent ||
            "정보없음",
          "비상승강기(대)":
            item.getElementsByTagName("emgenUseElvtCnt")[0]?.textContent ||
            "정보없음",
        };

        // itemInfo에 동일한 bldNm이 존재하는지 검사 후 추가 또는 업데이트
        const index = itemInfo.findIndex(
          (building) => building.bldNm === bldNm
        );
        if (index === -1) {
          itemInfo.push({ bldNm, dongNm, units: [{ dongNm, items: [info] }] });
        } else {
          const unitIndex = itemInfo[index].units.findIndex(
            (unit) => unit.dongNm === dongNm
          );
          if (unitIndex === -1) {
            itemInfo[index].units.push({ dongNm, items: [info] });
          } else {
            itemInfo[index].units[unitIndex].items.push(info);
          }
        }
      }

      // 건축물명을 기준으로 정렬
      itemInfo.sort((a, b) => {
        if (a.bldNm === b.bldNm) {
          return a.dongNm.localeCompare(b.dongNm);
        } else {
          return a.bldNm.localeCompare(b.bldNm);
        }
      });

      // 동명을 기준으로 정렬
      for (const building of itemInfo) {
        building.units.sort((a, b) => a.dongNm.localeCompare(b.dongNm));
      }

      const numItems = items.length;

      let resultHTML = `<h4><strong>해당 주소에 포함된 건축물 수: ${numItems}개</strong></h4>`;
      for (const { bldNm, units } of itemInfo) {
        resultHTML += `<h3>${bldNm}</h3>`;

        for (const { dongNm, items } of units) {
          resultHTML += `<button class="accordion">${dongNm}</button>`;
          resultHTML += `<div class="panel">`;
          for (const info of items) {
            resultHTML += "<ul>";
            for (const [key, value] of Object.entries(info)) {
              resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            }
            resultHTML += "</ul>";
          }
          resultHTML += `</div>`;
        }
      }

      resultDiv.innerHTML = resultHTML;
      loadingDiv.classList.add("hidden");
      createAccordionMenu();
    })
    .catch((error) => {
      resultDiv.innerHTML = "오류가 발생했습니다. 대국에게 문의해주세요";
      console.error(error);
      loadingDiv.classList.add("hidden");
    });
});

submitBtn2.addEventListener("click", () => {
  loadingDiv.classList.remove("hidden"); // 로딩중 메시지 표시
  resultDiv.innerHTML = ""; // 결과 영역 초기화
  const recapUrl = document
    .getElementById("url-input")
    .value.replace("getBrTitleInfo", "getBrRecapTitleInfo");

  fetch(recapUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.getElementsByTagName("item");
      let itemInfo = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const bldNm =
          item.getElementsByTagName("bldNm")[0]?.textContent || "건축물명 없음";
        const archArea = parseInt(
          item.getElementsByTagName("archArea")[0]?.textContent || 0
        );

        const info = {
          주용도:
            item.getElementsByTagName("mainPurpsCdNm")[0]?.textContent ||
            "정보없음",
          기타용도:
            item.getElementsByTagName("etcPurps")[0]?.textContent || "정보없음",
          주소:
            item.getElementsByTagName("platPlc")[0]?.textContent || "정보없음",

          건축허가일:
            item.getElementsByTagName("pmsDay")[0]?.textContent || "정보없음",
          사용승인일:
            item.getElementsByTagName("useAprDay")[0]?.textContent ||
            "정보없음",

          "연면적(㎡)":
            item.getElementsByTagName("totArea")[0]?.textContent || "정보없음",
          세대수:
            item.getElementsByTagName("hhldCnt")[0]?.textContent || "정보없음",
          "건축면적(㎡)":
            item.getElementsByTagName("archArea")[0]?.textContent || "정보없음",

          "주 건축물(개)":
            item.getElementsByTagName("mainBldCnt")[0]?.textContent ||
            "정보없음",
          "부속 건축물(개)":
            item.getElementsByTagName("부속건축물수")[0]?.textContent ||
            "정보없음",
        };

        itemInfo.push({ bldNm, items: [info] });
      }

      let resultHTML = "";
      for (const { bldNm, items } of itemInfo) {
        resultHTML += `<h3>${bldNm}</h3>`;

        for (const info of items) {
          resultHTML += "<ul>";
          for (const [key, value] of Object.entries(info)) {
            resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
          }
          resultHTML += "</ul>";
        }
      }

      resultDiv.innerHTML = resultHTML;
      loadingDiv.classList.add("hidden");
    })
    .catch((error) => {
      resultDiv.innerHTML = "오류가 발생했습니다. 대국에게 문의해주세요";
      console.error(error);
      loadingDiv.classList.add("hidden");
    });
});

function sortFloors(floors) {
  // 지하, 지상 층을 분리
  const undergroundFloors = floors.filter((floor) =>
    floor.flrNoNm.startsWith("지하")
  );
  const abovegroundFloors = floors.filter(
    (floor) => !floor.flrNoNm.startsWith("지하")
  );

  // 각 층을 정렬
  undergroundFloors.sort(
    (a, b) => parseInt(a.flrNoNm.slice(2)) - parseInt(b.flrNoNm.slice(2))
  );
  abovegroundFloors.sort(
    (a, b) =>
      parseInt(b.flrNoNm.slice(0, -1)) - parseInt(a.flrNoNm.slice(0, -1))
  );

  // 결과를 다시 합치기 (지상층이 먼저 출력되도록 변경)
  return abovegroundFloors.concat(undergroundFloors);
}

function fetchApiData(url, pageNo = 1, result = []) {
  const updatedUrl = `${url}&pageNo=${pageNo}`;
  return fetch(updatedUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.getElementsByTagName("item");

      if (items.length === 0) {
        return result;
      } else {
        // 재귀 호출을 통해 다음 페이지를 가져옵니다.
        return fetchApiData(url, pageNo + 1, result.concat(Array.from(items)));
      }
    });
}

submitBtn3.addEventListener("click", () => {
  loadingDiv.classList.remove("hidden"); // 로딩중 메시지 표시
  resultDiv.innerHTML = ""; // 결과 영역 초기화
  const urlInput = document.getElementById("url-input");
  const apiUrl =
    urlInput.value.replace("getBrTitleInfo", "getBrFlrOulnInfo") +
    "&numOfRows=999";

    fetchApiData(apiUrl)
    .then((allItems) => {
      function createTable() {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");
  
        // 테이블 헤더 생성
        const headers = ["구분", "층", "면적", "정보"];
        const tr = document.createElement("tr");
        for (const header of headers) {
          const th = document.createElement("th");
          th.textContent = header;
          tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
  
        // 테이블 바디 생성은 여기에서 삭제합니다.
  
        return { table, tbody };
      }

      let groupedData = {};

      for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        const bldNm =
          item.getElementsByTagName("bldNm")[0]?.textContent || "정보없음";
        const dongNm =
          item.getElementsByTagName("dongNm")[0]?.textContent || "정보없음";
        const flrGbCdNm =
          item.getElementsByTagName("flrGbCdNm")[0]?.textContent || "정보없음";
        const flrNoNm =
          item.getElementsByTagName("flrNoNm")[0]?.textContent || "정보없음";
        const area =
          item.getElementsByTagName("area")[0]?.textContent || "정보없음";
        const mainPurpsCd =
          item.getElementsByTagName("mainPurpsCd")[0]?.textContent ||
          "정보없음";
        const mainPurpsCdNm =
          item.getElementsByTagName("mainPurpsCdNm")[0]?.textContent ||
          "정보없음";
        const etcPurps =
          item.getElementsByTagName("etcPurps")[0]?.textContent || "정보없음";

        if (!groupedData[bldNm]) {
          groupedData[bldNm] = {};
        }

        if (!groupedData[bldNm][dongNm]) {
          groupedData[bldNm][dongNm] = [];
        }

        groupedData[bldNm][dongNm].push({
          flrGbCdNm,
          flrNoNm,
          area,
          mainPurpsCd,
          mainPurpsCdNm,
          etcPurps,
        });
      }

      if (Object.keys(groupedData).length > 0) {
        for (const bldNm in groupedData) {
          const bldTitle = document.createElement("h2");
          bldTitle.textContent = `${bldNm}`;
          resultDiv.appendChild(bldTitle);

          // 동명을 정렬하기 위한 코드 추가
          const sortedDongNames = Object.keys(groupedData[bldNm]).sort();

          for (const dongNm of sortedDongNames) {
            const buildingData = groupedData[bldNm][dongNm];
            const title = document.createElement("button");
            title.textContent = `${dongNm}`;
            title.classList.add("accordion");
            resultDiv.appendChild(title);

            const { table, tbody } = createTable();

            applyRowDivider(tbody);

            const sortedFloors = sortFloors(buildingData);
            for (const {
              flrGbCdNm,
              flrNoNm,
              area,
              mainPurpsCdNm,
              etcPurps,
              mainBldCnt,
            } of sortedFloors) {
              const tr = document.createElement("tr");

              // 지상과 지하층 구분을 위한 속성 추가
              if (flrNoNm === "지상1층" || flrNoNm === "지하1층") {
                tr.setAttribute("data-divider", "true");
              }

              // 지상 1층이 포함된 행에 특정 클래스를 추가
              if (flrNoNm === "지상1층") {
                tr.classList.add("ground-floor");
              }

              const td1 = document.createElement("td");
              td1.textContent = flrGbCdNm;
              tr.appendChild(td1);

              const td2 = document.createElement("td");
              td2.textContent = flrNoNm;
              tr.appendChild(td2);

              const td3 = document.createElement("td");
              td3.textContent = area;
              tr.appendChild(td3);

              const td4 = document.createElement("td");
              td4.textContent = [
                mainPurpsCdNm || "",
                etcPurps || "",
                mainBldCnt || "",
              ]
                .filter((value) => value)
                .join(", ");
              tr.appendChild(td4);

              tbody.appendChild(tr);
            }
            table.appendChild(tbody);

            const panel = document.createElement("div");
            panel.classList.add("panel");
            panel.appendChild(table);
            resultDiv.appendChild(panel);

            title.addEventListener("click", function () {
              this.classList.toggle("active");
              const panel = this.nextElementSibling;
              if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
              } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
              }
            });
          }
        }
      }
    })
    .catch((error) => {
      resultDiv.innerHTML = "오류가 발생했습니다. 다시 시도해주세요.";
      console.error(error);
    })
    .finally(() => {
      loadingDiv.classList.add("hidden");
    });
});
