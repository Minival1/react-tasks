import React from 'react';
import {ActivityItem} from "../../../interfaces/Activity";
import classNames from "classnames";
import {SaveOutlined} from '@ant-design/icons';
import styles from "../Room.module.scss";

interface ActivityProps {
    activity: ActivityItem,
    activityIndex: number,
    colStartTime: string,
    startCol: number,
    getCountCols: (startTime: string, endTime: string) => number,
    roomIndex: number
    onSave: (roomIndex: number, activityIndex: number) => () => void,
    dragStartHandler: (e: any) => void,
    dragEndHandler: (e: any) => void
}

const Activity = (props: React.PropsWithChildren<ActivityProps>): JSX.Element => {
    const {activity, activityIndex, colStartTime, startCol, getCountCols, roomIndex, onSave, dragStartHandler, dragEndHandler} = props

    const dragOptions = {draggable: true, onDragStart: dragStartHandler, onDragEnd: dragEndHandler}
    const draggable = activity.isEditable ? dragOptions : null
    const initialOffsetCols = 2

    return (
        <div {...draggable}
             style={{ gridColumnStart: startCol + initialOffsetCols, gridColumnEnd: "span " + getCountCols(activity.startTime, activity.endTime) }}
             data-start-time={colStartTime}
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
};

export default Activity;
