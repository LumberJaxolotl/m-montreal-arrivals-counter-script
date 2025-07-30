export function getArrivalsTableRoomNumberStrs() {
    const arrivalsTableSelector = "table[data-name='arrivals-today']";
    const roomNumTDSelector = 'td:nth-child(3)'

    // gets room number strings from dom
    const tableEl = document.querySelector(arrivalsTableSelector)
    if (!tableEl) {
        return new Error("tableEl could not be retrived from DOM")
    }
    const roomNumberTdEls = Array.from(tableEl.querySelectorAll(roomNumTDSelector))
    const roomNumberStrs = roomNumberTdEls.map(el => el.textContent !== null ? el.textContent : "")

    return roomNumberStrs
}

export function getRoomCountsFromStrs(roomNumberStrs: string[]) {
    // TODO find out why function is not returning private rooms in output
    // TODO find out why a `0 => 6` is being added 
    // converts strings to numbers
    const allRoomNums: number[] = []
   
    for (let roomNumberStr of roomNumberStrs) {
        const trimmed = roomNumberStr.trim()

        let roomNum = 0
        
        if (trimmed.length === 3) {    
            roomNum = Number(roomNumberStr)
            if (isNaN(roomNum))
                return Error(`${roomNumberStr} was passed, but is not a value that can be pasrsed to a number'`) 
        }
        else {
            const threeDigitRoomNumStr = roomNumberStr.trim().slice(0, 3)
            roomNum = Number(threeDigitRoomNumStr)
            if (isNaN(roomNum))
            return Error(`${threeDigitRoomNumStr} was passed, but is not a value that can be pasrsed to a number'`) 
        }
        
        allRoomNums.push(roomNum)
    }

    console.log("Room numbers from found table: ", allRoomNums.join(", "))

    // tallies up duplicates
    const roomCounts = new Map<number, number>();
    for (const num of allRoomNums) {
        roomCounts.set(num, (roomCounts.get(num) || 0) + 1);
    }

    return roomCounts
}

/**
* @param {Map<number, number>} roomCounts - A map where keys are room numbers and values are counts
*/
export function divideIntoFloors(roomsCounts: Map<number, number>) {
    // room numbers consts
    const FLOORS = new Map<number, number[]>()
    FLOORS.set(0, [102, 104, 106, 108, 110])
    FLOORS.set(1, [202, 204, 206, 208, 210, 212, 214, 216])
    FLOORS.set(2, [302, 304, 306, 308, 310, 312, 314, 316])
    FLOORS.set(3, [215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295]);
    FLOORS.set(4, [315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395]);
    FLOORS.set(5, [415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495]);

    // declare roomsByFloor as a Map instead of an object
    const roomsByFloor = new Map([
        [0, new Map<number, number>()],
        [1, new Map<number, number>()],
        [2, new Map<number, number>()],
        [3, new Map<number, number>()],
        [4, new Map<number, number>()],
        [5, new Map<number, number>()]
    ]);
    // puts room number into its floor group
    for (const roomCount of roomsCounts.entries()) {
        const [roomNum, tally] = roomCount

        for (const [floor, roomsMap] of FLOORS.entries()) {
            if (roomsMap.includes(roomNum)) {
                if (floor === undefined)
                    console.error("variable floor is undefined")
                roomsByFloor.get(floor)!.set(roomNum, tally)
                break
            }
        }
    }

    // sorts  floor group numbers
    for (const [floor, rooms] of roomsByFloor.entries()) {

        let roomsArray = Array.from(rooms)

        const sortedArray = roomsArray.sort((a, b) => a[0] - b[0])
        const sorted = new Map(sortedArray)

        roomsByFloor.set(floor, sorted)
    }

    return roomsByFloor
}


function floorToHTMLUL(roomCount: Map<number, number>, privateRoomsList: number[]) {
    let content = ''
    for (const [roomNum, numOfArrivals] of roomCount.entries()) {
        const isPrivateRoom = privateRoomsList.includes(roomNum)
        if (isPrivateRoom)
            content += `<li>${roomNum} *</li>`
        else
            content += `<li>${roomNum} - ${numOfArrivals}</li>`
    }
    content = `<ul>${content}</ul><br>`
    return content
}

export function selectTextInElement(element: Node) {
    if (!element) return console.error("Element not found.");

    const range = document.createRange();
    range.selectNodeContents(element);

    const selection = window.getSelection();
    if (selection === null) {
        return
    }

    selection.removeAllRanges();
    selection.addRange(range);
}

export function getHTMLReturn(
    roomCounts: Map<number, number>,
    privateRoomsList: number[],
    floorSortingFunction: (map: Map<number, number>) => Map<number, Map<number, number>>
) {

    // constructs most important html template construction
    const floors = floorSortingFunction(roomCounts)
    console.log("floors: ", floors)
    let finalArrivalsListItems = ""
    for (const [floorNum, roomCount] of floors.entries()) {
        const itemElContent = `${floorToHTMLUL(roomCount, privateRoomsList)}`
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
                    <h2>🛏️ Today's Arrivals By Room 🛏️🚪</h2>
                    <p>[room] - [number of arrivals] | * = private room</p>
                    <ul>
                        <pre>
                            ${finalArrivalsListItems}
                        </pre>
                    </ul>
                </div>
                <button>Select Report Text 📃</button>
            </div>
        `)
}

// printing the result
export function getConsoleReturn(roomCounts) {
    return (
        `Today's Arrivals
${Array.from(roomCounts)}`
    )
}