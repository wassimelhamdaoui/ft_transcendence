'use client';
import React from 'react';
import Game from './game';
import Matter from 'matter-js';
import { useState, useEffect, useRef, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { Content } from 'next/font/google';
import Alien from '../../public/alien.svg';
import Logout from '../../public/log-out.svg';
import Image from 'next/image';
import { set } from 'husky';
import { useRouter } from 'next/navigation';
import { data } from 'autoprefixer';
import { emit } from 'process';
import GamePopup from '../components/shapes/GamePopup';
import { BiHappyAlt, BiSad, BiLogOut } from 'react-icons/bi';
import { User, context } from '../../context/context';
import Countdown from 'react-countdown';
import { start } from 'repl';

let game: Game | null = null;


const gamePage = () => {
    const {user, setUser} = useContext(context);
    const gameDiv = useRef<HTMLDivElement>(null);
    const [{width, height}, setWindowSize] = useState({width: 0, height: 0})
    const [gameSocket, setGameSocket] = useState<any>(null)
    const [isLeft, setIsLeft] = useState(false);
    const [gameEnded, setGameEnded] = useState<string>('');
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [startState, setStartState] = useState(true);
    const [player1Score, setPlayer1Score] = useState<number>(0);
    const [player2Score, setPlayer2Score] = useState<number>(0);
    const [countdown, setCountdown] = useState<number>(3);
    

    useEffect(() => {

      if(startState)
      { 
        const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        }, 1000);
        if (countdown === 0) {
            setStartState(false);
            setCountdown(3)
        }
        return () => clearTimeout(timer);}
    })


    useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        };
        window.addEventListener('resize', handleResize);
        
        if (!user.socket) {
            game?.destroy();
            router.push('/dashboard');
        }
        
        user.socket?.on('GameState', (data: {player1: Matter.Vector, player2: Matter.Vector, ball: Matter.Vector}) => {
            game?.setState(data.player1, data.player2, data.ball);
        });
        
       
        
        user.socket?.on('gameEnded', (data: {state: string}) => {
            setGameEnded(data.state);
        })
        user.socket?.on('gameOver' , () => {
            user.socket?.emit('endGame');
        })
        user.socket?.on('Score', (data: {player1: number, player2: number}) => {
            setPlayer1Score(data.player1);
            setPlayer2Score(data.player2);
        })
        user.socket?.emit('StartGame', {map: user.map});

        user.socket?.on('startState' , () => {
          setStartState(true);
        })
        setGameSocket(user.socket);
        
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
                (user.socket as Socket)?.disconnect();
                user.socket?.close();
                const _user :User = user;
                _user.socket = null;
                _user.opponent = '';
                _user.gameType = '';
                _user.oppenentAvatar = '';
                // _user.login = undefined
                setUser(user);
            }
        };
    }, []);
    
    useEffect(() => {
        if (gameDiv.current){
            game = new Game(gameDiv.current, user.map!);
            if (gameSocket)
            game.setSocket(gameSocket) 
        game.start(); 
    }
    return () => {
      game?.destroy();
    };
  }, [width, height, gameSocket]);


const handleLeave = () => {;
    (gameSocket as Socket)?.disconnect();
    game?.destroy();
    router.push('/dashboard');
  };

  useEffect(() => {
    gameSocket?.on('left game', () => {
      setIsLeft(true);
   
    });
    if (isLeft) {
      handleLeave();
    }
  }, [isLeft, gameSocket]);

  useEffect(() => {
    if (gameEnded !== '') {
      setOpenModal(true);

      gameSocket?.disconnect();
      gameSocket?.close();
      game?.destroy();
    }
  }, [gameEnded]);


  return (
    <>
      <div className="font-Orbitron w-screen h-screen flex flex-col justify-center items-center">
        <div className="flex flex-row items-center w-[100%] justify-evenly">
          <div className="flex flex-row items-center m-2">
            <div className="NeonShadowBord h-[70px] w-[70px] md:w-[90px] md:h-[90px] m-auto flex">
              <Image
                src={user.avatarUrl || Alien}
                alt="avatar"
                className="h-auto w-auto"
                width={'50'}
                height={'50'}
              />
            </div>
            <div className=" text-[20px]  m-2 hidden md:block">
              {user.login}
            </div>
          </div>
          <button
            onClick={handleLeave}
            type="button"
            className="NeonShadowBord flex flex-row items-center h-fit px-4 py-3 hover:bg-white hover:text-[black] transition-[300]"
          >
            {/* <Image src={Logout} className='h-[20px]' alt="logout" />
             */}
            <BiLogOut size={30} />
            <div className="hidden md:block pl-2 text-[15px]">Leave</div>
          </button>
          <div className="flex flex-row items-center m-2">
            <div className=" text-[20px]  m-2 hidden md:block">
              {user.opponent}
            </div>
            <div className="NeonShadowBord h-[70px] w-[70px] md:w-[90px] md:h-[90px] m-auto flex">
              <Image
                src={user.oppenentAvatar || Alien}
                alt="avatar"
                className="h-auto w-auto"
                width={'50'}
                height={'50'}
              />
            </div>
          </div>
        </div>
        <div className="text-[40px] -mt-4 NeonShadow">
          {player1Score} - {player2Score}
        </div>
        {startState && 
          <div className="text-[40px] -mt-4 blinking-text">{countdown}</div>
        }
        {
          !startState &&
          <div className="text-[40px] -mt-4 NeonShadow">Start!</div>
        }
        <div className="w-[100%] h-[80%] flex justify-center items-center" ref={gameDiv}></div>
      </div>
      <GamePopup openModal={openModal} setOpenModal={setOpenModal}>
        <div
          className={`h-[50%]  w-full font-Orbitron  text-[30px] 2xl:text-[50px] flex justify-center items-center space-x-4 ${
            gameEnded == 'win' ? 'text-green-400' : 'text-red-500'
          } `}
        >
          {gameEnded === 'win' ? (
            <>
              <h1>You won</h1>
              <BiHappyAlt className="h-15 w-15" />
            </>
          ) : gameEnded === 'lose' && !isLeft ? (
            <>
              <h1>You lost</h1>
              <BiSad className="h-15 w-15" />
            </>
          ) : null}
        </div>
        <div className="flex justify-center h-1/2 w-full font-Orbitron items-start">
          <button
            onClick={() => {
              game?.destroy();
              router.push('/dashboard');
            }}
            type="button"
            className="NeonShadowBord flex flex-row items-center h-fit px-4 py-3 hover:bg-white hover:text-[black] outline-none transition-[300]"
          >
            <BiLogOut size={40} />
            <div className="pl-2 text-[30px]">Leave</div>
          </button>
        </div>
      </GamePopup>
    </>
  );
};

export default gamePage;
