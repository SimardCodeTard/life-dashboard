import Tasks from "../components/dashboard-widgets/tasks/task-list.component";
import Weather from "../components/dashboard-widgets/weather.component";
import Calendar from "../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../components/dashboard-widgets/clock.component";
import Card from "../components/shared/card.component";
import SearchBar from "../components/dashboard-widgets/search-bar/search-bar.component";
import Chat from "../components/dashboard-widgets/chat/chat.component";

import './dashboard-page.scss';
import Greeting from "../components/dashboard-widgets/greeting/greeting.component";

export default function DashboardPage() {

    return (
        <main>
            <Greeting></Greeting>

            <div className="dashboard-widget-container">

                <Card><SearchBar></SearchBar></Card>

                <Card><Tasks></Tasks></Card>

                <Card><Weather></Weather></Card>

                <Card><Clock></Clock></Card>

                <Card><Calendar></Calendar></Card>

                <Card><Chat></Chat></Card>
            </div>
        </main>
    )
}
