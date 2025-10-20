'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    setOpen(!open);
  };

  return (
    <div className='flex flex-col md:flex-row  justify-center items-center px-[10px] py-[10px] md:py-[0px] md:px-[px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]'>
      <div className='flex flex-col md:flex-row  justify-between items-center w-[100%] w-max-[1200px]'>
        <div className='flex justify-between items-center w-full md:w-auto '>
          <span className='text-[25px] md:text-[30px] font-bold !text-[#0059FF] '>CrowdQuiz</span>
          <div className='font-medium md:hidden'>
            <button
              className='border-[2px] border-[#0059FF] !text-[#0059FF] p-[2px] w-[70px]'
              onClick={openMenu}
            >
              {open ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        </div>

        <div
          className={`font-medium flex flex-col md:flex-row items-center justify-center gap-[8px] md:gap-[12px] overflow-hidden transition-all duration-500 ease-in-out ${
            open ? 'max-h-[500px]' : 'max-h-0'
          } md:max-h-none md:opacity-100 `}
        >
          <Link href={'#'}>Home</Link>
          <Link href={'#'}>Quizzes</Link>
          <Link href={'#'}>Contact</Link>
          <Link href={'#'}>About</Link>

          <button className='!bg-[#0059FF] !text-white rounded-md w-[90px] py-[3px]'>Login</button>
          <button className='!bg-[#0059FF] !text-white rounded-md w-[90px] py-[3px] '>
            Add Quiz
          </button>
          <button className='!bg-[#0059FF] !text-white rounded-md w-[90px] py-[3px]'>Logout</button>
        </div>
      </div>
    </div>
  );
}
