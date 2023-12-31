'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import alien from '../../../public/alien.svg';
import { context } from '../../../context/context';

type newType = {
  name: string;
  color: boolean;
  image?: string;
  handleClick?: any;
  router?: any;
  flag?: boolean;
  myProfile?: boolean;
};

function Pdp(props: newType) {
  const [userAvatar, setUserAvatar] = useState(alien);

  useEffect(() => {
    setUserAvatar(props.image);
  }, [props.image]);

  const viewProfile = () => {
    props.router.push(`/profil/${props.name}`);
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center text-xs md:text-base 3xl:text-lg ${
        props.color ? 'blueShadow text-[#00B2FF]' : 'text-[#FF0742] redShadow'
      }`}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={props.router ? viewProfile : props.handleClick}
          className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] lg:w-[90px] lg:h-[90px] 2xl:w-[105px] 2xl:h-[105px] NeonShadowBord flex items-center justify-center overflow-hidden"
        >
          <Image
            src={userAvatar || alien}
            alt="profil"
            className="w-50 h-50 sm:w-[100px] "
            width="50"
            height="50"
          />
        </button>
        {!props.flag && props.name}
      </div>
    </div>
  );
}

export default Pdp;
