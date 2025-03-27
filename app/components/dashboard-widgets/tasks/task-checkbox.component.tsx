"use client"
import Checkbox from "../../shared/checkbox.component";

export default function TaskCheckbox(
    { completed, updateTaskStatus, disabled = false}
    : Readonly<{ completed: boolean, updateTaskStatus: (status: boolean) => void, disabled: boolean}>
) {

    const onStatusChange = (): void => {
        updateTaskStatus(!completed)
    }

    return (
        <Checkbox onChange={onStatusChange} disabled={disabled} checked={completed}></Checkbox>
    )
}