// src/lib.ts
function divideIntoFloors(roomsCounts) {
  const FLOORS = /* @__PURE__ */ new Map();
  FLOORS.set(0, [102, 104, 106, 108, 110]);
  FLOORS.set(1, [202, 204, 206, 208, 210, 212, 214, 216]);
  FLOORS.set(2, [302, 304, 306, 308, 310, 312, 314, 316]);
  FLOORS.set(3, [215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295]);
  FLOORS.set(4, [315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395]);
  FLOORS.set(5, [415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495]);
  const roomsByFloor = /* @__PURE__ */ new Map([
    [0, /* @__PURE__ */ new Map()],
    [1, /* @__PURE__ */ new Map()],
    [2, /* @__PURE__ */ new Map()],
    [3, /* @__PURE__ */ new Map()],
    [4, /* @__PURE__ */ new Map()],
    [5, /* @__PURE__ */ new Map()]
  ]);
  for (const roomCount of roomsCounts.entries()) {
    const [roomNum, tally] = roomCount;
    for (const [floor, roomsMap] of FLOORS.entries()) {
      if (roomsMap.includes(roomNum)) {
        if (floor === void 0)
          console.error("variable floor is undefined");
        roomsByFloor.get(floor).set(roomNum, tally);
        break;
      }
    }
  }
  for (const [floor, rooms] of roomsByFloor.entries()) {
    let roomsArray = Array.from(rooms);
    const sortedArray = roomsArray.sort((a, b) => a[0] - b[0]);
    const sorted = new Map(sortedArray);
    roomsByFloor.set(floor, sorted);
  }
  return roomsByFloor;
}
function floorToHTMLUL(roomCount, privateRoomsList) {
  let content = "";
  for (const [roomNum, numOfArrivals] of roomCount.entries()) {
    const isPrivateRoom = privateRoomsList.includes(roomNum);
    if (isPrivateRoom)
      content += `<li>${roomNum} *</li>`;
    else
      content += `<li>${roomNum} - ${numOfArrivals}</li>`;
  }
  content = `<ul>${content}</ul>`;
  return content;
}
function selectTextInElement(element) {
  if (!element) return console.error("Element not found.");
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  if (selection === null) {
    return;
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

// src/index.ts
(() => {
  const PRIVATE_ROOM_NUMS = [
    104,
    108,
    202,
    206,
    208,
    214,
    302,
    308,
    314,
    315,
    325,
    335,
    340,
    345,
    350,
    360,
    365,
    375,
    380,
    385,
    390,
    415,
    425,
    435,
    440,
    450,
    460,
    465,
    475,
    480,
    485,
    490
  ];
  const arrivalsTableSelector = "table.arrivals-today";
  const roomNumTDSelector = "td:nth-child(3)";
  const tableEl = document.querySelector(arrivalsTableSelector);
  if (!tableEl) {
    console.error("tableEl could not be retried from DOM");
    return;
  }
  const roomNumberTdEls = Array.from(tableEl.querySelectorAll(roomNumTDSelector));
  const roomNumberStrs = roomNumberTdEls.map((el) => el.textContent !== null ? el.textContent : "");
  console.log("arrivals listing script | numbers in table: " + roomNumberStrs.join(", "));
  const allRoomNums = [];
  for (let roomNumberStr of roomNumberStrs) {
    const trimmed = roomNumberStr.trim();
    if (trimmed.length === 3) {
      const roomNum = Number(roomNumberStr);
      allRoomNums.push(roomNum);
    } else {
      const threeDigitRoomNumStr = roomNumberStr.trim().slice(0, 3);
      const roomNum = Number(threeDigitRoomNumStr);
      allRoomNums.push(roomNum);
    }
  }
  const roomCounts = /* @__PURE__ */ new Map();
  for (const num of allRoomNums) {
    roomCounts.set(num, (roomCounts.get(num) || 0) + 1);
  }
  function getHTMLReturn(roomCounts2, privateRoomsList) {
    const floors = divideIntoFloors(roomCounts2);
    console.log("floors: ", floors);
    let finalArrivalsListItems = "";
    for (const [floorNum, roomCount] of floors.entries()) {
      const itemElContent = `${floorToHTMLUL(roomCount, privateRoomsList)}`;
      finalArrivalsListItems += `<li>${itemElContent}</li>`;
    }
    return `
            <div class="mac__sorted-arrivals-panel">
                <style>
                    .mac__sorted-arrivals-panel{
                        width: 100%;
                        height: 100%;
                        padding: 2rem 1.5rem;
                        font-size: 18pt;
                        white-space: pre-line;
                    }
                    .mac__sorted-arrivals-panel p{
                        margin-top:0;
                        margin-bottom:0;
                    }
                    .mac__sorted-arrivals-panel ul{
                        padding-left:0;
                        margin-bottom:2rem;
                    }
                    .mac__sorted-arrivals-panel li{
                        list-style-type: none;
                    }
                </style>
                <div id="contentToSelect">
                    <h2>\u{1F6CF}\uFE0F Today's Arrivals By Room \u{1F6CF}\uFE0F\u{1F6AA}</h2>
                    <p>[room] - [number of arrivals] | * = private room<p>
                    <ul>
                        ${finalArrivalsListItems}
                    </ul>
                </div>
                <button>Select Report Text \u{1F4C3}</button>
            </div>
        `;
  }
  function getConsoleReturn(roomCounts2) {
    return `Today's Arrivals
${Array.from(roomCounts2)}`;
  }
  const outputPanel = document.querySelector("#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div");
  if (!outputPanel) {
    console.error("outputPanel could not be retried from DOM");
    return;
  }
  const panelOutputText = getHTMLReturn(roomCounts, PRIVATE_ROOM_NUMS);
  outputPanel.innerHTML = panelOutputText;
  const contentNodeToSelect = outputPanel.querySelector("#contentToSelect");
  if (contentNodeToSelect) {
    const btn = outputPanel.querySelector("button");
    btn?.addEventListener("mouseup", () => {
      selectTextInElement(contentNodeToSelect);
    });
  }
  console.log(getConsoleReturn(roomCounts));
})();
