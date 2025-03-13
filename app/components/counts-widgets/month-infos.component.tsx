'use client'

import { Budget, Month } from "@/app/types/count.type";
import { ChangeEvent, useEffect, useState } from "react";

import './counts-widgets.css';

export default function MonthInfos({ month }: { month: Month }) {

    const getRemainingBudget = (): number =>  month?.previousMonthBalance + month?.pay + month?.otherIncome - month?.budgets.reduce((prev, curr) =>  ({amount: prev.amount + curr.amount} as Budget)).amount;

    const [editMonth, setEditMonth] = useState<Month>(month);
    const [remainingBudget, setRemainingBudget] = useState(getRemainingBudget());

    useEffect(() => {
        console.log(month)
    }, []);

    const onPreviousMonthBalanceValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e)
        if(e.target.value !== null) {
            const previousMonthBalance = e.target.valueAsNumber;
            if(!isNaN(previousMonthBalance)) {
                setEditMonth({
                    ...editMonth,
                    previousMonthBalance
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

    return <div className="month-infos">
        <h1>{month?.label}</h1>
        
        <label htmlFor="previousMonthBalance">Solde du mois précédent</label>
        <input
            name="previousMonthBalance"
            type="number"  
            value={editMonth?.previousMonthBalance} 
            onChange={onPreviousMonthBalanceValueChange}>
        </input>


        <label htmlFor="pay">Salaire du mois</label>
        <input
            name="pay"
            type="number"
            value={editMonth?.pay}
            onChange={onPayValueChange}>
        </input>
        
        <label htmlFor="otherIncome">Autres rentrées d'argent</label>
        <input
            type="number" 
            name="otherIncome"
            value={editMonth?.otherIncome}
            onChange={onOtherIncomeValueChange}>
        </input>
        
        <div>
            <h2>Budget restant</h2>
            <b>{remainingBudget}</b>
        </div>
    </div>
}