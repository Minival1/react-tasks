import React, {useState} from "react";
import {Button, Form} from 'antd';
import styles from "./Room.module.css";
import {TimePicker} from "@progress/kendo-react-dateinputs";
import {format, isWithinInterval, parse, differenceInMinutes} from 'date-fns'

const data = [
    {
        title: "Аудитория №1",
        id: 1,
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
    {
        title: "Аудитория №2",
        id: 2,
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
]

const Room = () => {

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

    const fillEmptyCols = () => {

    }

    const onFinish = (values) => {
        const formatStartDate = format(values.start_time, time.format)
        const formatEndDate = format(values.end_time, time.format)

        console.log(isWithinInterval(values.start_time, {
            start: values.start_time, end: values.end_time
        }))
    }

    return (
        <div>
            <Form initialValues={{
                ["start_time"]: time.min,
                ["end_time"]: time.max
            }} name="test" onFinish={onFinish}>
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
                        <td className={styles.colTitle} />
                        {time.list.map(item => <td key={item} className={styles.colTime}>{item}</td>)}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(row => {
                        return (
                            <tr key={row.id}>
                                <td className={styles.colTitle}>{row.title}</td>

                                {row.children.map((col, i, arr) => {
                                        const prev = arr[i - 1]
                                        let offsetCols = 0

                                        if (prev) {
                                            offsetCols = getCountCols(prev.endTime, col.startTime)
                                        }

                                        const colspan = getCountCols(col.startTime, col.endTime)

                                        if (offsetCols) {
                                            const emptyCols = new Array(offsetCols).fill(Date.now())
                                                .map((id) => <td key={id} className={styles.colTime} />)

                                            return (
                                                <React.Fragment>
                                                    {emptyCols}
                                                    <td colSpan={colspan} key={col.id}
                                                        className={styles.tableTitle}>{col.title}</td>
                                                </React.Fragment>
                                            )
                                        } else {
                                            return <td colSpan={colspan} key={col.id}
                                                       className={styles.tableTitle}>{col.title}</td>
                                        }
                                    }
                                )}
                                {fillEmptyCols()}
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
