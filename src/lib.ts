// functions for quickly sorting room types 
function getPrivateAndDormRoomsCounts(allRoomCounts, privateRoomNums) {
    const privateRooms = new Map();
    const dormRooms = new Map();

    for (const [roomNum, count] of allRoomCounts.entries()) {
        if (privateRoomNums(roomNum)) {
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

    // declare roomsByFloor as a Map instead of an object
    const roomsByFloor = new Map([
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
                roomsByFloor.set(floor, roomCount)
                break
            }
        }
    }

    // sorts  floor group numbers
    for (const [floor, rooms] of roomsByFloor.entries()) {

        const sorted = Array.from(rooms).sort((a, b) => a - b)
        
        roomsByFloor.set(floor, sorted)
    }

    return roomsByFloor
}


function floorToHTMLUL(roomCount) {
    let content = ''
    for (const [roomNum, numOfArrivals] of roomCount.entries()) {
        content += `<li>${roomNum} - ${numOfArrivals}</li>`
    }
    content = `<ul>${content}</ul>`
    return content
}