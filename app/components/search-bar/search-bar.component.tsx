"use client"
import { useEffect, useState, FormEvent } from 'react';
import styles from '../components.module.css';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SearchOptions from './search-options.component';
import { SearchOptionType } from './search-bar.types';
import Image, { StaticImageData } from 'next/image';

type SearchBarProps = {};

export default function SearchBar({}: SearchBarProps) {
    const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
        console.log('submit')
        event.preventDefault();
        const target = event.target as typeof event.target & {
            0: { value: string };
        };
        if(selectedSearchOption && target[0].value) {
            window.location.href = selectedSearchOption.urlCallBack(target[0].value);
        }
    }

    const onBlur = () => setShowOptions(false);
    const onSelectedSearchOptionClick = () => setShowOptions(!showOptions);

    const [showOptions, setShowOptions] = useState(false);
    const [selectedSearchOption, setSelectedSearchOption] = useState<SearchOptionType | undefined>();

    useEffect(() => {
        setShowOptions(false);
    }, [selectedSearchOption])

    return (
        <form className={'w-1/2 flex flex-col justify-center'} onSubmit={onSubmit}>
            <span className={`${styles.search_bar} flex items-center`}>
                {selectedSearchOption ? (
                    <div className='cursor-pointer ml-2 mr-2' onClick={onSelectedSearchOptionClick}>
                        {selectedSearchOption.Icon 
                            ? <selectedSearchOption.Icon></selectedSearchOption.Icon> 
                            : <Image src={selectedSearchOption.imageData as StaticImageData} height={20} width={20} alt=''></Image>}
                    </div>
                ) : null}
                <input onBlur={onBlur} type='text' 
                    className={`${styles.search_input} p-2 w-full focus:shadow-inner rounded-sm`}
                    placeholder={`Search on ${selectedSearchOption ? selectedSearchOption.name : 'the web'}`}></input>
                <button type='submit' className='ml-2 mr-2 bg-transaprent shadow-none text-[rgba(255,255,255,0.5)]'>
                    <SearchSharpIcon></SearchSharpIcon>
                </button>
            </span>
            <SearchOptions setSelectedSearchOption={setSelectedSearchOption} showOptions={showOptions}></SearchOptions>
        </form>
    );
}
