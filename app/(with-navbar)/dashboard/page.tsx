'use client';
import Tasks from "../../components/dashboard-widgets/tasks/task-list.component";
import Calendar from "../../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../../components/dashboard-widgets/clock.component";
import SearchBar from "../../components/dashboard-widgets/search-bar/search-bar.component";
import Greeting from "../../components/dashboard-widgets/greeting/greeting.component";
import FavoritesBar from "../../components/dashboard-widgets/favorites-bar/favorites-bar";
import Card from "../../components/shared/card.component";
import Weather from "../../components/dashboard-widgets/weather/weather.component";
import { redirect } from "next/navigation"

import './dashboard-page.scss';
import { useEffect } from "react";
import { getActiveSession } from "@/app/utils/indexed-db.utils";


export default function DashboardPage() {

    useEffect(() => {
        getActiveSession().then(activeSession => {
            if(!activeSession) {
                redirect('/login');
            }
        })
    })

    return (
        <main className="dashboard-page">
            <Greeting></Greeting>
            <Card className="search-bar-card">
                 <SearchBar></SearchBar>
            </Card>

            <div className="dashboard-widgets-grid">
                <Card className="tasks-card">
                    <Tasks></Tasks>
                </Card>
                <Card className="clock-card">
                    <Clock></Clock>
                </Card>
                <Card className="weather-card">
                    <Weather></Weather>
                </Card>

                <Card className="calendar-card">
                    <Calendar></Calendar>
                </Card>
            </div>

            <Card className="favorites-bar-card">
                <FavoritesBar></FavoritesBar>
            </Card>
        </main>
    )
}
