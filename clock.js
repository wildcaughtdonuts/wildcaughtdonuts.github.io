const updatedTime = new Date(document.lastModified);
const updatedTimeDiv = document.getElementById("updated-time");
updatedTimeDiv.innerText = `Last updated: ${updatedTime.toLocaleString()}`;

const resultDiv = document.getElementById("result");
const shareBtn = document.getElementById("share-btn");

// 공유하기 버튼 클릭 이벤트
shareBtn.addEventListener("click", async () => {
  const itemInfoText = convertResultToText();
  try {
    await copyToClipboard(itemInfoText);
    alert("내용이 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 해주세요.");
  } catch (err) {
    console.error("클립보드 복사에 실패했습니다.", err);
    alert("복사 실패! 수동으로 복사해 주세요.");
  }
});

// 클립보드에 텍스트 복사
async function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }
}

// 검색 결과를 텍스트 형식으로 변환
function convertResultToText() {
  let itemInfoText = "";
  const buildings = resultDiv.querySelectorAll("h3");
  const accordions = resultDiv.querySelectorAll(".accordion");
  const panels = resultDiv.querySelectorAll(".panel");

  buildings.forEach((building, i) => {
    itemInfoText += `🏢 ${building.textContent}\n`;

    const relatedAccordions = [...accordions].filter(acc => acc.closest("h3") === building);
    relatedAccordions.forEach((accordion, j) => {
      itemInfoText += `  📌 ${accordion.textContent}\n`;

      const panelItems = panels[j]?.querySelectorAll("ul") || [];
      panelItems.forEach(panelItem => {
        panelItem.querySelectorAll("li").forEach(listItem => {
          itemInfoText += `    🔹 ${listItem.textContent}\n`;
        });
      });
    });

    itemInfoText += "\n";
  });

  return itemInfoText;
}
