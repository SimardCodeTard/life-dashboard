import { TabPropsType } from "@/app/types/navbar.type";
import { Tab } from "./tab.component";

export default function NavBar() {
  const tabs: TabPropsType[] = [
    { href: '/', label: '', isHome: true },
    { href: '/game', label: 'Life Game', isHome: false }
  ];

  return (
    <div className='navbar w-[100vw] h-14 bg-[var(--background-navbar)] shadow-xl flex items-center p-1 px-4 space-x-2'>
      {tabs.map((tab, key) => (
        <Tab
          key={key}
          href={tab.href}
          label={tab.label}
        />
      ))}
    </div>
  );
}
