'use client'

import { Budget, Month } from "@/app/types/count.type";
import { ChangeEvent, useEffect, useState } from "react";

export default function MonthInfos({ month }: { month: Month }) {

    const getRemainingBudget = (): number =>  month?.previousMonthPay + month?.pay + month?.otherIncome - month?.budgets.reduce((prev, curr) =>  ({amount: prev.amount + curr.amount} as Budget)).amount ?? 0;

    const [editMonth, setEditMonth] = useState<Month>(month);
    const [remainingBudget, setRemainingBudget] = useState(getRemainingBudget());

    const onPreviousMonthPayValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e)
        if(e.target.value !== null) {
            const previousMonthPay = e.target.valueAsNumber;
            if(!isNaN(previousMonthPay)) {
                setEditMonth({
                    ...editMonth,
                    previousMonthPay
                })
            }
        }
    }

    const onPayValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value !== null) {
            const pay = e.target.valueAsNumber;
            if(!isNaN(pay)) {
                setEditMonth({
                    ...editMonth,
                    pay
                })
            }
        }
    }

    const onOtherIncomeValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value !== null) {
            const otherIncome = e.target.valueAsNumber;
            if(!isNaN(otherIncome)) {
                setEditMonth({
                    ...editMonth,
                    otherIncome
                })
            }
        }
    }

    useEffect(() => {
        setRemainingBudget(getRemainingBudget())
    }, [setRemainingBudget, getRemainingBudget, month]);

    return <div className="p-2 flex flex-col">
        <h1>{month?.label}</h1>
        
        <input
            type="number" 
            placeholder="Solde du mois précédent" 
            value={editMonth?.previousMonthPay} 
            onChange={onPreviousMonthPayValueChange}>
        </input>

        <input
            type="number"
            placeholder="Salaire du mois" 
            value={editMonth?.pay}
            onChange={onPayValueChange}>
        </input>
        
        <input
            type="number" 
            placeholder="Autres rentrées d'argent" 
            value={editMonth?.otherIncome}
            onChange={onOtherIncomeValueChange}>
        </input>
        
        <div>
            <h2>Budget restant</h2>
            <p>{remainingBudget}</p>
        </div>
    </div>
}