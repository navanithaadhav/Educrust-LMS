import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'


interface SearchBarProps {
    data?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {
    const navigate = useNavigate()

    const [input, setInput] = useState(data || "")

    const onSearchHandler = (e: React.FormEvent) => {
        e.preventDefault()
        navigate('/course-list/' + input)
    }

    return (
        <div>
            <form className="w-full md:h-14 md:mt-3 h-12 flex items-center justify-center  border border-gray-500/80 rounded">
                <img src={assets.search_icon} alt="Search" className='md:w-auto w-10 px-3' />
                <input
                    onChange={e => setInput(e.target.value)}
                    type="search"
                    placeholder='Search for courses'
                    className='w-full h-full  outline-none text-gray-500/80 '
                    aria-label="Search courses"
                />
                <button
                    onClick={onSearchHandler}
                    type="submit"
                    className=" bg-blue-800 text-white  rounded py-2 px-7 mx-1 focus:outline-none md:px-10 md:py-3"
                    aria-label="Submit search"
                >
                    Search
                </button>

            </form>
        </div>
    )
}

export default SearchBar