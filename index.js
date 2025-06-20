(() => {

    const arrivalsTableSelector = 'table'
    const roomNumTDSelector = 'td:nth-child(3)'
    const outputPanelSelector = 'body' 

    let roomNumberStrs = Array.from(document.querySelectorAll(`${arrivalsTableSelector} ${roomNumTDSelector}`))
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

    // printing the result
    function getReturn(privateRoomNums, dormRoomNums) {
        const privateRoomsList = privateRoomNums.join(", ")

        const dormRoomCounts = new Map();
        for (const num of dormRoomNums) {
            dormRoomCounts.set(num, (dormRoomCounts.get(num) || 0) + 1);
        }
        const dormRoomsList = Array.from(dormRoomCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => `#${key}: ${value}`)
            .join('\n');

        return (
`
🚪 Private Rooms
${privateRoomsList}

🛏️ Dorm Rooms
${dormRoomsList}
`)
    }

    const panelOutputText = getReturn(privateRooms, dormRooms)
    console.log(getReturn(privateRooms, dormRooms))

    // alternative output option for down the road
    // const outputPanel = document.querySelector(outputPanelSelector)
    // outputPanel.innerHTML = `
    // <p>
    //     ${panelOutputText}
    // </p>
    // `


})()
