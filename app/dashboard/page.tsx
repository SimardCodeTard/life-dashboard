'use client';
import Tasks from "../components/dashboard-widgets/tasks/task-list.component";
import Calendar from "../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../components/dashboard-widgets/clock.component";
import SearchBar from "../components/dashboard-widgets/search-bar/search-bar.component";
import Greeting from "../components/dashboard-widgets/greeting/greeting.component";
import FavoritesBar from "../components/dashboard-widgets/favorites-bar/favorites-bar";
import Card from "../components/shared/card.component";
import Weather from "../components/dashboard-widgets/weather/weather.component";
import { redirect } from "next/navigation"

import './dashboard-page.scss';
import { useEffect } from "react";
import { getUserFromLocalStorage } from "../utils/localstorage.utils";

export default function DashboardPage() {

    useEffect(() => {
        if(!getUserFromLocalStorage()) {
            redirect('/login');
        }
    })

    return (
        <main className="dashboard-page">
            <Greeting></Greeting>
            <Card className="search-bar-card">
                 <SearchBar></SearchBar>
            </Card>

            <div className="dashboard-widgets-grid">
                <Card className="calendar-card">
                    <Calendar></Calendar>
                </Card>
                <Card className="tasks-card">
                    <Tasks></Tasks>
                </Card>
                <Card className="weather-card">
                    <Weather></Weather>
                </Card>
                <Card className="clock-card">
                    <Clock></Clock>
                </Card>
            </div>

            <Card className="favorites-bar-card">
                <FavoritesBar></FavoritesBar>
            </Card>
        </main>
    )
}
