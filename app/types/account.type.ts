import { ObjectId } from "mongodb";

export type Account = {
    _id: ObjectId;
    name: string;
    months: Month[];
}

export type Month = {
    pay: number;
    otherIncome: number;
    aids: number;
    previousMonthPay: number;
    number: number;
    label: string;
    remainingBudget: number;
    totalExpenseAmount: number;
    budgets: Budget[];
}

export type Budget = {
    isFixed: boolean;
    expenses: Expense[];
    amount: number;
}

export type Expense = {
    label: string;
    amount: number;
}