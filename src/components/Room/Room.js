import React, {useState} from "react";
import {Button, Form, notification} from 'antd';
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

    const [roomIndex, setRoomIndex] = useState();
    const [form] = Form.useForm()

    const time = {
        format: "HH:mm",
            min: new Date(null, null, null, 8, 0),
            max: new Date(null, null, null, 18, 0),
            steps: {
            minute: 30
        },
        list: ['8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30', '9:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30', '12:30 - 13:00', '13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00', '17:00 - 17:30', '17:30 - 18:00']
    }

    const openNotification = message => {
        notification.info({
            message: message,
            description: "",
            placement: "topLeft",
        });
    };

    const getCountCols = (startTime, endTime) => {
        const parseStartTime = parse(startTime, time.format, new Date(null))
        const parseEndTime = parse(endTime, time.format, new Date(null))

        return differenceInMinutes(parseEndTime, parseStartTime) / 60 * 2
    }

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

        const roomIndex = overlappingArr.findIndex(arr => !arr.includes(true))

        if (roomIndex !== -1) {
            const newItem = {
                title: '',
                startTime: formatStartDate,
                endTime: formatEndDate,
                isEditable: true
            }
            dispatch(addEvent({roomIndex, newItem, format: time.format}))
            setRoomIndex(roomIndex)
        } else {
            openNotification("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    const onSave = (roomIndex, activityIndex) => () => {
        const item = data[roomIndex].children[activityIndex]

        dispatch(disableEditableEvent({roomIndex, activityIndex}))
        openNotification(`Аудитория успешно забронирована с ${item.startTime} до ${item.endTime}`)
    }

    let dragItem = {
        itemLength: 1,
        isOk: false,
        roomIndex: null,
        startTime: null,
        endTime: null,
    }

    function dragOverHandler(e, roomIndex) {

        const activityIndex = parseInt(e.target.dataset.col)

        dragItem.roomIndex = roomIndex

        const startTime = time.list[activityIndex].split(" - ")[0]
        const endTime = time.list[activityIndex + dragItem.itemLength - 1]?.split(" - ")[1]

        if (!endTime) {
            return
        }

        dragItem.startTime = startTime
        dragItem.endTime = endTime

        const date = new Date(null, null, null)
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

    function dragEndHandler() {

        if (dragItem.isOk) {
            const newItem = {
                title: '',
                startTime: dragItem.startTime,
                endTime: dragItem.endTime,
                isEditable: true
            }
            dispatch(moveEvent({roomIndex, newItem, dragItem, format: time.format}))
            setRoomIndex(dragItem.roomIndex)

            form.setFieldsValue({
                start_time: parse(newItem.startTime, time.format, new Date(null, null, null)),
                end_time: parse(newItem.endTime, time.format, new Date(null, null, null))
            })
        } else {
            openNotification("Нет подходящих аудиторий, попробуйте изменить время")
        }
    }

    function dragStartHandler(e) {
        dragItem.itemLength = e.target.colSpan
    }

    function onWheel(e) {
        e.currentTarget.scrollLeft += e.deltaY * 0.4;
    }

    function renderBodyTable() {
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
                                .map((item, index) => <td onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))} data-col={countCols - offsetCols - colspan + index} key={uuid()} />)
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
                    {new Array(time.list.length - countCols).fill(null).map((item, index) => (
                        <td onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))} data-col={countCols + index} key={uuid()} />))}
                </tr>
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
                        <Form.Item noStyle="true" name="start_time">
                            <TimePicker placeholder="Select time" steps={time.steps}
                                        min={time.min} max={time.max} format={time.format}/>
                        </Form.Item>
                    </div>
                    <div>
                        <p>Окончание мероприятия</p>
                        <Form.Item noStyle="true" name="end_time">
                            <TimePicker placeholder="Select time" steps={time.steps}
                                        min={time.min} max={time.max} format={time.format}/>
                        </Form.Item>
                    </div>
                    <Button type="primary" htmlType="submit">Подобрать</Button>
                </div>
            </Form>

            <div onWheel={onWheel} className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <td className={styles.colTitle}/>
                        {time.list.map(item => <td key={uuid()} className={styles.colTime}>{item}</td>)}
                    </tr>
                    </thead>
                    <tbody>
                        {renderBodyTable()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Room
