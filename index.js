(() => {
    const PRIVATE_ROOM_NUMS = []
    
    const arrivalsTableSelector = 'table.arrivals-today'
    const roomNumTDSelector = 'td:nth-child(3)'

    
    const tableEl = document.querySelector(arrivalsTableSelector)
    let roomNumberStrs = Array.from(tableEl.querySelectorAll(roomNumTDSelector))
    roomNumberStrs = roomNumberStrs.map(el => el.textContent)
    console.log("arrivals listing script | numbers in table: " + roomNumberStrs.join(", "))

    const privateRooms = []
    const dormRooms = []
    for (let roomNumberStr of roomNumberStrs) {
        const trimmed = roomNumberStr.trim()

        // sorts private rooms 
        if (trimmed.length === 3) {
            const roomNum = Number(roomNumberStr)
            privateRooms.push(roomNum)
        }
        else {
            const threeDigitRoomNumStr = roomNumberStr.trim().slice(0, 3)
            const roomNum = Number(threeDigitRoomNumStr)
            dormRooms.push(roomNum)
        }

    }

    const counts = new Map();
    const allRoomCounts = [].concat(privateRooms, dormRooms)
    for (const num of allRoomNums) {
        counts.set(num, (counts.get(num) || 0) + 1);
    }

    
    /**
    * @param {Map<number, number>} roomCounts - A map where keys are room numbers and values are counts
    */
    function divideIntoFloors(roomCounts) {
        // room numbers sections
        const allFloors = new Map()

        allFloors.set(0, [102, 104, 106, 108, 110])
        allFloors.set(1, [202, 204, 206, 208, 210, 212, 214, 216])
        allFloors.set(2, [302, 304, 306, 308, 310, 312, 314, 316])
        allFloors.set(3, [215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295]);
        allFloors.set(4, [315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395]);
        allFloors.set(5, [415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495]);

        let foundRooms = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        }

        // puts room number into its floor group
        for (const [roomNum, count] of roomCounts.entries()) {
            for (const [floor, rooms] of allFloors.entries()) {
                if (rooms.includes(roomNum)) {
                    foundRooms[floor].push( [roomNum, count] )
                    break
                }
            }
        }

        // sort floor group numbers
        for (const floor in foundRooms) {
            foundRooms[floor] = foundRooms[floor].sort((a, b) => a - b);
        }

        return foundRooms
    }


    function getHTMLReturn(privateRoomNums, dormRoomNums) {
        const privateRoomsList = privateRoomNums.join(", ")

        const dormRoomCounts = new Map();
        for (const num of dormRoomNums) {
            dormRoomCounts.set(num, (dormRoomCounts.get(num) || 0) + 1);
        }
        const dormRoomsList = Array.from(dormRoomCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => `#${key}: ${value}`)
            .join('<br>');

        const allRoomsList = []

        // sort by floor/building in order of the HK sheet
        return (`
            <div class="mac__sorted-arrivals-panel">
                <style>
                    .mac__sorted-arrivals-panel{
                        padding: 2rem 1.5rem;
                        font-size: 18pt
                    }
                </style>
                <h2>🚪 Private Rooms</h2>
                <p>${privateRoomsList}<p>
                <br>
                <h2>🛏️ Dorm Rooms</h2>
                <p>${dormRoomsList}</p>
                <br>
                <h2>* All Room Types *</h2>
                <p>${allRoomsList}</p>
                <button id="print-btn" type="button" style="margin-top:1.5rem;">Print Me 🖨️</button>

            </div>
        `)
    }

    // printing the result
    function getConsoleReturn(privateRoomNums, dormRoomNums) {
        const privateRoomsList = privateRoomNums.join(", ")

        const dormRoomCounts = new Map();
        for (const num of dormRoomNums) {
            dormRoomCounts.set(num, (dormRoomCounts.get(num) || 0) + 1);
        }
        const dormRoomsList = Array.from(dormRoomCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => `#${key}: ${value}`)
            .join('\n');
        // sort by floor/building in order of the HK sheet  
        return (
            `
🚪 Private Rooms
${privateRoomsList}

🛏️ Dorm Rooms
${dormRoomsList}
`)
    }

    const outputPanel = document.querySelector('#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div')
    // const panelOutputText = getHTMLReturn(privateRooms, dormRooms)
    // outputPanel.innerHTML = panelOutputText
    
    // remove line after script testing
    outputPanel.innerHTML = getConsoleReturn(privateRooms, dormRooms)
    
    console.log(getHTMLReturn(privateRooms, dormRooms))
    console.log(getConsoleReturn(privateRooms, dormRooms))




  //click-to-print report feature
  document.getElementById("print-btn").addEventListener("click", function () {
// TODO update this to a correct .querySelector()  
const content = document.getElementById("print-container").innerHTML;

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Page</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close(); // Needed for some browsers
});



  //click-to-print report feature
  document.getElementById("print-btn").addEventListener("click", function () {
// TODO update this to a correct .querySelector()  
const content = document.getElementById("print-container").innerHTML;

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Page</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close(); // Needed for some browsers
});

})()


