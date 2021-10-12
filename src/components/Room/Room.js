import React from "react";
import {Button, Form} from 'antd';
import styles from "./Room.module.css";
import { TimePicker } from "@progress/kendo-react-dateinputs";

const data = [
    {
        title: "Олимпиада с 8:30 до 12:00",
        id: 1,
        children: [
            {
                title: 'Танцы',
                time: 'от 8:00 до 8:30',
                id: 1
            },
            {
                title: 'Стрельба',
                time: 'от 8:30 до 9:00',
                id: 2
            },
        ]
    },
    {
        title: "Концерт с 12:00 до 15:00",
        id: 2,
        children: [
            {
                title: 'Хор',
                time: 'от 12:00 до 12:30',
                id: 1
            },
            {
                title: 'Танцы',
                time: 'от 12:30 до 15:00',
                id: 2
            },
        ]
    },
]

const Room = () => {

    const format = "HH:mm"

    const onFinish = (values) => {
        console.log(values)
    }

    return (
        <div>
            <Form name="test" onFinish={onFinish}>
                <div className={styles.timepicker}>
                    <div>
                        <p>Начало мероприятия</p>
                        <Form.Item name="start_time">
                            <TimePicker format={format} minuteStep={30} secondStep={10}/>
                        </Form.Item>
                    </div>
                    <div>
                        <p>Окончание мероприятия</p>
                        <Form.Item name="end_time">
                            <TimePicker format={format} minuteStep={30} secondStep={10}/>
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
    // return <Table columns={columns} dataSource={data} scroll={{x: "100vw"}} />
}

export default Room
