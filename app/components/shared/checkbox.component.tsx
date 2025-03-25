'use client'

import { Check } from "@mui/icons-material";
import { useState } from "react";


export default function Checkbox (
    { onChange, checked, disabled = false }: 
    { onChange: () => void, checked: boolean; disabled: boolean }
) {

    const [isChecked, setIsChecked] = useState(checked)

    const onClick = () => {
        if(disabled) return;
        setIsChecked(!isChecked);
        onChange();
    }
    return (
        <button disabled={disabled} role="checkbox" aria-checked={isChecked} onClick={() => onClick()}>
            {isChecked ? <Check className="check-icon"/> : ''}
        </button>
    )
}