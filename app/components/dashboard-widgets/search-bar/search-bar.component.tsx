"use client"
import { useEffect, useState, FormEvent, ReactElement } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SearchOptions from './search-options/search-options.component';
import { SearchOptionType } from '../../../types/search-bar.types';
import Image, { StaticImageData } from 'next/image';

import '../../components.css';
import './search-bar.css';
import { Logger } from '@/app/services/logger.service';

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
            openInNewTab(buildSearchUrl(target[0].value));
        }
    }

    const openInNewTab = (url: string) => {
        Logger.debug(`opening new windows to url ${url}`);
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
      }

    const onBlur = () => setShowOptions(false);
    const onSelectedSearchOptionClick = () => {
        if(userShifting && selectedSearchOption) {
            window.location.href = selectedSearchOption?.url;
        } else {
            setShowOptions(!showOptions)
        }
    };

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

    useEffect(() => {
        // Close search options tab on select
        setShowOptions(false);
    }, [selectedSearchOption])

    return (
        <form className='search-bar' onSubmit={onSearchBarSubmit}>
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
            <SearchOptions setSelectedSearchOption={setSelectedSearchOption} showOptions={showOptions}></SearchOptions>
        </form>
    );
}
