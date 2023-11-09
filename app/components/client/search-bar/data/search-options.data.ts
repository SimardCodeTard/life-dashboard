import GoogleIcon from '@mui/icons-material/Google';
import { SearchOptionType } from '../search-bar.types';
import YouTubeIcon from '@mui/icons-material/YouTube';
const SearchOptionData =  {
    options: {
        google: {
            name: 'google',
            urlCallBack: (userQuery: string): string => {
                return `https://www.google.com/search?q=${userQuery.replace('/ /g','+')}`;
            },
            Icon: GoogleIcon
        } as SearchOptionType, 
        youtube: {
            name: 'youtube',
            urlCallBack: (userQuery: string): string => {
                return `https://www.youtube.com/results?search_query=${userQuery.replace('/ /g','+')}`
            },
            Icon: YouTubeIcon
        } 
    }
    
}

export default SearchOptionData;