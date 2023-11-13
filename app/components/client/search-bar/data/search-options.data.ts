import GoogleIcon from '@mui/icons-material/Google';
import { SearchOptionType } from '../search-bar.types';
import YouTubeIcon from '@mui/icons-material/YouTube';
const SearchOptionData: SearchOptionType[] =  [
    {
        iconType: 'icon',
        name: 'google',
        url: 'https://google.com',
        queryParamName: 'q',
        queryWordsSeparator: '+',
        path: 'search',
        Icon: GoogleIcon
    },
    {
        iconType: 'icon',
        name: 'youtube',
        url: 'ttps://www.youtube.com',
        queryParamName: '',
        queryWordsSeparator: '+',
        path: 'results',
        Icon: YouTubeIcon
    } 
]

export default SearchOptionData;