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
        addEvent: ({data, time}, {payload: {index, newItem, format}}) => {
            data[index].children.push(newItem)
            data[index].children.sort((prev, next) => {
                const date = new Date(null, null, null)
                return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
            })
        },
        moveEvent: ({data, time}, {payload: {index, dragItem, newItem, format}}) => {
            data[index].children = data[index].children.filter(val => val.isEditable !== true)
            data[dragItem.rowIndex].children.push(newItem)
            data[dragItem.rowIndex].children.sort((prev, next) => {
                const date = new Date(null, null, null)
                return parse(prev.endTime, format, date) > parse(next.endTime, format, date) ? 1 : -1
            })
        },
        disableEditableEvent: ({data}, {payload: {rowIndex, colIndex}}) => {
            data[rowIndex].children[colIndex].isEditable = false
        },
    }
})

// Action creators are generated for each case reducer function
export const {addEvent, moveEvent, disableEditableEvent} = roomSlice.actions

export default roomSlice.reducer
