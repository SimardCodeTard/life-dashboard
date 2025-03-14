"use client";;
import { useEffect, useState, FormEvent, ReactElement, createRef } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SearchOptions from './search-options/search-options.component';
import { SearchOptionType } from '../../../types/search-bar.types';
import Image, { StaticImageData } from 'next/image';

import '../../components.scss';
import './search-bar.scss';
import { Logger } from '@/app/services/logger.service';

type SearchBarProps = {setIsLoading?: () => boolean};

export default function SearchBar({ setIsLoading }: SearchBarProps) {

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

    const onSearchOptionShiftClick = (searchOption: SearchOptionType) => {
        setSelectedSearchOption(searchOption);
        searchBarRef.current?.requestSubmit();
    }

    const [showOptions, setShowOptions] = useState(false);
    const [selectedSearchOption, setSelectedSearchOption] = useState<SearchOptionType | undefined>();

    useEffect(() => {
        setIsLoading && setIsLoading();
    }, [setIsLoading]);

    useEffect(() => {
        // Close search options tab on select
        setShowOptions(false);
    }, [selectedSearchOption])

    return (
        <form className='search-bar' onSubmit={onSearchBarSubmit} ref={searchBarRef}>
            <div className='search-bar-container'>
                <div className="search-bar-input-container">
                    <span className="search-input-icon-wrapper">
                        <SearchSharpIcon></SearchSharpIcon>
                    </span>
                    <input autoFocus onBlur={onBlur} type='text'
                        className='search-input'
                        placeholder={`Search on ${selectedSearchOption ? selectedSearchOption.name : 'the web'}...`}>
                    </input>
                </div>
                <SearchOptions selectedSearchOption={selectedSearchOption} setSelectedSearchOption={setSelectedSearchOption} onSearchOptionShiftClick={onSearchOptionShiftClick} showOptions={showOptions}></SearchOptions>
                <button>Search</button>
            </div>
        </form>
    );
}
