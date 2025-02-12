"use client"
import { ChangeEvent, useState } from "react";

export default function TaskCheckbox({completed, updateTaskStatus}: {completed: boolean, updateTaskStatus: (status: boolean) => void}) {

    const [isCompleted, setIsCompleted] = useState(completed);

    const onStatusChange = (): void => {
        updateTaskStatus(!isCompleted)
        setIsCompleted(!isCompleted);
    }

    return (
        <input className="task-checkbox" 
            onChange={(_e: ChangeEvent<HTMLInputElement>) => onStatusChange()}
             checked={isCompleted} type="checkbox">
        </input>
    )
}