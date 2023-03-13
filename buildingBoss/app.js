const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const urlInput = document.getElementById('url-input');

const unitNames = {
  'main': '건축물 대장 정보',
  'bld': '건축물 기본정보',
  'use': '건축물 사용승인 정보',
  'apr': '건축물 허가 정보'
};

const itemNames = {
  'bldNm': '건물명',
  'mainPurpsCdNm': '주용도',
  'etcPurps': '기타용도',
  'totArea': '연면적(㎡)',
  'archArea': '건축면적(㎡)',
  'hhldCnt': '세대수',
  'pmsDay': '처리일자',
  'useAprDay': '사용승인일자'
};

submitBtn.addEventListener('click', () => {
  const url = urlInput.value;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      
      let resultHTML = '';
      
      for (let unit in unitNames) {
        const unitElement = xmlDoc.getElementsByTagName(unit)[0];
        if (unitElement) {
          resultHTML += `<h3>${unitNames[unit]}</h3><ul>`;
          const itemElements = unitElement.children;
          for (let i = 0; i < itemElements.length; i++) {
            const itemElement = itemElements[i];
            const itemName = itemElement.tagName;
            const itemValue = itemElement.textContent || '정보없음';
            if (itemNames[itemName]) {
              resultHTML += `<li><strong>${itemNames[itemName]}:</strong> ${itemValue}</li>`;
            }
          }
          resultHTML += '</ul>';
        }
      }

      resultDiv.innerHTML = resultHTML;
    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. URL을 확인해주세요.';
      console.error(error);
    });
});
