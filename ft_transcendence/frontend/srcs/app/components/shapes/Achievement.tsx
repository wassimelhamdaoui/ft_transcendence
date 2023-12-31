import Image from 'next/image';
import redAchiev from '../../../public/redAchiev.svg';
import blueAchiev from '../../../public/blueAchiev.svg';

type newType = {
  name: string;
  color: boolean;
  description?: any;
};

function Achievement(props: newType) {
  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center text-center  text-[7px] sm:text-[8px] 2xl:text-[12px] ${
        props.color ? 'blueShadow text-[#00B2FF]' : 'text-[#FF0742] redShadow'
      }`}
    >
      <abbr title={props.description || ''}>
      <Image
        src={props.color ? blueAchiev : redAchiev}
        alt="achievment"
        className="w-auto h-auto"
      />
      {props.name}
      </abbr>
    </div>
  );
}

export default Achievement;
