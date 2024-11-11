import { useState, useContext, createContext } from "react";


const SearchApp = createContext();

const SearchProvider = ({ children }) => {

    const [searchKeyWord, setSearchKeyWord] = useState('')

    return (
        <SearchApp.Provider value={{ searchKeyWord, setSearchKeyWord }}>
            {children}
        </SearchApp.Provider>
    )
};

export default SearchProvider;

export const useSearch = () => {
    return useContext(SearchApp)
}