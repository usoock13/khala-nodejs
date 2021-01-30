import React, { useEffect, useState, useRef } from 'react';

function LoadingIcon(props) {
    let svgStyle = {
        position: 'fixed',
        top: '45vh',
        zIndex: 9
    }
    const svgRef = useRef();

    const [coef, setCoef] = useState(0);
    useEffect(() => {
        requestAnimationFrame(function(){
            setCoef(Date.now() / 400)
        });
    }, [ coef ]);

    useEffect(() => {
        svgRef.current.style.left = `calc(50% - ${svgRef.current.attributes.width.value})`;
    }, [])

    let radius = (devi) => {
        return (Math.cos(coef+(devi/3))+1)/2 * 1.59 +1.5;
    }
    let position = (devi) => {
        return (Math.cos(coef - (Math.PI/4 * devi))*16.5)+20.5;
    }

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 40.16 40.16"
            width="50px"
            height="50px"
            style={svgStyle}
            ref={svgRef}
            className={props.isLoading ? 'khala-animate fadeOutTop' : 'khala-animate fadeInBottom'}
        >
            <g id="layer_2" data-name="layer 2">
                <g id="layer_1-2" data-name="layer 1">
                    <circle fill="#11B0AB" className="cls-1" cx={position(7)} cy={position(1)} r={ radius(1) }/>
                    <circle fill="#209ca7" className="cls-2" cx={position(8)} cy={position(2)} r={ radius(2) }/>
                    <circle fill="#3384a3" className="cls-3" cx={position(1)} cy={position(3)} r={ radius(3) }/>
                    <circle fill="#476a9f" className="cls-4" cx={position(2)} cy={position(4)} r={ radius(4) }/>
                    <circle fill="#535B9D" className="cls-5" cx={position(3)} cy={position(5)} r={ radius(4) }/>
                    <circle fill="#476a9f" className="cls-6" cx={position(4)} cy={position(6)} r={ radius(5) }/>
                    <circle fill="#3384a3" className="cls-7" cx={position(5)} cy={position(7)} r={ radius(6) }/>
                    <circle fill="#209ca7" className="cls-8" cx={position(6)} cy={position(8)} r={ radius(7) }/>
                </g>
            </g>
        </svg>
    )
}

export default LoadingIcon;