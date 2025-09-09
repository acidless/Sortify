import {useState} from "react";

type Tab = {
    name: string;
    content: React.ReactNode;
}

type TabsProps = {
    tabs: Tab[];
}

const Tabs = ({tabs}: TabsProps) => {
    const [activeTab, setActiveTab] = useState(0);

    return <div>
        <div className="flex gap-4 cursor-pointer justify-center border-b border-gray-700">
            {tabs.map((tab, i) => (<div onClick={() => setActiveTab(i)} key={tab.name} className={`px-4 py-2 transition-colors ${
                i === activeTab
                    ? "border-b-2 border-green-400 text-green-400 font-bold"
                    : "text-gray-400 hover:text-white"
            }`}>
                <p>{tab.name}</p>
            </div>))}
        </div>
        <div className="pt-4">
            {activeTab < tabs.length ? tabs[activeTab].content : ""}
        </div>
    </div>;
}

export default Tabs;