'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

type ButtonProps = {
  icon?: string;
  icon2?: string;
  content?: string;
  buttonType: 'button' | 'reset' | 'submit' | undefined;
  handleClick?: any;
  flag?: boolean;
};

function SimpleButton(props: ButtonProps) {
  const [hoverBool, setHoverBool] = useState(false);
  function handleEnter() {
    setHoverBool(true);
  }
  function handleLeave() {
    setHoverBool(false);
  }
  return (
    <button
      onClick={props.handleClick}
      type={props.buttonType}
      onMouseEnter={(event) => handleEnter()}
      onMouseLeave={(event) => handleLeave()}
      className={`Register bg-transparent text-white hover:bg-white min-h-[45px]  hover:text-black hover:Boxshad transition-all duration-500 text-sm md:text-lg lg:text-xl h-full w-full  font-Orbitron flex flex-row justify-center items-center`}
    >
      {props.icon && props.icon2 && (
        <Image
          src={!hoverBool ? props.icon : props.icon2}
          alt="upload icon"
          className=" w-8 h-7 pr-2"
        />
      )}
      <div className={`${props.flag ? 'hidden xl:block' : ''}`}>{props.content}</div>
    </button>
  );
}

export default SimpleButton;
