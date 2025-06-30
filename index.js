(() => {
    const PRIVATE_ROOM_NUMS = [
        104, 108, 202, 206, 208, 214, 302, 308, 314,
        315, 325, 335, 340, 345, 350, 360, 365, 375,
        380, 385, 390, 415, 425, 435, 440, 450, 460,
        465, 475, 480, 485, 490
    ];

    const arrivalsTableSelector = 'table.arrivals-today'
    const roomNumTDSelector = 'td:nth-child(3)'


    const tableEl = document.querySelector(arrivalsTableSelector)
    let roomNumberStrs = Array.from(tableEl.querySelectorAll(roomNumTDSelector))
    roomNumberStrs = roomNumberStrs.map(el => el.textContent)
    console.log("arrivals listing script | numbers in table: " + roomNumberStrs.join(", "))

    // converts strings to numbers
    const allRoomNums = []
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
    const roomCounts = new Map();
    for (const num of allRoomNums) {
        roomCounts.set(num, (roomCounts.get(num) || 0) + 1);
    }

    // functions for quickly sorting room types 
    function isPrivateRoom(roomNum) {
        return PRIVATE_ROOM_NUMS.includes(roomNum)
    }
    function getPrivateAndDormRoomsCounts(allRoomCounts) {
        const privateRooms = new Map();
        const dormRooms = new Map();

        for (const [roomNum, count] of allRoomCounts.entries()) {
            if (isPrivateRoom(roomNum)) {
                privateRooms.set(roomNum, count);
            } else {
                dormRooms.set(roomNum, count);
            }
        }

        return {
            privateRooms,
            dormRooms
        };
    }

    /**
    * @param {Map<number, number>} roomCounts - A map where keys are room numbers and values are counts
    */
    function divideIntoFloors(roomCounts) {
        // room numbers consts
        const FLOORS = new Map()
        FLOORS.set(0, [102, 104, 106, 108, 110])
        FLOORS.set(1, [202, 204, 206, 208, 210, 212, 214, 216])
        FLOORS.set(2, [302, 304, 306, 308, 310, 312, 314, 316])
        FLOORS.set(3, [215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295]);
        FLOORS.set(4, [315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395]);
        FLOORS.set(5, [415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495]);

        // declare foundRooms as a Map instead of an object
        const foundRooms = new Map([
            [0, new Map()],
            [1, new Map()],
            [2, new Map()],
            [3, new Map()],
            [4, new Map()],
            [5, new Map()]
        ]);
        // puts room number into its floor group
        for (const roomCount of roomCounts.entries()) {
            const [roomNum, count] = roomCount
            for (const [floor, roomsMap] of FLOORS.entries()) {
                if (roomsMap.includes(roomNum)) {
                    foundRooms.set(floor, roomCount)
                    break
                }
            }
        }

        // sorts  floor group numbers
        for (const [floor, rooms] of foundRooms.entries()) {
            const sorted = foundRooms.get(floor).sort((a, b) => a - b)
            foundRooms.set(floor, sorted) 
        }

        return foundRooms
    }

    
    function floorToHTMLUL(roomCount) {
        let content = ''
        for (const [roomNum, numOfArrivals] of roomCount.entries()) {
            content += `<li>${roomNum} - ${numOfArrivals}</li>`
        }
        content = `<ul>${content}</ul>`
        return content
    }

    function getHTMLReturn(roomCounts) {
        const { privateRooms, dormRooms } = getPrivateAndDormRoomsCounts(roomCounts)
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
${roomCounts.entries()}`
        )
    }

    const outputPanel = document.querySelector('#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div')
    const panelOutputText = getHTMLReturn(roomCounts)
    outputPanel.innerHTML = panelOutputText

    // remove line after script testing
    outputPanel.innerHTML = getConsoleReturn(privateRooms, dormRooms)

    //console.log(getHTMLReturn(privateRooms, dormRooms))
    console.log(getConsoleReturn(privateRooms, dormRooms))

})()


