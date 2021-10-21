import React, {useState} from "react";
import {Button, Form} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import styles from "./Room.module.css";
import {TimePicker} from "@progress/kendo-react-dateinputs";
import {format, parse, differenceInMinutes, areIntervalsOverlapping} from 'date-fns'
import uuid from 'react-uuid'
import { throttle } from "throttle-debounce";
import {useDispatch, useSelector} from "react-redux";
import {addEvent, moveEvent, disableEditableEvent} from "../../store/slices/roomSlice"

const Room = () => {

    const { data } = useSelector(state => state.room)
    const dispatch = useDispatch()

    const time = {
        format: "HH:mm",
            min: new Date(null, null, null, 8, 0),
            max: new Date(null, null, null, 18, 0),
            steps: {
            minute: 30
        },
        list: ['8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30', '9:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30', '12:30 - 13:00', '13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00', '17:00 - 17:30', '17:30 - 18:00']
    }

    const getCountCols = (startTime, endTime) => {
        const parseStartTime = parse(startTime, time.format, new Date(null))
        const parseEndTime = parse(endTime, time.format, new Date(null))

        return differenceInMinutes(parseEndTime, parseStartTime) / 60 * 2
    }

    const [index, setIndex] = useState();

    const onFinish = (values) => {
        const formatStartDate = format(values.start_time, time.format)
        const formatEndDate = format(values.end_time, time.format)

        const overlappingArr = data.map((row) => {
            return row.children.map(item => {
                const date = new Date(null, null, null)
                const parseItemStartDate = parse(item.startTime, time.format, date)
                const parseItemEndDate = parse(item.endTime, time.format, date)

                return areIntervalsOverlapping(
                    {start: values.start_time, end: values.end_time},
                    {start: parseItemStartDate, end: parseItemEndDate}
                )
            })
        })

        const localIndex = overlappingArr.findIndex(arr => !arr.includes(true))

        if (localIndex !== -1) {
            const newItem = {
                title: '',
                startTime: formatStartDate,
                endTime: formatEndDate,
                isEditable: true
            }
            dispatch(addEvent({index: localIndex, newItem, format: time.format}))
            setIndex(localIndex)
        } else {
            alert("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    const onSave = (rowIndex, colIndex) => () => {
        dispatch(disableEditableEvent({rowIndex, colIndex}))
    }

    let dragItem = {
        itemLength: 1,
        index: -1,
        rowIndex: null,
        startTime: null,
        endTime: null,
    }

    function dragOverHandler(e, rowIndex, colIndex) {

        dragItem.rowIndex = rowIndex

        const startTime = time.list[colIndex].split(" - ")[0]
        const endTime = time.list[colIndex + dragItem.itemLength - 1].split(" - ")[1]

        dragItem.startTime = startTime
        dragItem.endTime = endTime

        const parseStartTime = parse(startTime, time.format, new Date(null))
        const parseEndTime = parse(endTime, time.format, new Date(null))

        const overlappingArr = data[rowIndex].children.map((item) => {
                const date = new Date(null, null, null)
                const parseItemStartDate = parse(item.startTime, time.format, date)
                const parseItemEndDate = parse(item.endTime, time.format, date)

                return areIntervalsOverlapping(
                    {start: parseStartTime, end: parseEndTime},
                    {start: parseItemStartDate, end: parseItemEndDate}
                )
        })

        dragItem.index = overlappingArr.findIndex(val => val !== true)
    }

    function dragEndHandler(e) {

        if (dragItem.index !== -1) {
            const newItem = {
                title: '',
                startTime: dragItem.startTime,
                endTime: dragItem.endTime,
                isEditable: true
            }
            dispatch(moveEvent({index, newItem, dragItem, format: time.format}))
            setIndex(dragItem.rowIndex)
        } else {
            alert("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    function dragStartHandler(e) {
        dragItem.itemLength = e.target.colSpan
    }

    return (
        <div>
            <Form initialValues={{
                ["start_time"]: time.min,
                ["end_time"]: time.max
            }} name="time" onFinish={onFinish}>
                <div className={styles.timepicker}>
                    <div>
                        <p>Начало мероприятия</p>
                        <Form.Item name="start_time">
                            <TimePicker placeholder="Select time" steps={time.steps} defaultValue={time.min}
                                        min={time.min} max={time.max} format={time.format}/>
                        </Form.Item>
                    </div>
                    <div>
                        <p>Окончание мероприятия</p>
                        <Form.Item name="end_time">
                            <TimePicker placeholder="Select time" steps={time.steps} defaultValue={time.max}
                                        min={time.min} max={time.max} format={time.format}/>
                        </Form.Item>
                    </div>
                    <Button type="primary" htmlType="submit">Подобрать</Button>
                </div>
            </Form>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <td className={styles.colTitle}/>
                        {time.list.map(item => <td key={uuid()} className={styles.colTime}>{item}</td>)}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => {
                        let countCols = 0
                        return (
                            <tr key={uuid()}>
                                <td className={styles.colTitle}>{row.title}</td>

                                {row.children.map((col, colIndex, arr) => {
                                        const prev = arr[colIndex - 1]
                                        // отступ по колонкам
                                        let offsetCols = 0

                                        if (prev) {
                                            offsetCols = getCountCols(prev.endTime, col.startTime)
                                        }

                                        // сколько колонок займет блок
                                        const colspan = getCountCols(col.startTime, col.endTime)
                                        countCols += offsetCols + colspan

                                        const emptyCols = new Array(offsetCols).fill(null)
                                            .map((item, index) => <td onDragOver={throttle(500,(e) => dragOverHandler(e, rowIndex, countCols - offsetCols - colspan + index))} key={uuid()} />)
                                        return (
                                            <React.Fragment key={uuid()}>
                                                {emptyCols}
                                                {col.isEditable ?
                                                    <td colSpan={colspan}
                                                        draggable="true"
                                                        onDragStart={(e) => dragStartHandler(e)}
                                                        onDragEnd={(e) => dragEndHandler(e)}
                                                        className={styles.tableEditable}>{col.title}
                                                        <SaveOutlined onClick={onSave(rowIndex, colIndex)}
                                                                      className={styles.tableSave}/>
                                                    </td> :
                                                    <td colSpan={colspan}
                                                        className={styles.tableTitle}>{col.title}</td>
                                                }
                                            </React.Fragment>
                                        )
                                    }
                                )}
                                {/* пустые колонки после мероприятий */}
                                {new Array(time.list.length - countCols).fill(null).map((item, index) => (
                                    <td onDragOver={throttle(500,(e) => dragOverHandler(e, rowIndex, countCols + index))} key={uuid()} />))}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Room
