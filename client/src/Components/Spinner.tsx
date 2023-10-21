import React from 'react';
import './Spinner.css'

export function Spinner() {

    return (
        <div className="flex justify-center w-screen h-screen">
            <div className="w-12 h-12 border-4 border-blue-600 rounded-full loader"></div>
        </div>

    )
}
