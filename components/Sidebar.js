import React from 'react'
import { HiMagnifyingGlass } from "react-icons/hi2";
import Conversation from "@/components/Conversation.js";
import CustomScrollbar from "@/components/CustomScrollbar";


const Sidebar = () => {
    return (
        <aside className="flex flex-col w-1/4 h-[calc(100dvh-5rem)] border-r-2 border-r-(--border-lines)">
            <section className="w-full min-h-16 flex justify-center items-center border-b-2 border-b-(--border-lines)" >
                <div className="flex justify-center items-center w-[calc(3.5/4*100%)] h-10 rounded-xl border-2 border-(--border-lines) bg-(--input-color)" >
                    <HiMagnifyingGlass className="size-6 mx-2 text-(--search-icon)" />
                    <input className="w-full h-full outline-0 placeholder:text-(--search-icon)/50" type="text" placeholder="Search" />
                </div>
            </section>
            <CustomScrollbar>
                <div className="flex flex-col w-full">
                    {Array(30).fill(0).map((_, idx) => (
                        <Conversation isFirst={idx === 0 ? true : false} key={idx} />
                    ))}
                </div>
            </CustomScrollbar>
        </aside>
    )
}

export default Sidebar