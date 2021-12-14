import React, {RefObject, useEffect, useRef, useState} from "react";
import {Button, Form, notification} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import styles from "./Room.module.scss";
import {TimePicker} from "@progress/kendo-react-dateinputs";
import {format, parse, differenceInMinutes, areIntervalsOverlapping} from 'date-fns'
import uuid from 'react-uuid'
import classNames from "classnames";
import { throttle } from "throttle-debounce";
import {useDispatch, useSelector} from "react-redux";
import {addEvent, moveEvent, disableEditableEvent, roomSelector} from "../../store/slices/roomSlice"

const Room = () => {

    const { data } = useSelector(roomSelector)
    const dispatch = useDispatch()

    const [roomIndex, setRoomIndex] = useState<number>(-1);
    const [form] = Form.useForm()
    const colRef = useRef<any>(null)
    const activityItems = useRef<any>([])

    useEffect(() => {
        setTimeout(() => {
            setWidthActivities()
            window.addEventListener("resize", setWidthActivities)
        }, 0)

        return function () {
            window.removeEventListener("resize", setWidthActivities)
        }
    }, [data])

    function setWidthActivities() {
        activityItems.current.forEach((el: any) => {
            if (el !== null) {
                const {startTime, endTime} = el.dataset
                const columns = getCountCols(startTime, endTime)
                el.style.width = ((colRef.current.clientWidth * columns) / 2) - 16 + "px"
            }
        })
    }

    const time = {
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

    const getCountCols = (startTime: string, endTime: string): number => {
        const date = new Date(0, 0, 0)

        const parseStartTime = parse(startTime, time.format, date)
        const parseEndTime = parse(endTime, time.format, date)

        return differenceInMinutes(parseEndTime, parseStartTime) / 60 * 2
    }

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

    const onSave = (roomIndex: number, activityIndex: number) => (): void => {
        const item = data[roomIndex].children[activityIndex]

        dispatch(disableEditableEvent({roomIndex, activityIndex}))
        openNotification(`Аудитория успешно забронирована с ${item.startTime} до ${item.endTime}`)
    }

    let dragItem = {
        itemLength: 0,
        isOk: false,
        roomIndex: -1,
        startTime: "",
        endTime: "",
    }

    function dragOverHandler(e: any, roomIndex: number): void {
        if (!e.target.dataset.col) {
            return
        }

        console.log(roomIndex)

        const activityIndex: string = e.target.dataset.col
        dragItem.roomIndex = roomIndex

        // const startTime = time.list[activityIndex].split(" - ")[0]
        // const endTime = time.list[activityIndex + dragItem.itemLength - 1]?.split(" - ")[1]
        const startTime = activityIndex.split(" - ")[0]
        const endTime = activityIndex.split(" - ")[1]

        if (!endTime) {
            return
        }

        dragItem.startTime = startTime
        dragItem.endTime = endTime

        const date = new Date(0, 0, 0)
        const parseStartTime = parse(startTime, time.format, date)
        const parseEndTime = parse(endTime, time.format, date)


        const overlappingArr = data[roomIndex].children.map((item) => {
            if (item.isEditable) {
                return false
            }
                const parseItemStartDate = parse(item.startTime, time.format, date)
                const parseItemEndDate = parse(item.endTime, time.format, date)
                return areIntervalsOverlapping(
                    {start: parseStartTime, end: parseEndTime},
                    {start: parseItemStartDate, end: parseItemEndDate}
                )
        })

        dragItem.isOk = overlappingArr.every(val => val !== true)
    }

    function dragEndHandler(): void {

        if (dragItem.isOk) {
            const newItem = {
                title: '',
                startTime: dragItem.startTime,
                endTime: dragItem.endTime,
                isEditable: true,
                id: uuid()
            }
            dispatch(moveEvent({roomIndex, newItem, dragItem, format: time.format}))
            setRoomIndex(dragItem.roomIndex)

            const date = new Date(0, 0, 0)

            form.setFieldsValue({
                start_time: parse(newItem.startTime, time.format, date),
                end_time: parse(newItem.endTime, time.format, date)
            })
        } else {
            openNotification("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    function dragStartHandler(e: any): void {
        const {startTime, endTime} = e.target.dataset
        dragItem.itemLength = getCountCols(startTime, endTime)
    }

    function renderBodyTable(): JSX.Element[] {
        return data.map((room, roomIndex) => {
            // количество колонок до последнего существующего мероприятия
            let countCols = 0
            return (
                <tr key={uuid()}>
                    <td className={styles.colTitle}>{room.title}</td>

                    {room.children.map((activity, activityIndex, arrActivity) => {
                            const prev = arrActivity[activityIndex - 1]
                            // отступ по колонкам
                            let offsetCols = 0

                            if (prev) {
                                offsetCols = getCountCols(prev.endTime, activity.startTime)
                            }

                            // сколько колонок займет блок
                            const colspan = getCountCols(activity.startTime, activity.endTime)
                            countCols += offsetCols + colspan

                            const emptyCols = new Array(offsetCols).fill(null)
                                .map((item, index) => <td
                                    onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))}
                                    data-col={countCols - offsetCols - colspan + index}
                                    key={uuid()} />)

                            return (
                                <React.Fragment key={uuid()}>
                                    {emptyCols}
                                    {activity.isEditable ?
                                        <td colSpan={colspan}
                                            draggable="true"
                                            onDragStart={dragStartHandler}
                                            onDragEnd={dragEndHandler}
                                            className={styles.tableEditable}>{activity.title}
                                            <SaveOutlined onClick={onSave(roomIndex, activityIndex)}
                                                          className={styles.tableSave}/>
                                        </td> :
                                        <td colSpan={colspan}
                                            className={styles.tableTitle}>{activity.title}</td>
                                    }
                                </React.Fragment>
                            )
                        }
                    )}
                    {/* пустые колонки после мероприятий */}
                    {new Array(time.list.length - countCols).fill(null)
                        .map((item, index) => <td
                            onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))}
                            data-col={countCols + index}
                            key={uuid()} />)}
                </tr>
            )
        })
    }

    function renderGrid(): JSX.Element[] {
        return data.map((room) => {
            return (
                <div key={uuid()} className={styles.row}>
                    <div className={classNames(styles.cell, styles.cellHead)}>
                        {room.title}
                        <span className={styles.place}>20 мест</span>
                    </div>

                    {time.list.map((time) => {

                        let leftItem: JSX.Element | null = null
                        let rightItem: JSX.Element | null = null

                        room.children.forEach((activity, activityIndex) => {
                            const leftColStartTime = time.steps[0].split(" - ")[0]
                            const rightColStartTime = time.steps[1].split(" - ")[0]

                            const dragOptions = {draggable: true, onDragStart: dragStartHandler, onDragEnd: dragEndHandler}

                            if (leftColStartTime === activity.startTime) {
                                const draggable = activity.isEditable ? dragOptions : null
                                leftItem = (
                                    <div {...draggable}
                                        ref={(el) => activityItems.current.push(el)}
                                        data-start-time={leftColStartTime}
                                        data-end-time={activity.endTime}
                                        className={classNames(styles.broned, {
                                            [styles.editable]: activity.isEditable
                                        })}>
                                        <div>{activity.startTime} - {activity.endTime}</div>
                                        <div>{activity.title}</div>
                                        {activity.isEditable && (
                                            <SaveOutlined
                                                onClick={onSave(roomIndex, activityIndex)}
                                                className={styles.save}/>
                                        )}
                                    </div>
                                )
                            }

                            if (rightColStartTime === activity.startTime) {
                                const draggable = activity.isEditable ? dragOptions : null
                                rightItem = (
                                    <div {...draggable}
                                         ref={(el) => activityItems.current.push(el)}
                                         data-start-time={rightColStartTime}
                                         data-end-time={activity.endTime}
                                         className={classNames(styles.broned, {
                                            [styles.editable]: activity.isEditable
                                         })}>
                                        <div>{activity.startTime} - {activity.endTime}</div>
                                        <div>{activity.title}</div>
                                        {activity.isEditable && (
                                            <SaveOutlined
                                                onClick={onSave(roomIndex, activityIndex)}
                                                className={styles.save}/>
                                        )}
                                    </div>
                                )
                            }
                        })
                        return (
                            <div ref={colRef} key={uuid()} className={styles.cell}>
                                <div data-col={time.steps[0]}
                                    onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))}>
                                     {leftItem}
                                 </div>
                                <div data-col={time.steps[1]}
                                    onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))}>
                                    {rightItem}
                                </div>
                            </div>
                        )})}
                </div>
            )
        })
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
                            <TimePicker placeholder="Select time" steps={time.steps}
                                        min={time.min} max={time.max} format={time.format}/>
                        </Form.Item>
                    </div>
                    <div>
                        <p>Окончание мероприятия</p>
                        <Form.Item noStyle={true} name="end_time">
                            <TimePicker placeholder="Select time" steps={time.steps}
                                        min={time.min} max={time.max} format={time.format}/>
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
                        {renderGrid()}
                    </div>
                </div>
            </div>
    )
}

export default Room
