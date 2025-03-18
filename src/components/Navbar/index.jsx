/** @format */

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { navbarLinks } from "@/constants/navbar";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import SocialLinks from "../SocialLinks";

const Navbar = () => {
    const [nav, setNav] = useState(false);

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setNav(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className='z-[100] w-full max-h-16 bg-white border-b border-[#F3F3F3]-500 flex items-center justify-between px-6 py-2 h-24 fixed top-0 left-0 right-0 nav'>
            <div className='container flex justify-between items-center'>
                <div className='block'>
                    <Link
                        className='link-underline link-underline-black'
                        href='/'
                        // target="_blank"
                        rel='noreferrer'>
                        <Image
                            src='/logo.svg'
                            alt='Nelcosoft logo'
                            width={130}
                            height={70}
                        />
                    </Link>
                </div>
                <div className='flex flex-row items-center gap-10'>
                    <ul className='nav-links-container hidden md:flex'>
                        {navbarLinks.map(({ title, path }) => (
                            <li
                                key={title.toLowerCase()}
                                className='nav-links px-4 cursor-pointer text-center capitalize font-medium text-gray-500 hover:scale-105 hover:text-gray duration-200 link-underline'>
                                <Link
                                    href={path}
                                    smooth={"true"}
                                    scroll={true}
                                    duration={300}>
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className='hidden md:block'>
                        <SocialLinks color='black' />
                    </div>
                </div>
                <div
                    onClick={() => setNav(!nav)}
                    className='cursor-pointer z-10 text-gray-500 md:hidden'>
                    {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
                </div>
            </div>
            {nav && (
                <ul className='flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-white from-black to-gray-800 text-gray-500'>
                    {navbarLinks.map(({ title, path, index }) => (
                        <li
                            key={index}
                            className='px-4 cursor-pointer text-center capitalize py-6 text-4xl'>
                            <Link onClick={() => setNav(!nav)} href={path}>
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Navbar;
