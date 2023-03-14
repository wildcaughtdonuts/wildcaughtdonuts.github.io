//app.js

const submitBtn = document.getElementById('submit-btn');
const submitBtn2 = document.getElementById('submit-btn2');
const resultDiv = document.getElementById('result');

submitBtn.addEventListener('click', () => {
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
          '세대수': item.getElementsByTagName('hhldCnt')[0]?.textContent || '정보없음',
          '건축면적(㎡)': item.getElementsByTagName('archArea')[0]?.textContent || '정보없음',


          '지상층수': item.getElementsByTagName('grndFlrCnt')[0]?.textContent || '정보없음',
          '지하층수': item.getElementsByTagName('ugrndFlrCnt')[0]?.textContent || '정보없음',
          '높이': item.getElementsByTagName('heit')[0]?.textContent || '정보없음',

          '건축물구조': item.getElementsByTagName('strctCdNm')[0]?.textContent || '정보없음',
          '지붕구조': item.getElementsByTagName('roofCdNm')[0]?.textContent || '정보없음',
        };

        // itemInfo에 동일한 bldNm이 존재하는지 검사 후 추가 또는 업데이트
        const index = itemInfo.findIndex(building => building.bldNm === bldNm);
        if (index === -1) {
          itemInfo.push({ bldNm, dongNm, items: [info] });
        } else {
          itemInfo[index].items.push(info);
        }
      }

      // 건축물명을 기준으로 정렬
      itemInfo.sort((a, b) => a.bldNm.localeCompare(b.bldNm));
      const numItems = items.length;

      let resultHTML = `<li><p><strong>해당 주소의 건축물은 ${numItems}개 입니다.</strong></p></li>`;
      for (const { bldNm, dongNm, items } of itemInfo) {
        resultHTML += `<h3>${bldNm}</h3>`;

        for (const info of items) {
          resultHTML += '<ul>';
          resultHTML += `<strong>- ${dongNm} -</strong>`;
          for (const [key, value] of Object.entries(info)) {
            resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
          }
          resultHTML += '</ul>';
        }
      }

      resultDiv.innerHTML = resultHTML;
    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. 대국에게 문의해주세요';
      console.error(error);
    });
});

submitBtn2.addEventListener('click', () => {
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
    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. 대국에게 문의해주세요';
      console.error(error);
    });
});
