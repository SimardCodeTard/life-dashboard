'use client'

import { Children, cloneElement, isValidElement, ReactNode, useState } from "react";
import Loader from "./loader/loader.component";

export default function Card({children, className, loadCard = true }: Readonly<{children: ReactNode, className?: string, loadCard?: boolean}>) {

    const [isLoading, setIsLoading] = useState(loadCard);

    const childProps = {
        setIsLoading
    }

    return(
        <div className={["card", className].join(' ')}>
            {isLoading ? <Loader></Loader> : ''}
            <div className={`card-content-wrapper rounded ${isLoading ? 'hidden' : ''}`}>{Children.map(children, child => 
                    isValidElement(child) ? cloneElement(child, { ...childProps }) : child
            )}
            </div>
        </div>
    )
}