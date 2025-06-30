(() => {
    const PRIVATE_ROOM_NUMS = [
        104, 108, 202, 206, 208, 214, 302, 308, 314,
        315, 325, 335, 340, 345, 350, 360, 365, 375,
        380, 385, 390, 415, 425, 435, 440, 450, 460,
        465, 475, 480, 485, 490
    ]

    const arrivalsTableSelector = 'table.arrivals-today'
    const roomNumTDSelector = 'td:nth-child(3)'

    // gets room number strings from dom
    const tableEl = document.querySelector(arrivalsTableSelector)
    if (!tableEl) {
        console.error("tableEl could not be retried from DOM")
        return
    }
    const roomNumberTdEls = Array.from(tableEl.querySelectorAll(roomNumTDSelector))
    const roomNumberStrs = roomNumberTdEls.map(el => el.textContent !== null ? el.textContent : "")
    console.log("arrivals listing script | numbers in table: " + roomNumberStrs.join(", "))

    // converts strings to numbers
    const allRoomNums: number[] = []
    for (let roomNumberStr of roomNumberStrs) {
        const trimmed = roomNumberStr.trim()

        if (trimmed.length === 3) {
            const roomNum = Number(roomNumberStr)
            allRoomNums.push(roomNum)
        }
        else {
            const threeDigitRoomNumStr = roomNumberStr.trim().slice(0, 3)
            const roomNum = Number(threeDigitRoomNumStr)
            allRoomNums.push(roomNum)
        }

    }

    // tallies up duplicates
    const roomCounts = new Map<number, number>();
    for (const num of allRoomNums) {
        roomCounts.set(num, (roomCounts.get(num) || 0) + 1);
    }

    console.log('roomCounts: ', Array.from(roomCounts) )
    
   

    function getHTMLReturn(roomCounts) {
        const { privateRooms, dormRooms } = getPrivateAndDormRoomsCounts(roomCounts, PRIVATE_ROOM_NUMS)
        const privateRoomsList = Array.from(privateRooms.entries()).join(", ")


        // constructs most important html template construction
        const floors = divideIntoFloors(roomCounts) 
        let finalArrivalsListItems = ""
        for (const [floorNum, roomCount] of floors.entries()) {
            const itemElContent = `${ floorToHTMLUL(roomCount) }`
            finalArrivalsListItems += `<li>${itemElContent}</li>`
        }

        // sort by floor/building in order of the HK sheet
        return (`
            <div class="mac__sorted-arrivals-panel">
                <style>
                    .mac__sorted-arrivals-panel{
                        width: 100%;
                        height: 100%;
                        padding: 2rem 1.5rem;
                        font-size: 18pt
                    }
                </style>
                <div id="copyToClipboardContent">
                    <h2>🚪 Private Rooms</h2>
                    <p>${privateRoomsList}<p>
                    <br>
                    <h2>🚪🛏️ All Room Types 🛏️🚪</h2>
                    <ul>
                        ${finalArrivalsListItems}
                    </ul>
                </div>
                <button id="copy-btn" type="button" style="margin-top:1.5rem;">Copy to Cipboard 📋</button>
            </div>
        `)
    }

    // printing the result
    function getConsoleReturn(roomCounts) {
        return (
`Today's Arrivals
${Array.from(roomCounts)}`
        )
    }

    const outputPanel = document.querySelector('#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div')
    if (!outputPanel) {
        console.error("outputPanel could not be retried from DOM")
        return
    }
        
    const panelOutputText = getHTMLReturn(roomCounts)
    outputPanel.innerHTML = panelOutputText

    // remove line after script testing
    outputPanel.innerHTML = getConsoleReturn(roomCounts)

    //console.log(getHTMLReturn(privateRooms, dormRooms))
    console.log(getConsoleReturn(roomCounts))

})()


