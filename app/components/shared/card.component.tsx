'use client'

import React from "react";
import { cloneElement, ReactNode } from "react";
import Loader from "./loader/loader.component";

export default function Card({children, className, loadCard = true }: {children: ReactNode, className?: string, loadCard?: boolean}) {

    const [isLoading, setIsLoading] = React.useState(loadCard);

    const childProps = {
        setIsLoading
    }

    return(
        <div className={["card", className].join(' ')}>
            {isLoading ? <Loader></Loader> : ''}
            <div className={`card-content-wrapper rounded ${isLoading ? 'hidden' : ''}`}>{React.Children.map(children, child => 
                    React.isValidElement(child) ? cloneElement(child, { ...childProps }) : child
            )}
            </div>
        </div>
    )
}