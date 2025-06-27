(() => {

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
    for (const num of dormRooms) {
        counts.set(num, (counts.get(num) || 0) + 1);
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
        // sort by floor/building in order of the HK sheet  
        return (`
            <div>
                <h2>🚪 Private Rooms</h2>
                <p>${privateRoomsList}<p>
                <br>
                <h2>🛏️ Dorm Rooms</h2>
                <p>${dormRoomsList}</p>
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

    // const outputPanel = document.querySelector('#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div')
    // const panelOutputText = getHTMLReturn(privateRooms, dormRooms)
    // outputPanel.innerHTML = panelOutputText
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

})()
