import React from 'react';
import uuid from "react-uuid";
import styles from "../Room.module.scss";
import classNames from "classnames";
import {throttle} from "throttle-debounce";
import {addMinutes, areIntervalsOverlapping, differenceInMinutes, format, parse} from "date-fns";
import {disableEditableEvent, moveEvent} from "../../../store/slices/roomSlice";
import {useDispatch} from "react-redux";
import Activity from "../Activity/Activity";
import {Time} from "../../../interfaces/Time";
import {RoomData} from "../../../interfaces/State";

interface GridProps {
    data: Array<RoomData>,
    time: Time,
    openNotification: (message: string) => void,
    form: any,
    roomIndex: number,
    setRoomIndex: React.Dispatch<React.SetStateAction<number>>
}

const Grid = ({time, data, openNotification, form, roomIndex, setRoomIndex}: GridProps): JSX.Element => {

    const dispatch = useDispatch()

    const dragItem = {
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

        const date = new Date(0,0,0)

        const activityIndex: string = e.target.dataset.col
        dragItem.roomIndex = roomIndex

        const startTime = activityIndex.split(" - ")[0]
        const endTime = updateEndTimeItem(activityIndex.split(" - ")[0], dragItem.itemLength)

        const maxDate = time.list[time.list.length - 1].steps[1].split(" - ")[1]

        const parsedEndTimeItem = parse(endTime, time.format, date)
        const parsedMaxDate = parse(maxDate, time.format, date)
        const isTimeGreaterThenMax = new Date(parsedMaxDate).getTime() < new Date(parsedEndTimeItem).getTime()

        if (!endTime || isTimeGreaterThenMax) {
            return
        }

        dragItem.startTime = startTime
        dragItem.endTime = endTime

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

        dragItem.isOk = overlappingArr.every((val) => val !== true)
    }

    function dragStartHandler(e: any): void {
        const {startTime, endTime}: {startTime: string, endTime: string} = e.target.dataset
        if (!startTime || !endTime) {
            return
        }
        dragItem.itemLength = getCountCols(startTime, endTime)
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

    function updateEndTimeItem(oldTime: string, length: number) {
        const step = 30
        const date = new Date(0, 0, 0)
        const parsed = parse(oldTime, time.format, date)
        const added = addMinutes(parsed, length * step)
        return format(added, time.format)
    }

    const getCountCols = (startTime: string, endTime: string): number => {
        const date = new Date(0, 0, 0)

        const parseStartTime = parse(startTime, time.format, date)
        const parseEndTime = parse(endTime, time.format, date)

        return differenceInMinutes(parseEndTime, parseStartTime) / 60 * 2
    }

    const onSave = (roomIndex: number, activityIndex: number) => (): void => {
        const item = data[roomIndex].children[activityIndex]

        dispatch(disableEditableEvent({roomIndex, activityIndex}))
        openNotification(`Аудитория успешно забронирована с ${item.startTime} до ${item.endTime}`)
    }

    const minTime = time.list[0].time

    return (
        <>
            {data.map((room, roomIndex) => {
                return (
                    <div key={uuid()} className={styles.row}>
                        <div className={classNames(styles.cell, styles.cellHead)}>
                            {room.title}
                        </div>

                        {time.list.map((time) => {

                            let leftItem: JSX.Element | null = null
                            let rightItem: JSX.Element | null = null

                            room.children.forEach((activity, activityIndex) => {
                                const leftColStartTime = time.steps[0].split(" - ")[0]
                                const rightColStartTime = time.steps[1].split(" - ")[0]

                                if (leftColStartTime === activity.startTime) {
                                    const startCol = getCountCols(minTime, leftColStartTime)
                                    leftItem = <Activity activity={activity}
                                                    activityIndex={activityIndex}
                                                    colStartTime={leftColStartTime}
                                                    startCol={startCol}
                                                    getCountCols={getCountCols}
                                                    roomIndex={roomIndex}
                                                    onSave={onSave}
                                                         dragStartHandler={dragStartHandler}
                                                         dragEndHandler={dragEndHandler}
                                                />
                                }

                                if (rightColStartTime === activity.startTime) {
                                    const startCol = getCountCols(minTime, rightColStartTime)
                                    rightItem = <Activity activity={activity}
                                                      activityIndex={activityIndex}
                                                      colStartTime={rightColStartTime}
                                                      startCol={startCol}
                                                      getCountCols={getCountCols}
                                                      roomIndex={roomIndex}
                                                      onSave={onSave}
                                                          dragStartHandler={dragStartHandler}
                                                          dragEndHandler={dragEndHandler}
                                                    />
                                }
                            })
                            return (
                                <React.Fragment key={uuid()}>
                                    <div className={classNames(styles.cell, styles.left)}
                                         data-col={time.steps[0]}
                                         onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))} />
                                    <div className={classNames(styles.cell, styles.right)}
                                         data-col={time.steps[1]}
                                         onDragOver={throttle(100,(e) => dragOverHandler(e, roomIndex))} />
                                    {leftItem}
                                    {rightItem}
                                </React.Fragment>
                            )})}
                    </div>
                )
            })}
        </>
    );
};

export default Grid;
