import React  from "react";

export default function Footer() {
    return(
        <>
            <footer className="p-6 mt-5 bg-blue-900 text-center text-white">
                <p className="mb-2">By <a className={"underline"} href={"https://github.com/Vishwaraviraaj08/"}>Vishwa Raviraaj</a> and <a className={"underline"} href={"https://github.com/shiva1718"}>Shiva Sankar</a></p>
                <a href="https://github.com/Vishwaraviraaj08/NumifyPDF" className="underline text-white"
                   target="_blank">Please Star me on GitHub🤩</a>
            </footer>
        </>
    )
}