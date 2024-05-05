// index.js
'use client'
import React, { useState } from 'react';
import {red} from "next/dist/lib/picocolors";
const { PDFDocument, rgb } = require('pdf-lib');
import Footer from "./Footer";

const Home = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [startPage, setStartPage] = useState(1);

    function handleFileChange(e) {
        let reader = new FileReader();
        reader.onload = async function(){
            let pdfBytes = new Uint8Array(reader.result);
            let pdfDoc = await PDFDocument.load(pdfBytes);
            setPdfFile(pdfDoc);
            console.log(`This document has ${pdfDoc.getPageCount()} pages.`);
        }
        reader.readAsArrayBuffer(e.target.files[0]);
    }

    const handleStartPageChange = (e) => {
        setStartPage(parseInt(e.target.value) || 1);
    };

    const addPageNumbers = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('startPage', startPage);

        try {
            const arr = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];


            const pdfDoc = pdfFile;

            for (let i = 2; i < startPage - 1; i++) {
                const page = pdfDoc.getPage(i);
                const pageNumberText = arr[i - 2];
                const {width, height} = page.getSize();
                const fontSize = 12;

                page.drawText(pageNumberText, {
                    x: width / 2,
                    y: 15,
                    size: fontSize,
                    color: rgb(0, 0, 0),
                });
            }

            for (let i = 0; i < pdfDoc.getPageCount() - startPage + 1; i++) {
                const page = pdfDoc.getPage(i + startPage - 1);
                const pageNumberText = `${i + 1}`;
                const {width, height} = page.getSize();
                const fontSize = 12;

                page.drawText(pageNumberText, {
                    x: width / 2,
                    y: 15,
                    size: fontSize,
                    color: rgb(0, 0, 0),
                });
            }

            const modifiedPdfBytes = await pdfDoc.save();
            // save to file
            const blob = new Blob([modifiedPdfBytes], {type: 'application/pdf'});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'output.pdf';
            link.click();

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
            <div>
                <div id="wrapper" className="grid grid-cols-1 xl:grid-cols-2 h-[100%]">
                    <div id="col-1" className="bg-blue-900 px-12 pt-32 pb-40 md:px-32 xl:py-64 xl:px-32">
                        <h1 className="text-blue-500 font-extrabold text-4xl md:text-6xl">The <br/>
                            Numify PDF <br/>
                        </h1>
                        <p className="text-white text-normal md:text-3xl pt-3 md:pt-6 font-medium">pageNumberApply()</p>
                    </div>
                    <div id="col-2" className="px-3 md:px-20 xl:py-40 xl:px-12">

                        <div id="cards"
                             className="rounded-lg flex border py-5 px-6 md:py-8 md:px-16 mt-6 md:mt-12 bg-white xl:pl-8 xl:rounded-xl">
                            <div id="circle" className="w-8 h-8 bg-blue-500 md:w-16 md:h-16 rounded-full"></div>
                            <p className="pl-4 md:pl-12 text-base pt-1 font-semibold md:text-2xl md:pt-4">Upload file</p>

                            <input type="file" name="pdf" id="pdfFile" accept=".pdf" onChange={handleFileChange}
                                   required
                                   className="w-8/12 mt-3 ml-6 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-1 disabled:pointer-events-none disabled:opacity-60"/>

                        </div>

                        <div id="cards"
                             className="rounded-lg flex border py-5 px-6 md:py-8 md:px-16 mt-6 md:mt-12 bg-white xl:pl-8 xl:rounded-xl">
                            <div id="circle" className="w-8 h-8 bg-blue-500 md:w-16 md:h-16 rounded-full"></div>
                            <p className="pl-4 md:pl-12 text-base pt-1 font-semibold md:text-2xl md:pt-4">
                                <label htmlFor="startPage" className="pb-8">Starting page number:</label>
                            </p>
                            <input type="text" name="startPage" id="startPage" className="border-4"
                                   onChange={handleStartPageChange}/>
                        </div>

                        <button type="button" onClick={addPageNumbers}
                                className="mt-12 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
<span
    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-blue-500 rounded-md group-hover:bg-opacity-0">
Add Page Numbers
</span>
                        </button>
                    </div>
                </div>

            </div>
            <Footer/>
        </>

    );
};

export default Home;
