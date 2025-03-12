"use client";;
import { useEffect, useState, FormEvent, ReactElement, createRef } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SearchOptions from './search-options/search-options.component';
import { SearchOptionType } from '../../../types/search-bar.types';
import Image, { StaticImageData } from 'next/image';

import '../../components.css';
import './search-bar.css';
import { Logger } from '@/app/services/logger.service';

type SearchBarProps = {};

export default function SearchBar({ }: SearchBarProps) {

    const searchBarRef = createRef() as React.RefObject<HTMLFormElement>;

    const buildSearchUrl = (query: string): string => {
        const {url, path, queryParamName, queryWordsSeparator} = selectedSearchOption as SearchOptionType;
        return `${ url }${ path ? path.startsWith('/') ? path : `/${ path }` : '' }?${ queryParamName }=${ query.replaceAll(' ', queryWordsSeparator) }` 
    }

    const redirectToSearchUrl = (url: string) => {
        window.location.assign(url);
    }

    const onSearchBarSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const eventValue = (event.target as typeof event.target & {
            0: { value: string };
        })[0].value;

        if (selectedSearchOption && eventValue) {
            Logger.debug(`User is not shifting and selected search option is ${selectedSearchOption.name}`);
            redirectToSearchUrl(buildSearchUrl(eventValue));
        }
    }
    const onBlur = () => setShowOptions(false);

    const onSelectedSearchOptionClick = () => {
        setShowOptions(!showOptions)
    };

    const onSearchOptionShiftClick = (searchOption: SearchOptionType) => {
        setSelectedSearchOption(searchOption);
        searchBarRef.current?.requestSubmit();
    }



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
        // Close search options tab on select
        setShowOptions(false);
    }, [selectedSearchOption])

    return (
        <form className='search-bar' onSubmit={onSearchBarSubmit} ref={searchBarRef}>
            <span className='search-bar-container'>
                <span className="actions-wrapper search-option-icon-wrapper">
                    {icon}
                </span>
                <input autoFocus onBlur={onBlur} type='text'
                    className='search-input'
                    placeholder={`Search on ${selectedSearchOption ? selectedSearchOption.name : 'the web'}`}></input>
                <button type='submit'>
                    <SearchSharpIcon></SearchSharpIcon>
                </button>
            </span>
            <SearchOptions setSelectedSearchOption={setSelectedSearchOption} onSearchOptionShiftClick={onSearchOptionShiftClick} showOptions={showOptions}></SearchOptions>
        </form>
    );
}
