import GoogleIcon from '@mui/icons-material/Google';
import { SearchOptionType } from '../../../../types/search-bar.types';
import YouTubeIcon from '@mui/icons-material/YouTube';

export const SearchOptionData: SearchOptionType[] =  [
    {
        iconType: 'icon',
        name: 'Google',
        url: 'https://google.com',
        queryParamName: 'q',
        queryWordsSeparator: '+',
        path: 'search',
        Icon: GoogleIcon
    }, {
        iconType: 'icon',
        name: 'Youtube',
        url: 'https://www.youtube.com',
        queryParamName: 'search_query',
        queryWordsSeparator: '+',
        path: 'results',
        Icon: YouTubeIcon
    } 
];