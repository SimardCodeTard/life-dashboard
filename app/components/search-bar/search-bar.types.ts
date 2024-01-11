import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { StaticImageData } from "next/image"
import { Dispatch, SetStateAction } from "react"

export type SearchBarOptionsPropsType = {
    showOptions: boolean,
    setSelectedSearchOption: Dispatch<SetStateAction<SearchOptionType | undefined>>
}

export type SearchOptionType = {
    name: string,
    urlCallBack: (userQuery: string) => string,
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string;}
    imageData?: StaticImageData
}

export type SearchOptionPropsType = {
    searchOption: SearchOptionType,
    setSelectedSearchOption: Dispatch<SetStateAction<SearchOptionType | undefined>>
};
