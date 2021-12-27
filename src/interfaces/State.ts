import {ActivityItem} from "./Activity";

export interface RoomData {
    title: string,
    id: number,
    children: Array<ActivityItem>
}
