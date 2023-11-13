import { SearchOptionData } from "./data/search-options.data";
import { SearchBarOptionsPropsType, SearchOptionType } from "./search-bar.types";
import { useEffect } from "react";
import { SearchOptionPropsType } from './search-bar.types';
import Image, { StaticImageData } from 'next/image'
import styles from '../../components.module.css'

function SearchOption({ searchOption, setSelectedSearchOption }: SearchOptionPropsType) {
    return (
        <button type="button" onClick={() => {setSelectedSearchOption(searchOption)}} className='text-xs'>
            {searchOption.Icon ?  <searchOption.Icon></searchOption.Icon> : <Image src={searchOption.imageData as StaticImageData} alt={searchOption.name} width={20} height={20} ></Image>}
        </button>
    );
}


export default function SearchOptions({ showOptions, setSelectedSearchOption }: SearchBarOptionsPropsType) {
    
    useEffect(() => {
        setSelectedSearchOption(SearchOptionData[0]);
    }, []);
    
    const options = Object.values(SearchOptionData) as SearchOptionType[];

    return (
        <div className={`flex shadow-inner space-x-2 transition ${styles.search_options} ${!showOptions ? styles.folded : ''}`}>
            {options.map((option, key) => (
                <SearchOption 
                    setSelectedSearchOption={setSelectedSearchOption} 
                    key={key} 
                    searchOption={option}   
                />
            ))}
        </div>
    );
}


