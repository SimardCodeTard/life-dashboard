"use client";;
import { useEffect, FormEvent } from 'react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

import '../../components.scss';
import './search-bar.scss';

export default function SearchBar({ setIsLoading }: Readonly<{setIsLoading?: (isLoading: boolean) => void}>) {

    const buildSearchUrl = (query: string): string => `https://www.google.com/search?q=${query.replaceAll(' ', '+')}`

    const redirectToSearchUrl = (url: string) => {
        window.location.assign(url);
    }

    const onSearchBarSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const eventValue = (event.target as typeof event.target & {
            0: { value: string };
        })[0].value;

        redirectToSearchUrl(buildSearchUrl(eventValue));
    }

    useEffect(() => {
        setIsLoading?.(false);
    }, [setIsLoading]);

    return (
        <div className="card-content">
            <form className='search-bar card-main-panel' onSubmit={onSearchBarSubmit}>
                <div className='search-bar-container'>
                    <div className="search-bar-input-container">
                        <span className="search-input-icon-wrapper">
                            <SearchSharpIcon></SearchSharpIcon>
                        </span>
                        <input autoFocus={true} type='text'
                            className='search-input'
                            placeholder='Search the web...'>
                        </input>
                    </div>
                    <button>Search</button>
                </div>
            </form>
        </div>
    );
}
