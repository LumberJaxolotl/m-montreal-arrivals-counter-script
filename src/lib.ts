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


export function floorToHTMLUL(roomCount: Map<number, number>, privateRoomsList: number[]) {
    let content = ''
    for (const [roomNum, numOfArrivals] of roomCount.entries()) {
        const isPrivateRoom = privateRoomsList.includes(roomNum)
        if (isPrivateRoom)
            content += `<li>${roomNum} *</li>`
        else
            content += `<li>${roomNum} - ${numOfArrivals}</li>`
    }
    content = `<ul>${content}</ul>`
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