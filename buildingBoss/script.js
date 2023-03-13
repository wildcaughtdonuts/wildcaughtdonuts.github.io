// script.js

const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const urlInput = document.getElementById('url-input');

submitBtn.addEventListener('click', () => {
  const url = urlInput.value;

  // API 요청 보내기
  fetch(url)
    .then(response => response.text())
    .then(data => {
      // XML 파싱하기
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');

      // 결과를 Unit 종류별로 분류하기
      const units = new Set();
      const results = {};

      for (const node of xmlDoc.getElementsByTagName('item')) {
        const unit = node.getElementsByTagName('bldNm')[0].textContent;
        if (!units.has(unit)) {
          units.add(unit);
          results[unit] = [];
        }
        results[unit].push(node);
      }

      // 결과를 테이블로 표시하기
      resultDiv.innerHTML = '';
      for (const unit of units) {
        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = `Unit: ${unit}`;
        table.appendChild(caption);

        for (const node of results[unit]) {
          const row = document.createElement('tr');
          const col1 = document.createElement('td');
          const col2 = document.createElement('td');
          col1.textContent = `${node.getElementsByTagName('sidoNm')[0].textContent} ${node.getElementsByTagName('sigunguNm')[0].textContent} ${node.getElementsByTagName('bjdongNm')[0].textContent} ${node.getElementsByTagName('bun')[0].textContent}-${node.getElementsByTagName('ji')[0].textContent}`;
          col2.textContent = node.getElementsByTagName('bldNm')[0].textContent;
          row.appendChild(col1);
          row.appendChild(col2);
          table.appendChild(row);
        }

        resultDiv.appendChild(table);
      }
    })
    .catch(error => console.error(error));
});
