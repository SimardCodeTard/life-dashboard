import Tasks from "../components/dashboard-widgets/tasks/task-list.component";
import Calendar from "../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../components/dashboard-widgets/clock.component";
import SearchBar from "../components/dashboard-widgets/search-bar/search-bar.component";
import Chat from "../components/dashboard-widgets/chat/chat.component";
import Greeting from "../components/dashboard-widgets/greeting/greeting.component";
import FavoritesBar from "../components/dashboard-widgets/favorites-bar/favorites-bar";
import Card from "../components/shared/card.component";
import Weather from "../components/dashboard-widgets/weather/weather.component";

import './dashboard-page.scss';

export default function DashboardPage() {

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
                <Card className="weather-card">
                    <Weather></Weather>
                </Card>
                <Card className="clock-card">
                    <Clock></Clock>
                </Card>
                <Card className="calendar-card">
                    <Calendar></Calendar>
                </Card>
                {/* <Card className="chat-card">
                    <Chat></Chat>
                </Card> */}
            </div>

            <Card className="favorites-bar-card">
                <FavoritesBar></FavoritesBar>
            </Card>
        </main>
    )
}
