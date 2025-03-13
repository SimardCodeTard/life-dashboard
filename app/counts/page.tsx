'use client'

import { useEffect, useState } from "react";
import { Count } from "../types/count.type";
import MonthInfos from "../components/counts-widgets/month-infos.component";
import Card from "../components/shared/card.component";
import moment from "moment";

import './counts-page.css';

export default function AccountsPage () {

    const [selectedCountIndex, setSelectedCountIndex] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [counts, setCounts] = useState<Count[]>([]);

    useEffect(() => {
        setCounts([
            {_id: null as any, name: 'Debug count 1', lastModified: moment(), months: [
                {
                    pay: 1254.48,
                    otherIncome: 89,
                    previousMonthBalance: -74,
                    label: 'Janvier',
                    date: moment(),
                    budgets: [
                        {
                            label:'debug budget 1', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 54, date: moment() },
                            ],
                            isFixed: false
                        }, {
                            label:'debug budget 2', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 69420.80085, date: moment() },
                            ],
                            isFixed: false
                        }, {
                            label:'debug budget 3', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 54, date: moment() },
                            ],
                            isFixed: false
                        }, {
                            label:'debug budget 4', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 54, date: moment() },
                            ],
                            isFixed: false
                        }, {
                            label:'debug budget 5', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 54, date: moment() },
                            ],
                            isFixed: false
                        }, {
                            label:'debug budget 6', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 54, date: moment() },
                            ],
                            isFixed: false
                        }, {
                            label:'debug budget 7', 
                            amount: 874, 
                            expenses: [
                                { label: 'label debug expense 1', amount: 45, date: moment() },
                                { label: 'label debug expense 2', amount: 10, date: moment() },
                                { label: 'label debug expense 3', amount: 140.5, date: moment() },
                                { label: 'label debug expense 4', amount: 54, date: moment() },
                            ],
                            isFixed: false
                        },
                    ]
                }
            ]}
        ])
    }, [setCounts]);

    function refreshCountsState() {
        setCounts(counts);
    }
    
    return <main className="counts-page">
        <div className="counts-page-right-section">
            <select className="bg-[#514D4D] p-2 rounded-sm" value={0}>{
                    counts.map((count, index) => <option key={index} label={count.name} value={index}></option>)
            }</select>
            <Card>
                <MonthInfos month={counts[selectedCountIndex]?.months[selectedMonth]}></MonthInfos>
            </Card>
        </div>
    </main>
}