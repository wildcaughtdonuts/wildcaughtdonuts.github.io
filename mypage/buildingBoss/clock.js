//clock.js1

const updatedTime = new Date(document.lastModified);
const updatedTimeDiv = document.getElementById('updated-time');
updatedTimeDiv.innerText = `Last updated: ${updatedTime.toLocaleString()}`;

resultDiv = document.getElementById('result');

// 공유하기 버튼
const shareBtn = document.getElementById('share-btn');

shareBtn.addEventListener('click', () => {
  const itemInfoText = convertResultToText();
  copyToClipboard(itemInfoText).then(() => {
    alert('내용이 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 해주세요.');
  }).catch(err => {
    console.error('클립보드 복사에 실패했습니다.', err);
  });
});

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // avoid scrolling to the bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          resolve();
        } else {
          // Fallback for Android devices
          window.prompt('복사하려면 Ctrl+C를 누르고 Enter를 누르세요.', text);
          resolve();
        }
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }
}


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
