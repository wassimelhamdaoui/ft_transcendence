'use client';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Achievement from '../shapes/Achievement';
import Pdp from '../shapes/Pdp';
import alien from '../../../public/alien.svg';

type newType = {
  title: string;
  textColor: string;
  Color: boolean;
  divArray: any;
  hoverColor: string;
  isFriend: boolean;
  image: string;
  setOpen?: any;
  setLogin?: any;
  setAvatar?: any;
  setUserId?: any;
};

function DiscloComp(props: newType) {
  return (
    <div className="w-full h-auto   ">
      <div className="w-full font-Orbitron   NeonShadowBord">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`flex w-full h-auto ${props.textColor} justify-between  ${props.hoverColor}  items-center p-5  md:p-10 text-left text-xs md:text-xl font-medium`}
              >
                <span>{props.title}</span>
                <ChevronUpIcon
                  className={`${!open ? 'rotate-180 transform ' : ''} text-white h-10 w-10 `}
                />
              </Disclosure.Button>
              <Disclosure.Panel
                className={`w-full h-auto px-1 xl:px-10 pb-10 grid  sm:grid-cols-4 ${
                  props.isFriend ? 'grid-cols-3 lg:grid-cols-7' : 'grid-cols-2 lg:grid-cols-6'
                } gap-1 2xl:gap-4`}
              >
                {props.divArray &&
                  props.divArray.map((divName: any, index : number) => (
                    <div key={divName.id || index}>
                      {props.isFriend ? (
                        <Pdp
                          name={divName.login}
                          myProfile={true}
                          // image={divName.avatar == `public/avatars/${divName.login}.jpg` ? alien : divName.avatar}
                          image={divName.avatarUrl || alien}
                          color={props.Color}
                          handleClick={() => {
                            props.setOpen(true);
                            props.setLogin(divName.login);
                            props.setUserId(divName.id);
                            props.setAvatar(divName.avatarUrl || alien);
                          }}
                        />
                      ) : (
                        <Achievement name={divName.name} color={props.Color} description={divName.description} />
                      )}
                    </div>
                  ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default DiscloComp;
