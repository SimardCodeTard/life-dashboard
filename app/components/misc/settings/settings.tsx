import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import './settings.scss';
import GeneralSettings from "./general-settings/general-settings";
import UserSettings from "./user-settings/user-settings";

export default function Settings () {
    const [tabs, setTabs] = useState([
        { id: 0, icon: <SettingsIcon></SettingsIcon>, label: 'General', component: <GeneralSettings></GeneralSettings>},
        { id: 1, icon: <ManageAccountsIcon></ManageAccountsIcon>, label: 'User', component: <UserSettings></UserSettings>},
    ]);

    const [selectedTabId, setSelectedTabId] = useState(0);

    return <div className="settings">
        <div className="settings-sidebar">
            {
                tabs.map(tab => <div className="tab" onClick={() => {setSelectedTabId(tab.id)}} key={`tab-${tab.id}`}>
                    {tab.icon}
                    <p>{tab.label}</p>
                </div>)
            }
        </div>
        <div className="settings-content">
            {tabs[selectedTabId].component}
        </div>
    </div>
}