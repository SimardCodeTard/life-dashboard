"use client"

import { ChangeEvent, useState } from "react";

export default function TaskCheckbox({completed}: {completed: boolean}) {

    const [isCompleted, setIsCompleted] = useState(completed);

    const updateTaskStatus = (): void => {
        // To implement
    }

    return (
        <input className="task-checkbox" 
            onChange={(_e: ChangeEvent<HTMLInputElement>) => setIsCompleted(!isCompleted)}
             checked={isCompleted} type="checkbox">
        </input>
    )
}