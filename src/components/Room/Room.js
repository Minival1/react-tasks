import React from "react";
import {Button, Form} from 'antd';
import styles from "./Room.module.css";
import { TimePicker } from "@progress/kendo-react-dateinputs";
import { format, isWithinInterval } from 'date-fns'

const data = [
    {
        title: "Мероприятие №1 с 8:30 до 12:00",
        id: 1,
        children: [
            {
                title: 'Аудитория №1',
                time: 'от 8:00 до 8:30',
                id: 1
            },
            {
                title: 'Аудитория №2',
                time: 'от 8:30 до 9:00',
                id: 2
            },
        ]
    },
    {
        title: "Мероприятие №2 с 12:00 до 15:00",
        id: 2,
        children: [
            {
                title: 'Аудитория №40',
                time: 'от 12:00 до 12:30',
                id: 1
            },
            {
                title: 'Аудитория №43',
                time: 'от 12:30 до 15:00',
                id: 2
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
        }
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
                            <TimePicker placeholder="Select time" steps={time.steps} defaultValue={time.min} min={time.min} max={time.max} format={time.format} />
                        </Form.Item>
                    </div>
                    <div>
                        <p>Окончание мероприятия</p>
                        <Form.Item name="end_time">
                            <TimePicker placeholder="Select time" steps={time.steps} defaultValue={time.max} min={time.min} max={time.max} format={time.format} />
                        </Form.Item>
                    </div>
                    <Button type="primary" htmlType="submit">Подобрать</Button>
                </div>
            </Form>

            <table className={styles.table}>
                <tbody>
                {data.map(row => {
                    return (
                        <React.Fragment key={row.id}>
                            <tr>
                                <td colSpan="2" className={styles.tableTitle}>{row.title}</td>
                            </tr>
                                {row.children.map(col => {
                                        return (
                                            <tr key={col.id}>
                                                <td className={styles.colTitle}>{col.title}</td>
                                                <td className={styles.colTime}>{col.time}</td>
                                            </tr>
                                        )
                                    }
                                )}
                        </React.Fragment>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default Room
