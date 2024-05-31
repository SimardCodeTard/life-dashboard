import { ObjectId } from "mongodb";

export type Count = {
    _id: ObjectId;
    name: string;
    months: Month[];
}

export type Month = {
    pay: number;
    otherIncome: number;
    previousMonthPay: number;
    number: number;
    label: string;
    budgets: Budget[];
}

export type Budget = {
    label: string;
    isFixed: boolean;
    expenses: Expense[];
    amount: number;
}

export type Expense = {
    label: string;
    amount: number;
}