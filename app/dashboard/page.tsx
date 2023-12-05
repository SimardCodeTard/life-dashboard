import Tasks from "../components/dashboard-widgets/tasks/task-list.component";
import Weather from "../components/client/weather.component";
import Calendar from "../components/dashboard-widgets/calendar/calendar.component";
import Clock from "../components/client/clock.component";
import Card from "../components/dashboard-widgets/generic/card.component";
import SearchBar from "../components/search-bar/search-bar.component";

export default function DashboardPage() {

    return (
        <main className="flex w-full justify-between">

            <div className="left-section w-1/4">
                <Card><Tasks></Tasks></Card>
                <Card><Weather></Weather></Card>
            </div>


            <div className="center-col m-4 flex w-full justify-center">
            
                <div className="top-section w-full flex flex-col items-center justify-items-start space-y-24">
                    <SearchBar></SearchBar>
                    <Clock></Clock>
                </div>

                <div className="center-section"></div>

                <div className="bottom-section"></div>

            </div>

            <div className="right-section w-1/4">
                    <Card><Calendar></Calendar></Card>
            </div>

        </main>
    )
}
