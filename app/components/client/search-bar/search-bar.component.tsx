"use client"
import { useEffect, useState, FormEvent, ReactElement } from 'react';
import styles from '../../components.module.css';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SearchOptions from './search-options/search-options.component';
import { SearchOptionType } from './search-bar.types';
import Image, { StaticImageData } from 'next/image';

type SearchBarProps = {};

export default function SearchBar({ }: SearchBarProps) {

    const buildSearchUrl = (query: string): string => {
        const {url, path, queryParamName, queryWordsSeparator} = selectedSearchOption as SearchOptionType;
        return `${ url }${ path ? path.startsWith('/') ? path : `/${ path }` : '' }?${ queryParamName }=${ query.replaceAll(' ', queryWordsSeparator) }` 
    }

    const onSearchBarSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (userShifting && selectedSearchOption) {
            window.location.href = selectedSearchOption?.url;
            return;
        }

        const target = event.target as typeof event.target & {
            0: { value: string };
        };
        if (selectedSearchOption && target[0].value) {
            window.location.href = buildSearchUrl(target[0].value);
        }
    }

    const onBlur = () => setShowOptions(false);
    const onSelectedSearchOptionClick = () => setShowOptions(!showOptions);

    const [showOptions, setShowOptions] = useState(false);
    const [selectedSearchOption, setSelectedSearchOption] = useState<SearchOptionType | undefined>();
    const [userShifting, setUserShifting] = useState<boolean>(false);

    let icon: ReactElement = <></>;

    if(selectedSearchOption) {
        const {Icon, imageData} = selectedSearchOption as SearchOptionType;
        if(selectedSearchOption && selectedSearchOption.iconType === 'icon' && Icon) {
            icon = <Icon className='cursor-pointer mx-2 ' onClick={onSelectedSearchOptionClick}/>;
        } else if (selectedSearchOption && selectedSearchOption.iconType === 'image') {
            icon = <Image className='cursor-pointer' onClick={onSelectedSearchOptionClick} src={imageData as StaticImageData} height={20} width={20} alt=''/>;
        }
    }

    useEffect(() => {
        // Shift key detection
        window.onkeyup = (e: KeyboardEvent) => {
            if(e.key == 'KEYCODE_SHIFT_LEFT' || e.key === 'KEYCODE_SHIFT_RIGHT') {
                // User started shifting
                setUserShifting(true);
            }
        }
        window.onkeydown = (e: KeyboardEvent) => {
            if(e.key == 'KEYCODE_SHIFT_LEFT' || e.key === 'KEYCODE_SHIFT_RIGHT') {
                // User stopped shifting
                setUserShifting(false);
            }
        }
    }, [])

    useEffect(() => {
        // Close search options tab on select
        setShowOptions(false);
    }, [selectedSearchOption])

    return (
        <form className={'w-1/2 flex flex-col justify-center'} onSubmit={onSearchBarSubmit}>
            <span className={`${styles.search_bar} flex items-center`}>
                {icon}
                <input autoFocus onBlur={onBlur} type='text'
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
