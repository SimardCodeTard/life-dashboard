'use client'

import { Check } from "@mui/icons-material";
import { useState } from "react";


export default function Checkbox (
    { onChange, checked, disabled = false, name }: 
    Readonly<{ onChange: () => void, checked: boolean; disabled?: boolean, name?: string }>
) {

    const [isChecked, setIsChecked] = useState(checked)

    const onClick = () => {
        if(disabled) return;
        setIsChecked(!isChecked);
        onChange();
    }
    return (
        <button disabled={disabled} name={name} role="checkbox" type="button" aria-checked={isChecked} onClick={() => onClick()}>
            {isChecked ? <Check className="check-icon"/> : ''}
        </button>
    )
}