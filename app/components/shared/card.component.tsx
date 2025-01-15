import { ReactNode } from "react";

export default function Card({children, className}: {children: ReactNode, className?: string}){
    return(
        <div className={["card", className].join(' ')}>
            <div className="card-content rounded">
                {children}
            </div>
        </div>
    )
}