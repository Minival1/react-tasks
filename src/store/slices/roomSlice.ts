import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {parse} from "date-fns";
import {RootState} from '../store'

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

interface Room {
    roomIndex: number
}

interface ActivityIndex {
    activityIndex: number
}

interface Time {
    format: string
}


type AddEventPayload = Room & ActivityItem & Time
type MoveEventPayload = Room & ActivityItem & DragItem & Time
type DisableEditableEventPayload = Room & ActivityIndex

export const roomSlice = createSlice({
    name: 'room',
    initialState: {
        data: [
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
    },
    reducers: {
        addEvent: ({data}, {payload}: PayloadAction<AddEventPayload>) => {
            const {roomIndex, newItem, format} = payload

            data[roomIndex].children.push(newItem)

            data[roomIndex].children.sort((prev, next) => {
                const date = new Date(0, 0, 0)
                return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
            })
        },
        moveEvent: ({data}, {payload}: PayloadAction<MoveEventPayload>) => {
            const {roomIndex, dragItem, newItem, format} = payload

            data[roomIndex].children = data[roomIndex].children.filter(val => val.isEditable !== true)

            data[dragItem.roomIndex].children.push(newItem)

            data[dragItem.roomIndex].children.sort((prev, next) => {
                const date = new Date(0, 0, 0)
                return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
            })
        },
        disableEditableEvent: ({data}, {payload}: PayloadAction<DisableEditableEventPayload>) => {
            const {roomIndex, activityIndex} = payload

            data[roomIndex].children[activityIndex].isEditable = false
        },
    }
})

// Action creators are generated for each case reducer function
export const {addEvent, moveEvent, disableEditableEvent} = roomSlice.actions
export const roomSelector = (state: RootState) => state.room
export default roomSlice.reducer
