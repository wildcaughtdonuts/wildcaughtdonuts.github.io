//clock.js

const updatedTime = new Date(document.lastModified);
const updatedTimeDiv = document.getElementById('updated-time');
updatedTimeDiv.innerText = `Last updated: ${updatedTime.toLocaleString()}`;

resultDiv = document.getElementById('result');

// 공유하기 버튼
const shareBtn = document.getElementById('share-btn');

shareBtn.addEventListener('click', () => {
  const itemInfoText = convertResultToText();
  navigator.clipboard.writeText(itemInfoText).then(() => {
    alert('내용이 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 해주세요.');
  }).catch(err => {
    console.error('클립보드 복사에 실패했습니다.', err);
  });
});

function convertResultToText() {
  let itemInfoText = '';
  const buildings = resultDiv.querySelectorAll('h3');
  const accordionItems = resultDiv.querySelectorAll('.accordion');
  const panels = resultDiv.querySelectorAll('.panel');

  for (let i = 0; i < buildings.length; i++) {
    itemInfoText += buildings[i].textContent + '\n';

    for (let j = 0; j < accordionItems.length; j++) {
      if (accordionItems[j].parentNode === buildings[i].parentNode) {
        itemInfoText += '  ' + accordionItems[j].textContent + '\n';
        const panelItems = panels[j].querySelectorAll('ul');

        for (const panelItem of panelItems) {
          const listItems = panelItem.querySelectorAll('li');
          for (const listItem of listItems) {
            itemInfoText += '    ' + listItem.textContent + '\n';
          }
        }
      }
    }

    itemInfoText += '\n';
  }

  return itemInfoText;
}
