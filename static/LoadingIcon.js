import React, { useEffect, useState } from 'react';

function LoadingIcon() {
    const [coef, setCoef] = useState(0);
    useEffect(() => {
        requestAnimationFrame(function(){
            setCoef(Date.now() / 400)
        });
    }, [ coef ]);

    let radius = (devi) => {
        return (Math.cos(coef+(devi/3))+1)/2 * 1.59 +1.5;
    }
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 40.16 40.16"
            x="0px"
            y="0px"
            width="50px"
            height="50px"
        >
            <g id="layer_2" data-name="layer 2">
                <g id="layer_1-2" data-name="layer 1">
                    <circle fill="#11B0AB" className="cls-1" cx="20.48" cy="3.59" r={ radius(1) }/>
                    <circle fill="#209ca7" className="cls-2" cx="8.7" cy="8.14" r={ radius(2) }/>
                    <circle fill="#3384a3" className="cls-3" cx="3.59" cy="19.68" r={ radius(3) }/>
                    <circle fill="#476a9f" className="cls-4" cx="8.14" cy="31.46" r={ radius(4) }/>
                    <circle fill="#535B9D" className="cls-5" cx="19.68" cy="36.57" r={ radius(4) }/>
                    <circle fill="#476a9f" className="cls-6" cx="31.46" cy="32.02" r={ radius(5) }/>
                    <circle fill="#3384a3" className="cls-7" cx="36.57" cy="20.48" r={ radius(6) }/>
                    <circle fill="#209ca7" className="cls-8" cx="32.02" cy="8.7" r={ radius(7) }/>
                </g>
            </g>
        </svg>
    )
}

export default LoadingIcon;