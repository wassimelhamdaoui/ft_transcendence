'use client';
import axios from 'axios';
import DiscloComp from '../components/shapes/DiscloComp';
import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
// import OptionBar from '../components/forms/OptionBar'
import dynamic from 'next/dynamic';
import { User, context } from '../../context/context';
import { useQuery } from 'react-query';



const OptionBar = dynamic(() => import('../components/forms/OptionBar'), {ssr: false});

const fetchAchivements = async ()=>{

	const res = await fetch("http://localhost:3000/api/atari-pong/v1/achievements/all-acquired", {
						headers: {
					Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
				},
	});
	return res.json();
}

const fetchUnacquiredAchiev = async ()=>{

	const res = await fetch("http://localhost:3000/api/atari-pong/v1/achievements/all-unacquired", {
						headers: {
					Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
				},
	});
	return res.json();
}

function Achievements() {

	const {user, setUser} = useContext(context);
	const [acquired, setAcquired] = useState<any>(null); //
	const [unacquired, setUnacquired] = useState<any>(null); //

	
	const {data : achievements, status } = useQuery("achievements", fetchAchivements);
	const {data : unacquiredAchiev, status : status1} = useQuery("unacquiredAchiev", fetchUnacquiredAchiev);


	useEffect(()=> {
		if(!user.achievements || !user.unacquiredAchiev)
		{
			const _user : User = user;
			if(achievements)
			{
				setAcquired(achievements.achievements);
				_user.achievements = achievements.achievements;
			}
			if(unacquiredAchiev){

				setUnacquired(unacquiredAchiev);
				_user.unacquiredAchiev = unacquiredAchiev;
			}
			setUser(_user);
		}
		else{
			setAcquired(user.achievements);
			setUnacquired(user.unacquiredAchiev);
		}
	
	}, [status, status1])
	
	// async function getAchievements() {
	// 	const acq = await axios.get(
	// 		'http://localhost:3000/api/atari-pong/v1/achievements/all-acquired',
	// 		{
	// 			headers: {
	// 				Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
	// 			},
	// 		},
	// 	);
	// 	const unacq = await axios.get(
	// 		'http://localhost:3000/api/atari-pong/v1/achievements/all-unacquired',
	// 		{
	// 			headers: {
	// 				Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
	// 			},
	// 		},
	// 	);
	// 	setAcquired(acq.data.achievements);
	// 	setUnacquired(unacq.data);
	// 	const _user : User = user;
	// 	_user.achievements = acq.data.achievements;
	// 	_user.unacquiredAchiev = unacq.data;
	// 	setUser(_user);
	// }
	// useEffect(() => {
	// 	if(user.achievements && user.unacquiredAchiev)
	// 	{
	// 		setAcquired(user.achievements);
	// 		setUnacquired(user.unacquiredAchiev);
	// 	}
	// 	else getAchievements();
	// }, []);

	// function setOnline() {
	// 	io('http://localhost:3000', {
	// 		transports: ['websocket'],
	// 		auth: {
	// 			token: localStorage.getItem('jwtToken'),
	// 		},
	// 	});
	// }
	// useEffect(() => {
	// 	setOnline();
	// }, []);
	return (
		<OptionBar flag={1} >
				<main className="w-full h-auto md:h-full flex flex-col font-Orbitron min-h-[480px] min-w-[280px] ">
					<div className="w-full h-12 md:h-[10%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
						All achievements
					</div>
					{
						(status == "loading" || status1 == "loading") && 
						<div className=" flex flex-col space-y-2 w-full h-[80%] items-center justify-center">
							<h1>Loading</h1>
							<div className="spinner"></div>
						</div>
					}
					<div className="w-full h-auto flex flex-col px-2  md:px-12 space-y-8 md:space-y-12">
						{
							status == "success" && status1 == "success" &&
							<>
							<div className="w-full  h-auto ">
							<DiscloComp
								title="Acquired achievements"
								divArray={acquired}
								textColor="text-white NeonShadow"
								Color={true}
								hoverColor="hover:text-[#00B2FF]  hover:blueShadow"
								isFriend={false}
								image=""
							/>
						</div>
						<div className="w-full h-auto ">
							<DiscloComp
								title="Unacquired achievements"
								divArray={unacquired}
								textColor="white NeonShadow"
								Color={false}
								hoverColor="hover:text-[#FF0742] hover:redShadow"
								isFriend={false}
								image=""
							/>
						</div></>}
					</div>
			</main>
		</OptionBar>
	);
}

export default Achievements;
