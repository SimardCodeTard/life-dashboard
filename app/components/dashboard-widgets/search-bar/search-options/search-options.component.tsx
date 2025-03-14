import { SearchOptionData } from "../data/search-options.data";
import { SearchBarOptionsPropsType, SearchOptionType } from "../../../../types/search-bar.types";
import { Key, useEffect, useState } from "react";
import { SearchOptionPropsType } from '../../../../types/search-bar.types';
import Image, { StaticImageData } from 'next/image';

import '../../../components.scss';
import '../search-bar.scss'
import { Logger } from "@/app/services/logger.service";

function SearchOption({ searchOption, onClick }: SearchOptionPropsType) {
    return (
        <option value={searchOption.name} className="action-icon-wrapper" onClick={() => {onClick(searchOption)}}>
            {searchOption.name}
        </option>
    );
}


export default function SearchOptions({ showOptions, setSelectedSearchOption, selectedSearchOption, onSearchOptionShiftClick }: SearchBarOptionsPropsType) {
    
    const [userShifting, setUserShifting] = useState<boolean>(false);

    const onSearchOptionClick = (searchOption: SearchOptionType) => {
        Logger.debug(`Search option clicked: ${searchOption.name}, is shifting: ${userShifting}`);
        setSelectedSearchOption(searchOption);
    }

    useEffect(() => {
        Logger.debug(`Selected search option changed to ${selectedSearchOption?.name}, is shifting: ${userShifting}`);
        if(userShifting) {
            onSearchOptionShiftClick(selectedSearchOption as SearchOptionType);
        }
    }, [selectedSearchOption]);

    useEffect(() => {
        setSelectedSearchOption(SearchOptionData[0]);
    }, [setSelectedSearchOption]);

    useEffect(() => {
        // Shift key detection
        window.onkeyup = (e: KeyboardEvent) => {
            if(e.key == 'Shift') {
                // User started shifting
                setUserShifting(false);
            }
        }
        window.onkeydown = (e: KeyboardEvent) => {
            if(e.key == 'Shift') {
                // User stopped shifting
                setUserShifting(true);
            }
        }
    }, [])

    
    return (
        <select className={`search-options actions-wrapper`}>
            {SearchOptionData.map((option: SearchOptionType, key: Key) => (
                <SearchOption 
                    onClick={onSearchOptionClick} 
                    key={key} 
                    searchOption={option}   
                />
            ))}
        </select>
    );
}


