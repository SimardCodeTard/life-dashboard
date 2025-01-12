import Tasks from "../components/dashboard-widgets/tasks/task-list.component";
import Weather from "../components/dashboard-widgets/weather.component";
import Calendar from "../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../components/dashboard-widgets/clock.component";
import Card from "../components/shared/card.component";
import SearchBar from "../components/dashboard-widgets/search-bar/search-bar.component";
import FavoritesBar from "../components/dashboard-widgets/favorites-bar/favorites-bar";
import Chat from "../components/dashboard-widgets/chat/chat.component";

import './dashboard-page.css'

export default function DashboardPage() {

    return (
        <main>

            <div className="left-section dashboard-section">
                <Card className="left-section-card"><Tasks></Tasks></Card>
                <Card className="left-section-card"><Weather></Weather></Card>
            </div>


            <div className="center-col">
            
                <div className="top-section dashboard-section">
                    <SearchBar></SearchBar>
                    <Clock></Clock>
                </div>

                <div className="center-section dashboard-section">
                </div>

                <div className="bottom-section dashboard-section">
                    <FavoritesBar></FavoritesBar>
                </div>

            </div>

            <div className="right-section dashboard-section">
                    <Card><Calendar></Calendar></Card>
                    <Card><Chat></Chat></Card>
            </div>
        </main>
    )
}
