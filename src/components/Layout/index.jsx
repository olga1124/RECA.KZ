"use client"
import { useRef } from "react"
import { LayoutContext } from "../context"
import Navbar from "../Navbar"
import Footer from "../Footer"

const Layout = ({ children }) => {
    const LayoutRef = useRef();
    const ScrollBar = useRef();

    return (
        <LayoutContext.Provider value={{
            scrollBar: ScrollBar
        }}>

            <div className="mx-auto w-full" ref={LayoutRef}>
                <Navbar />
                <main id="main" className="container"> {children} </main>
                <Footer />
            </div>
        </LayoutContext.Provider>

    )
}

export default Layout;