import React, {useState} from "react";
import {Button, Form} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import styles from "./Room.module.css";
import {TimePicker} from "@progress/kendo-react-dateinputs";
import {format, isWithinInterval, parse, differenceInMinutes, areIntervalsOverlapping} from 'date-fns'
import uuid from 'react-uuid'
import produce from "immer";
import {DndProvider, useDrag} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

const Room = () => {

    const [data, setData] = useState([
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
    ])

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

    const onFinish = (values) => {
        const formatStartDate = format(values.start_time, time.format)
        const formatEndDate = format(values.end_time, time.format)

        const overlappingArr = data.map((row, rowIndex) => {
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

        const index = overlappingArr.findIndex(arr => !arr.includes(true))

        if (index !== -1) {
            const newItem = {
                title: '',
                startTime: formatStartDate,
                endTime: formatEndDate,
                isEditable: true
            }
            setData(produce((state) => {
                state[index].children.push(newItem)
                state[index].children.sort((prev, next) => {
                    const date = new Date(null, null, null)
                    return parse(prev.endTime, time.format, date) > parse(next.endTime, time.format, date) ? 1 : -1
                })
            }))
        } else {
            alert("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    const onSave = (rowIndex, colIndex) => () => {
        setData(produce(state => {
            state[rowIndex].children[colIndex].isEditable = false
        }))
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

                                        const emptyCols = new Array(offsetCols).fill(null).map(() => <td key={uuid()}
                                                                                                         className={styles.colTime}/>)
                                        return (
                                            <React.Fragment key={uuid()}>
                                                {emptyCols}
                                                {col.isEditable ?
                                                    <td colSpan={colspan}
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
                                {new Array(time.list.length - countCols).fill(null).map(() => <td key={uuid()}
                                                                                                  className={styles.colTime}/>)}
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
