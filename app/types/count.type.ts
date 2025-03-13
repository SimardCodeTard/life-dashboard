import { Moment } from "moment";
import { ObjectId } from "mongodb";

export type Count = {
    _id: ObjectId;
    name: string;
    months: Month[];
    lastModified: Moment;
}

export type Month = {
    pay: number;
    otherIncome: number;
    previousMonthBalance: number;
    date: Moment;
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
    date: Moment;
}