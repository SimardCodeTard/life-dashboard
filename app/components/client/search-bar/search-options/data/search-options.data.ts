import GoogleIcon from '@mui/icons-material/Google';
import { SearchOptionType } from '../../search-bar.types';
import YouTubeIcon from '@mui/icons-material/YouTube';

export const searchOptions: SearchOptionType[] = 
[
    {
        iconType: 'icon',
        name: 'google',
        url: 'https://google.com',
        queryParamName: 'search',
        queryWordsSeparator: '+',
        Icon: GoogleIcon
    }, 
    {
        iconType: "icon",
        name: 'youtube',
        url: 'https://youtube.com',
        path: 'results',
        queryParamName: 'search_query',
        queryWordsSeparator: '+',
        Icon: YouTubeIcon
    }
];