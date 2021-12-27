import React, {useEffect, useRef, useState} from "react";
import {Button, Form, notification} from 'antd';
import styles from "./Room.module.scss";
import {TimePicker} from "@progress/kendo-react-dateinputs";
import {format, parse, areIntervalsOverlapping} from 'date-fns'
import uuid from 'react-uuid'
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {addEvent, roomSelector} from "../../store/slices/roomSlice"
import Grid from "./Grid/Grid";
import { Time } from "../../interfaces/Time";

const Room = (): JSX.Element => {

    const { data } = useSelector(roomSelector)
    const [roomIndex, setRoomIndex] = useState<number>(-1);
    const dispatch = useDispatch()

    const [form] = Form.useForm()
    const timepickers = useRef<Array<any>>([])

    useEffect(() => {
        setTimepickerReadOnly()
    }, [data])

    function setTimepickerReadOnly() {
        timepickers.current.forEach((picker: any) => {
            picker.element.querySelector("input").setAttribute("readonly", true)
        })
    }

    const time: Time = {
        format: "HH:mm",
        min: new Date(0, 0, 0, 8, 0),
        max: new Date(0, 0, 0, 18, 0),
        steps: {
            minute: 30
        },
        list: [
            {
                time: '8:00',
                steps: ['8:00 - 8:30', '8:30 - 9:00']
            },
            {
                time: '9:00',
                steps: ['9:00 - 9:30', '9:30 - 10:00']
            },
            {
                time: '10:00',
                steps: ['10:00 - 10:30', '10:30 - 11:00']
            },
            {
                time: '11:00',
                steps: ['11:00 - 11:30', '11:30 - 12:00']
            },
            {
                time: '12:00',
                steps: ['12:00 - 12:30', '12:30 - 13:00']
            },
            {
                time: '13:00',
                steps: ['13:00 - 13:30', '13:30 - 14:00']
            },
            {
                time: '14:00',
                steps: ['14:00 - 14:30', '14:30 - 15:00']
            },
            {
                time: '15:00',
                steps: ['15:00 - 15:30', '15:30 - 16:00']
            },
            {
                time: '16:00',
                steps: ['16:00 - 16:30', '16:30 - 17:00']
            },
            {
                time: '17:00',
                steps: ['17:00 - 17:30', '17:30 - 18:00']
            }
        ]
    }

    const openNotification = (message: string): void => {
        notification.info({
            message: message,
            description: "",
            placement: "topLeft",
        });
    };

    interface onFinishTypes {
        start_time: Date,
        end_time: Date
    }

    const onFinish = (values: onFinishTypes): void => {
        const formatStartDate = format(values.start_time, time.format)
        const formatEndDate = format(values.end_time, time.format)

        const overlappingArr: boolean[][] = data.map((row) => {
            return row.children.map(item => {
                const date = new Date(0, 0, 0)
                const parseItemStartDate = parse(item.startTime, time.format, date)
                const parseItemEndDate = parse(item.endTime, time.format, date)

                return areIntervalsOverlapping(
                    {start: values.start_time, end: values.end_time},
                    {start: parseItemStartDate, end: parseItemEndDate}
                )
            })
        })

        const roomIndex = overlappingArr.findIndex(arr => !arr.includes(true))

        if (roomIndex !== -1) {
            const newItem = {
                title: '',
                startTime: formatStartDate,
                endTime: formatEndDate,
                isEditable: true,
                id: uuid()
            }
            dispatch(addEvent({roomIndex, newItem, format: time.format}))
            setRoomIndex(roomIndex)
        } else {
            openNotification("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    return (
        <div>
            <Form form={form} initialValues={{
                start_time: time.min,
                end_time: time.max
            }} name="time" onFinish={onFinish}>
                <div className={styles.timepicker}>
                    <div>
                        <p>Начало мероприятия</p>
                        <Form.Item noStyle={true} name="start_time">
                            <TimePicker
                                ref={(el) => timepickers.current[0] = el}
                                placeholder="Select time"
                                steps={time.steps}
                                min={time.min}
                                max={time.max}
                                format={time.format}/>
                        </Form.Item>
                    </div>
                    <div>
                        <p>Окончание мероприятия</p>
                        <Form.Item noStyle={true} name="end_time">
                            <TimePicker
                                ref={(el) => timepickers.current[1] = el}
                                placeholder="Select time" steps={time.steps}
                                min={time.min}
                                max={time.max}
                                format={time.format}/>
                        </Form.Item>
                    </div>
                    <Button type="primary" htmlType="submit">Подобрать</Button>
                </div>
            </Form>

            <div className={styles.tableWrapper}>
                    <div className={styles.grid}>
                        <div className={classNames(styles.row, styles.head)}>
                            <div className={styles.headTitle}>Аудитория</div>
                            {time.list.map(({time}) =>(
                                <div key={uuid()} className={styles.time}>{time}</div>
                            ))}
                        </div>
                        <Grid
                            time={time}
                            data={data}
                            openNotification={openNotification}
                            form={form}
                            roomIndex={roomIndex}
                            setRoomIndex={setRoomIndex}
                        />
                    </div>
                </div>
            </div>
    )
}

export default Room
