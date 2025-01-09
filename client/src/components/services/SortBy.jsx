import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
function SortBy({ setFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRoot = document.getElementById('dropdown-root');
    const buttonRef = useRef(null);
    const dropDownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [selected, setSelected] = useState()
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX -30,
            });
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target) && dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setSelected(e.target.innerText)
        setFilter(prev => ({
            ...prev,
            sortBy: e.target.innerText
        }))
        setIsOpen(false)
    }
    return (
        <div>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 rounded bg-black text-white hover:bg-gray-700"
            >
                Sort By
            </button>
            {
                isOpen &&
                ReactDOM.createPortal(
                    <div
                        ref={dropDownRef}
                        className="absolute bg-white shadow-inner  p-2  rounded-2xl"
                        style={dropdownPosition}
                    >
                        {
                            ["A to Z", "Z to A"]
                            .map((option) => (
                                <button key={option} onClick={handleChange} className={`block hover:bg-gray-100 p-2 px-5 rounded-lg ${option === selected ? "bg-gray-200" : ""}`}>{option}</button>    
                            ))
                        }
                    </div>,
                    dropdownRoot
                )
            }
        </div>
    )
}

export default SortBy
