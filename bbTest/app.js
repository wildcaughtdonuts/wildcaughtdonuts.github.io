//app.js

const submitBtn = document.getElementById('submit-btn');
const submitBtn2 = document.getElementById('submit-btn2');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');

function createAccordionMenu() {
  const accordions = document.getElementsByClassName("accordion");

  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      const arrow = this.querySelector('.arrow');
      arrow.classList.toggle('rotate');
    });
  }

  // 동명을 클릭하면 해당 동에 대한 정보를 펼치도록 설정
  const dongNames = document.querySelectorAll('.dong-name');
  for (const dongName of dongNames) {
    dongName.addEventListener('click', function() {
      const unit = this.parentElement.nextElementSibling;
      unit.classList.toggle('active');
      const panel = unit.lastElementChild;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  }

  if (accordions.length > 0) {
    accordions[0].classList.add("active");
    const panel = accordions[0].nextElementSibling;
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}


submitBtn.addEventListener('click', () => {

  loadingDiv.classList.remove('hidden'); // 로딩중 메시지 표시
  resultDiv.innerHTML = ''; // 결과 영역 초기화

  const apiUrl = document.getElementById('url-input').value;

  fetch(apiUrl)
    .then(response => response.text())
    .then(data => {

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');
      let itemInfo = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const bldNm = item.getElementsByTagName('bldNm')[0]?.textContent || '건축물명 없음';
        const dongNm = item.getElementsByTagName('dongNm')[0]?.textContent || '동명 없음';
        const archArea = parseInt(item.getElementsByTagName('archArea')[0]?.textContent || 0);

        const info = {
          '주용도': item.getElementsByTagName('mainPurpsCdNm')[0]?.textContent || '정보없음',
          '기타용도': item.getElementsByTagName('etcPurps')[0]?.textContent || '정보없음',
          '주소': item.getElementsByTagName('platPlc')[0]?.textContent || '정보없음',

          '건축허가일': item.getElementsByTagName('pmsDay')[0]?.textContent || '정보없음',
          '사용승인일': item.getElementsByTagName('useAprDay')[0]?.textContent || '정보없음',

          '연면적(㎡)': item.getElementsByTagName('totArea')[0]?.textContent || '정보없음',
          '건축면적(㎡)': item.getElementsByTagName('archArea')[0]?.textContent || '정보없음',
          '세대수': item.getElementsByTagName('hhldCnt')[0]?.textContent || '정보없음',


          '지상층수': item.getElementsByTagName('grndFlrCnt')[0]?.textContent || '정보없음',
          '지하층수': item.getElementsByTagName('ugrndFlrCnt')[0]?.textContent || '정보없음',
          '높이': item.getElementsByTagName('heit')[0]?.textContent || '정보없음',

          '건축물구조': item.getElementsByTagName('strctCdNm')[0]?.textContent || '정보없음',
          '지붕구조': item.getElementsByTagName('roofCdNm')[0]?.textContent || '정보없음',
        };

        // itemInfo에 동일한 bldNm이 존재하는지 검사 후 추가 또는 업데이트
        const index = itemInfo.findIndex(building => building.bldNm === bldNm);
        if (index === -1) {
          itemInfo.push({ bldNm, dongNm, units: [{ dongNm, items: [info] }] });
        } else {
          const unitIndex = itemInfo[index].units.findIndex(unit => unit.dongNm === dongNm);
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
          resultHTML += `<button class="accordion">${dongNm}<span class="arrow">▼</span></button>`;
          resultHTML += `<div class="panel">`;
          for (const info of items) {
            resultHTML += '<ul>';
            for (const [key, value] of Object.entries(info)) {
              resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            }
            resultHTML += '</ul>';
          }
          resultHTML += `</div>`;
        }
      }


      resultDiv.innerHTML = resultHTML;
      loadingDiv.classList.add('hidden');
      createAccordionMenu();

    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. 대국에게 문의해주세요';
      console.error(error);
      loadingDiv.classList.add('hidden');
    });
});



submitBtn2.addEventListener('click', () => {
  loadingDiv.classList.remove('hidden'); // 로딩중 메시지 표시
  resultDiv.innerHTML = ''; // 결과 영역 초기화
  const recapUrl = document.getElementById('url-input').value.replace('getBrTitleInfo', 'getBrRecapTitleInfo');

  fetch(recapUrl)
    .then(response => response.text())
    .then(data => {

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');
      let itemInfo = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const bldNm = item.getElementsByTagName('bldNm')[0]?.textContent || '건축물명 없음';
        const archArea = parseInt(item.getElementsByTagName('archArea')[0]?.textContent || 0);

        const info = {
          '주용도': item.getElementsByTagName('mainPurpsCdNm')[0]?.textContent || '정보없음',
          '기타용도': item.getElementsByTagName('etcPurps')[0]?.textContent || '정보없음',
          '주소': item.getElementsByTagName('platPlc')[0]?.textContent || '정보없음',

          '건축허가일': item.getElementsByTagName('pmsDay')[0]?.textContent || '정보없음',
          '사용승인일': item.getElementsByTagName('useAprDay')[0]?.textContent || '정보없음',

          '연면적(㎡)': item.getElementsByTagName('totArea')[0]?.textContent || '정보없음',
          '세대수': item.getElementsByTagName('hhldCnt')[0]?.textContent || '정보없음',
          '건축면적(㎡)': item.getElementsByTagName('archArea')[0]?.textContent || '정보없음',


          '주 건축물(개)': item.getElementsByTagName('mainBldCnt')[0]?.textContent || '정보없음',
          '부속 건축물(개)': item.getElementsByTagName('부속건축물수')[0]?.textContent || '정보없음',

        };

        itemInfo.push({ bldNm, items: [info] });
      }

      let resultHTML = '';
      for (const { bldNm, items } of itemInfo) {
        resultHTML += `<h3>${bldNm}</h3>`;

        for (const info of items) {
          resultHTML += '<ul>';
          for (const [key, value] of Object.entries(info)) {
            resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
          }
          resultHTML += '</ul>';
        }
      }

      resultDiv.innerHTML = resultHTML;
      loadingDiv.classList.add('hidden');
    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. 대국에게 문의해주세요';
      console.error(error);
      loadingDiv.classList.add('hidden');
    });
});

