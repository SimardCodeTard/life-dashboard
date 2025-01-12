import { SearchOptionData } from "../data/search-options.data";
import { SearchBarOptionsPropsType, SearchOptionType } from "../../../../types/search-bar.types";
import { Key, useEffect } from "react";
import { SearchOptionPropsType } from '../../../../types/search-bar.types';
import Image, { StaticImageData } from 'next/image'

import '../../../components.css';

function SearchOption({ searchOption, setSelectedSearchOption }: SearchOptionPropsType) {
    return (
        <span className="action-icon-wrapper" onClick={() => {setSelectedSearchOption(searchOption)}}>
            {searchOption.Icon ?  <searchOption.Icon></searchOption.Icon> : <Image src={searchOption.imageData as StaticImageData} alt={searchOption.name} width={20} height={20} ></Image>}
        </span>
    );
}


export default function SearchOptions({ showOptions, setSelectedSearchOption }: SearchBarOptionsPropsType) {
    
    useEffect(() => {
        setSelectedSearchOption(SearchOptionData[0]);
    }, [setSelectedSearchOption]);

    
    return (
        <span className={`search-options actions-wrapper ${!showOptions ? 'folded' : ''}`}>
            {SearchOptionData.map((option: SearchOptionType, key: Key) => (
                <SearchOption 
                    setSelectedSearchOption={setSelectedSearchOption} 
                    key={key} 
                    searchOption={option}   
                />
            ))}
        </span>
    );
}


