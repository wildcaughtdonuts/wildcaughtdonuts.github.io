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

submitBtn.addEventListener("click", () => {
  loadingDiv.classList.remove("hidden"); // 로딩중 메시지 표시
  resultDiv.innerHTML = ""; // 결과 영역 초기화

  const apiUrl = document.getElementById("url-input").value;

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
  const undergroundFloors = floors.filter((floor) => floor.flrNoNm.startsWith("지하"));
  const abovegroundFloors = floors.filter((floor) => !floor.flrNoNm.startsWith("지하"));

  // 각 층을 오름차순으로 정렬
  undergroundFloors.sort((a, b) => parseInt(a.flrNoNm.slice(2)) - parseInt(b.flrNoNm.slice(2)));
  abovegroundFloors.sort((a, b) => parseInt(a.flrNoNm.slice(0, -1)) - parseInt(b.flrNoNm.slice(0, -1)));

  // 결과를 다시 합치기
  return undergroundFloors.concat(abovegroundFloors);
}



submitBtn3.addEventListener("click", () => {
  loadingDiv.classList.remove("hidden"); // 로딩중 메시지 표시
  resultDiv.innerHTML = ""; // 결과 영역 초기화
  const urlInput = document.getElementById("url-input");
  const apiUrl = urlInput.value.replace("getBrTitleInfo", "getBrFlrOulnInfo");

  fetch(apiUrl)
    .then((response) => response.text())
    .then((data) => {
      function createTable(buildingData) {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        // 테이블 헤더 생성
        const headers = [
          "구분",
          "층",
          "면적",
          "주용도",
          "기타용도",
          "주건축물",
        ];
        const tr = document.createElement("tr");
        for (const header of headers) {
          const th = document.createElement("th");
          th.textContent = header;
          tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        // 테이블 바디 생성
        for (const {
          flrGbCdNm,
          flrNoNm,
          area,
          mainPurpsCdNm,
          etcPurps,
          mainBldCnt,
        } of buildingData) {
          const tr = document.createElement("tr");

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
          td4.textContent = mainPurpsCdNm;
          tr.appendChild(td4);

          const td5 = document.createElement("td");
          td5.textContent = etcPurps;
          tr.appendChild(td5);

          const td6 = document.createElement("td");
          td6.textContent = mainBldCnt;
          tr.appendChild(td6);

          tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        resultDiv.appendChild(table);
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.getElementsByTagName("item");
      let groupedData = {};

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const bldNm = item.getElementsByTagName("bldNm")[0]?.textContent || "정보없음";
        const dongNm = item.getElementsByTagName("dongNm")[0]?.textContent || "정보없음";
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
          bldTitle.textContent = `건축물명: ${bldNm}`;
          resultDiv.appendChild(bldTitle);
      
          for (const dongNm in groupedData[bldNm]) {
            const buildingData = groupedData[bldNm][dongNm];
            const title = document.createElement("h3");
            title.textContent = `동명: ${dongNm}`;
            resultDiv.appendChild(title);
      
            const sortedFloors = sortFloors(buildingData); // 위치 변경
            createTable(sortedFloors); // 위치 변경
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
