"use client";
import React from "react";
import HoverUnderLine from "./HoverUnderLine";
import Link from "next/link";
import { IoAddSharp } from "react-icons/io5";


export default function Navbar() {
    return (
        <nav className="w-full justify-between items-center flex p-5 xl:p-0">
            <HoverUnderLine>
                <Link href={"/"} className="font-bold text-2xl">
                    BuildSpaceAlum
                </Link>
            </HoverUnderLine>
            <div className="flex justify-end p-4">
                <button className="flex items-center bg-blue-300 text-white px-4 py-2 rounded">
                    <IoAddSharp />
                    Submit
                </button>
            </div>
        </nav>
    );
}
