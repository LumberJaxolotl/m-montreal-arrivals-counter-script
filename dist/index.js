// src/lib.ts
function getArrivalsTableRoomNumberStrs() {
  const arrivalsTableSelector = "table[data-name='arrivals-today']";
  const roomNumTDSelector = "td:nth-child(3)";
  const tableEl = document.querySelector(arrivalsTableSelector);
  if (!tableEl) {
    return new Error("tableEl could not be retrived from DOM");
  }
  const roomNumberTdEls = Array.from(tableEl.querySelectorAll(roomNumTDSelector));
  const roomNumberStrs = roomNumberTdEls.map((el) => el.textContent !== null ? el.textContent : "");
  return roomNumberStrs;
}
function getRoomCountsFromStrs(roomNumberStrs) {
  const allRoomNums = [];
  for (let roomNumberStr of roomNumberStrs) {
    const trimmed = roomNumberStr.trim();
    let roomNum = 0;
    if (trimmed.length === 3) {
      roomNum = Number(roomNumberStr);
      if (isNaN(roomNum))
        return Error(`${roomNumberStr} was passed, but is not a value that can be pasrsed to a number'`);
    } else {
      const threeDigitRoomNumStr = roomNumberStr.trim().slice(0, 3);
      roomNum = Number(threeDigitRoomNumStr);
      if (isNaN(roomNum))
        return Error(`${threeDigitRoomNumStr} was passed, but is not a value that can be pasrsed to a number'`);
    }
    allRoomNums.push(roomNum);
  }
  console.log("Room numbers from found table: ", allRoomNums.join(", "));
  const roomCounts = /* @__PURE__ */ new Map();
  for (const num of allRoomNums) {
    roomCounts.set(num, (roomCounts.get(num) || 0) + 1);
  }
  return roomCounts;
}
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
  content = `<ul>${content}</ul><br>`;
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
function getHTMLReturn(roomCounts, privateRoomsList, floorSortingFunction) {
  const floors = floorSortingFunction(roomCounts);
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
                    }
                    .mac__sorted-arrivals-panel pre{
                        margin-block: 0;
                    }
                    .mac__sorted-arrivals-panel p{
                        margin-top:0;
                        margin-bottom:0;
                    }
                    .mac__sorted-arrivals-panel ul{
                        padding-inline-start: 0;
                        padding:0 0 0 0;
                        margin-block:0;
                        margin-block-start: 0em;
                        margin-block-end: 0em;
                    }
                    .mac__sorted-arrivals-panel li{
                        list-style-type: none;
                    }
                </style>
                <div id="contentToSelect">
                    <h2>\u{1F6CF}\uFE0F Today's Arrivals By Room \u{1F6CF}\uFE0F\u{1F6AA}</h2>
                    <p>[room] - [number of arrivals] | * = private room</p>
                    <ul>
                        <pre>
                            ${finalArrivalsListItems}
                        </pre>
                    </ul>
                </div>
                <button>Select Report Text \u{1F4C3}</button>
            </div>
        `;
}
function getConsoleReturn(roomCounts) {
  return `Today's Arrivals
${Array.from(roomCounts)}`;
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
  const roomsTextStr = getArrivalsTableRoomNumberStrs();
  if (roomsTextStr instanceof Error) {
    console.error(roomsTextStr);
    return;
  }
  const roomCounts = getRoomCountsFromStrs(roomsTextStr);
  if (roomCounts instanceof Error) {
    console.error(roomCounts);
    return;
  }
  const outputPanel = document.querySelector("#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div");
  if (!outputPanel) {
    console.error("outputPanel could not be retried from DOM");
    return;
  }
  const panelOutputText = getHTMLReturn(roomCounts, PRIVATE_ROOM_NUMS, divideIntoFloors);
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
