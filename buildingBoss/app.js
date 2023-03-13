submitBtn.addEventListener('click', () => {
  const url = urlInput.value;

  fetch(url)
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
          '연면적(㎡)': item.getElementsByTagName('totArea')[0]?.textContent || '정보없음',
          '세대수': item.getElementsByTagName('hhldCnt')[0]?.textContent || '정보없음',
          '처리일자': item.getElementsByTagName('pmsDay')[0]?.textContent || '정보없음',
          '사용승인일자': item.getElementsByTagName('useAprDay')[0]?.textContent || '정보없음'
        };
        if (!isNaN(archArea)) {
          itemInfo[bldNm]['건축면적(㎡)'] = archArea;
        }
      }

      // 객체를 배열로 변환 후 건축물명을 기준으로 정렬
      const sortedItems = Object.entries(itemInfo).sort((a, b) => a[0].localeCompare(b[0]));

      let resultHTML = '';
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
      resultDiv.innerHTML = '오류가 발생했습니다. URL을 확인해주세요.';
      console.error(error);
    });
});
