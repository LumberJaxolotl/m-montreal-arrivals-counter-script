import {
    getArrivalsTableRoomNumberStrs,
    getRoomCountsFromStrs,
    divideIntoFloors,
    selectTextInElement,
    getHTMLReturn,
    getConsoleReturn
} from './lib'

(() => {
    const PRIVATE_ROOM_NUMS = [
        104, 108, 202, 206, 208, 214, 302, 308, 314,
        315, 325, 335, 340, 345, 350, 360, 365, 375,
        380, 385, 390, 415, 425, 435, 440, 450, 460,
        465, 475, 480, 485, 490
    ]

    const roomsTextStr = getArrivalsTableRoomNumberStrs()
    if (roomsTextStr instanceof Error) {
        console.error(roomsTextStr)
        return
    }
        
    const roomCounts = getRoomCountsFromStrs(roomsTextStr)
    if (roomCounts instanceof Error) {
        console.error(roomCounts)
        return
    }
        
    
    // wiping arrival panel content and placing report
    const outputPanel = document.querySelector('#arrivals > div.tabbable-line.tabbable-custom-in.arrivals > div')
    if (!outputPanel) {
        console.error("outputPanel could not be retried from DOM")
        return
    }

    
    const panelOutputText = getHTMLReturn(roomCounts, PRIVATE_ROOM_NUMS, divideIntoFloors)
    outputPanel.innerHTML = panelOutputText

    // copy to clipboard button
    const contentNodeToSelect = outputPanel.querySelector('#contentToSelect')
    if (contentNodeToSelect) {
        const btn = outputPanel.querySelector('button')
        btn?.addEventListener('mouseup', () => { selectTextInElement(contentNodeToSelect) })
    }
    
    console.log(getConsoleReturn(roomCounts))

})()


