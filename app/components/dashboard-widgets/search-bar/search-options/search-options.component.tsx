import { SearchOptionData } from "../data/search-options.data";
import { SearchBarOptionsPropsType, SearchOptionType } from "../../../../types/search-bar.types";
import { Key, useEffect, useState } from "react";
import { SearchOptionPropsType } from '../../../../types/search-bar.types';
import Image, { StaticImageData } from 'next/image';

import '../../../components.css';
import { Logger } from "@/app/services/logger.service";

function SearchOption({ searchOption, onClick }: SearchOptionPropsType) {
    return (
        <span className="action-icon-wrapper" onClick={() => {onClick(searchOption)}}>
            {searchOption.Icon ?  <searchOption.Icon></searchOption.Icon> : <Image src={searchOption.imageData as StaticImageData} alt={searchOption.name} width={20} height={20} ></Image>}
        </span>
    );
}


export default function SearchOptions({ showOptions, setSelectedSearchOption, onSearchOptionShiftClick }: SearchBarOptionsPropsType) {
    
    const [userShifting, setUserShifting] = useState<boolean>(false);

    const onSearchOptionClick = (searchOption: SearchOptionType) => {
        Logger.debug(`Search option clicked: ${searchOption.name}, is shifting: ${userShifting}`);
        if(userShifting) {
            onSearchOptionShiftClick(searchOption);
            return;
        }
        setSelectedSearchOption(searchOption);
    }

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
        <span className={`search-options actions-wrapper ${!showOptions ? 'folded' : ''}`}>
            {SearchOptionData.map((option: SearchOptionType, key: Key) => (
                <SearchOption 
                    onClick={onSearchOptionClick} 
                    key={key} 
                    searchOption={option}   
                />
            ))}
        </span>
    );
}


