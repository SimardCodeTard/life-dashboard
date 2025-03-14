'use client'

import { useState } from "react"

export default function Checkbox (
    { onChange, checked }: 
    { onChange: () => void, checked: boolean }
) {

    const [isChecked, setIsChecked] = useState(checked)

    const onClick = () => {
        setIsChecked(!isChecked);
        onChange();
    }
    return (
        <button role="checkbox" aria-checked={isChecked} onClick={() => onClick()}>
            {isChecked ? '✓' : ''}
        </button>
    )
}