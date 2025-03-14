"use client"
import Checkbox from "../../shared/checkbox.component";

export default function TaskCheckbox(
    { completed, updateTaskStatus}
    : { completed: boolean, updateTaskStatus: (status: boolean) => void}
) {

    const onStatusChange = (): void => {
        updateTaskStatus(!completed)
    }

    return (
        <Checkbox onChange={onStatusChange} checked={completed}></Checkbox>
    )
}