//app.js

const resultDiv = document.getElementById('result');

document.getElementById('search-btn').addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: (data) => {
      const buildingCode = data.buildingCode;
      const apiKey = '5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D';
      const siggCd = buildingCode.substr(0, 5);
      const bjdCd = buildingCode.substr(5, 5);
      const bunCd = buildingCode.substr(11, 4);
      const jiCd = buildingCode.substr(15, 4);
      const apiUrl = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?sigunguCd=${siggCd}&bjdongCd=${bjdCd}&bun=${bunCd}&ji=${jiCd}&ServiceKey=${apiKey}`;
      

  fetch(apiUrl)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');
      let itemInfo = {};

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const bldNm = item.getElementsByTagName('bldNm')[0]?.textContent || '건축물명 없음';
        const archArea = parseInt(item.getElementsByTagName('archArea')[0]?.textContent || 0);
        itemInfo[bldNm] = {
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
      }

      // 객체를 배열로 변환 후 건축물명을 기준으로 정렬
      const sortedItems = Object.entries(itemInfo).sort((a, b) => a[0].localeCompare(b[0]));
      const numItems = items.length;

      let resultHTML = `<p>건축물 수는 ${numItems}개 입니다.</p>`;
      for (const [bldNm, info] of sortedItems) {
        resultHTML += `<h3>${bldNm}</h3><ul>`;
        for (const [key, value] of Object.entries(info)) {
          resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        resultHTML += '</ul>';
      }

      resultDiv.innerHTML = resultHTML;
    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. 대국에게 문의해주세요';
      console.error(error);
    }); }});
});
