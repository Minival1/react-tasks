import {parse} from "date-fns";
import {makeAutoObservable} from "mobx";
import {Simulate} from "react-dom/test-utils";


interface ActivityItem {
    newItem: {
        title: string
        startTime: string
        endTime: string
        id: number
        isEditable: boolean
    }
}

interface DragItem {
    dragItem: {
        roomIndex: number
    }
}

interface RoomInterface {
    roomIndex: number
}

interface Time {
    format: string
}


type AddEventPayload = RoomInterface & ActivityItem & Time
type MoveEventPayload = RoomInterface & ActivityItem & DragItem & Time
type DisableEditableEventPayload = { isEditable: boolean }

class Room {
    data = [
        {
            title: "Аудитория №1",
            id: 1,
            children: [
                {
                    title: 'Мероприятие №1 с 8:00 до 11:00',
                    startTime: "8:00",
                    endTime: "11:00",
                    id: 1,
                    isEditable: false
                },
                {
                    title: 'Мероприятие №2 с 11:00 до 13:00',
                    startTime: "11:00",
                    endTime: "13:00",
                    id: 2,
                    isEditable: false
                },
            ]
        },
        {
            title: "Аудитория №2",
            id: 2,
            children: [
                {
                    title: 'Мероприятие №1 с 8:00 до 10:30',
                    startTime: "8:00",
                    endTime: "10:30",
                    id: 1,
                    isEditable: false
                },
                {
                    title: 'Мероприятие №2 с 11:00 до 13:00',
                    startTime: "11:00",
                    endTime: "13:00",
                    id: 2,
                    isEditable: false
                },
            ]
        },
    ]

    constructor() {
        makeAutoObservable(this)
    }

    addEvent(payload: AddEventPayload) {
        const {roomIndex, newItem, format} = payload
        const room = this.data[roomIndex]

        room.children.push(newItem)

        room.children.sort((prev, next) => {
            const date = new Date(0, 0, 0)
            return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
        })
    }

    moveEvent(payload: MoveEventPayload) {
        const {roomIndex, dragItem, newItem, format} = payload
        const room = this.data[roomIndex]
        const dragRoom = this.data[dragItem.roomIndex]

        room.children = room.children.filter(val => val.isEditable !== true)

        dragRoom.children.push(newItem)

        dragRoom.children.sort((prev, next) => {
            const date = new Date(0, 0, 0)
            return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
        })
    }

    disableEditableEvent(activity: DisableEditableEventPayload) {
        activity.isEditable = false
    }
}

export default new Room()
