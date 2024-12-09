import { createContext, useRef } from "react";

export const NavigationContext = createContext();

export default function NavigationProvider({ children }) {
    const activeLinkRef = useRef(null);
    const selectionRef = useRef(null);

    const navigationValues = {
        activeLinkRef,
        selectionRef
    }

    return (
        <NavigationContext.Provider value={navigationValues}>
            { children }
        </NavigationContext.Provider>
    )
}