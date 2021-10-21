import {createSlice} from '@reduxjs/toolkit'
import {parse} from "date-fns";

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
                    },
                    {
                        title: 'Мероприятие №2 с 11:00 до 13:00',
                        startTime: "11:00",
                        endTime: "13:00",
                        id: 2,
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
                    },
                    {
                        title: 'Мероприятие №2 с 11:00 до 13:00',
                        startTime: "11:00",
                        endTime: "13:00",
                        id: 2,
                    },
                ]
            },
        ]
    },
    reducers: {
        addEvent: ({data, time}, {payload: {roomIndex, newItem, format}}) => {
            data[roomIndex].children.push(newItem)

            data[roomIndex].children.sort((prev, next) => {
                const date = new Date(null, null, null)
                return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
            })
        },
        moveEvent: ({data, time}, {payload: {roomIndex, dragItem, newItem, format}}) => {
            data[roomIndex].children = data[roomIndex].children.filter(val => val.isEditable !== true)

            data[dragItem.roomIndex].children.push(newItem)

            data[dragItem.roomIndex].children.sort((prev, next) => {
                const date = new Date(null, null, null)
                return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
            })
        },
        disableEditableEvent: ({data}, {payload: {roomIndex, activityIndex}}) => {
            data[roomIndex].children[activityIndex].isEditable = false
        },
    }
})

// Action creators are generated for each case reducer function
export const {addEvent, moveEvent, disableEditableEvent} = roomSlice.actions

export default roomSlice.reducer
