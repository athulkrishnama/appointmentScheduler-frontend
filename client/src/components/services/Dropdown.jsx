import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function Dropdown({ name, data, setFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRoot = document.getElementById('dropdown-root');
    const buttonRef = useRef(null);
    const dropDownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 5, 
                left: rect.left + window.scrollX,
            });
        }
    }, [isOpen]);

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

    const toggleStatus = (data)=>{
        data.isSelected = !data.isSelected;
        if(data.isSelected){
            setFilter(prev=>{return {...prev, [name]:[...prev[name],data._id]}})
        }else{
            setFilter(prev=>{return {...prev, [name]:prev[name].filter((id)=>id!==data._id)}})
        }
        setIsOpen(false);
    }

    return (
        <div className="dropdown-container">
            <button
                ref={buttonRef}
                className="dropdown-button px-4 py-2 rounded bg-black text-white hover:bg-gray-700"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="dropdown-select"
            >
                {name}
            </button>

            {isOpen &&
                ReactDOM.createPortal(
                    <div
                        ref={dropDownRef}
                        className="dropdown-portal bg-white px-5 shadow-2xl rounded-3xl"
                        id="dropdown-select"
                        style={{
                            position: 'absolute',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            zIndex: 1000,
                        }}
                    >
                        {data.map(item=>(
                            <h1 onClick={()=>toggleStatus(item)} className={`text-lg text-gray-600 my-1 rounded-md text-center py-2 cursor-pointer ${item.isSelected && 'bg-gray-200'}`}>{item.categoryName || item.fullname}</h1>
                        ))}
                    </div>,
                    dropdownRoot
                )}
        </div>
    );
}

export default Dropdown;

