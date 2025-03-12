import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { StaticImageData } from 'next/image';
import { Dispatch, SetStateAction } from 'react';


export type SearchOptionType = {
    iconType: 'image' | 'icon'; // Discriminator field
    name: string;
    url: string;
    queryParamName: string; // The name of the url parameter preceding the user query
    queryWordsSeparator: string; // The character(s) used to separate words in the user query
    path?: string; // Optional path to search page
    imageData?: StaticImageData; // NextJS Image data
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string;}; // MaterialUI Icon
};


export type SearchOptionPropsType = {
    searchOption: SearchOptionType,
    onClick: (searchOption: SearchOptionType) => void
};

export type SearchBarOptionsPropsType = {
    showOptions: boolean,
    selectedSearchOption: SearchOptionType | undefined,
    setSelectedSearchOption: Dispatch<SetStateAction<SearchOptionType | undefined>>
    onSearchOptionShiftClick: (searchOption: SearchOptionType ) => void
}
