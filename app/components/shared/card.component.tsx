import { ReactNode } from "react";

export default function Card({children, className}: {children: ReactNode, className?: string}){
    return(
        <div className={["card shadow-lg", className].join(' ')}>
            <div className="h-full card-content rounded shadow-inner m-1">
                {children}
            </div>
        </div>
    )
}