import {
    divideIntoFloors,
    floorToHTMLUL, 
    selectTextInElement
} from './lib'

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

    // Next shift need to verify numbers being found by 
    // script are ACTUALLY those of the arrivals panel. 
    // logs the numbers pulled from DOM
    console.log("Room numbers from found table: ", allRoomNums.join(", "))

    // tallies up duplicates
    const roomCounts = new Map<number, number>();
    for (const num of allRoomNums) {
        roomCounts.set(num, (roomCounts.get(num) || 0) + 1);
    }

    
   

    function getHTMLReturn(roomCounts: Map<number, number>, privateRoomsList: number[]) {

        // constructs most important html template construction
        const floors = divideIntoFloors(roomCounts) 
        console.log("floors: ", floors)
        let finalArrivalsListItems = ""
        for (const [floorNum, roomCount] of floors.entries()) {
            const itemElContent = `${ floorToHTMLUL(roomCount, privateRoomsList) }`
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
                    <h2>🛏️ Today's Arrivals By Room 🛏️🚪</h2>
                    <p>[room] - [number of arrivals] | * = private room<p>
                    <ul>
                        ${finalArrivalsListItems}
                    </ul>
                </div>
                <button>Select Report Text 📃</button>
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

    // wiping arrival panel content and placing report
    const outputPanel = document.querySelector('#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div')
    if (!outputPanel) {
        console.error("outputPanel could not be retried from DOM")
        return
    }

    const panelOutputText = getHTMLReturn(roomCounts, PRIVATE_ROOM_NUMS)
    outputPanel.innerHTML = panelOutputText

    // copy to clipboard button
    const contentNodeToSelect = outputPanel.querySelector('#contentToSelect')
    if (contentNodeToSelect) {
        const btn = outputPanel.querySelector('button')
        btn?.addEventListener('mouseup', () => { selectTextInElement(contentNodeToSelect) })
    }
    
    console.log(getConsoleReturn(roomCounts))

})()


