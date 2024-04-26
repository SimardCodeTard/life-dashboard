import Tasks from "../components/dashboard-widgets/tasks/task-list.component";
import Weather from "../components/dashboard-widgets/weather.component";
import Calendar from "../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../components/dashboard-widgets/clock.component";
import Card from "../components/shared/card.component";
import SearchBar from "../components/dashboard-widgets/search-bar/search-bar.component";
import FavoritesBar from "../components/dashboard-widgets/favorites-bar/favorites-bar";
import Chat from "../components/dashboard-widgets/chat/chat.component";

export default function DashboardPage() {

    return (
        <main className="flex h-full w-full justify-between grow">

            <div className="left-section w-1/4">
                <Card className="left-section-card"><Tasks></Tasks></Card>
                <Card className="left-section-card"><Weather></Weather></Card>
            </div>


            <div className="center-col m-4 flex flex-col w-full items-center">
            
                <div className="top-section w-full flex flex-col items-center justify-items-start space-y-24">
                    <SearchBar></SearchBar>
                    <Clock></Clock>
                </div>

                <div className="center-section"></div>

                <div className="bottom-section">
                    <FavoritesBar></FavoritesBar>
                </div>

            </div>

            <div className="right-section flex flex-col w-1/4 h-full">
                    <Card><Calendar></Calendar></Card>
                    <Card><Chat></Chat></Card>
            </div>

        </main>
    )
}
