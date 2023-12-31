'use client';
import * as React from 'react';
import Image from 'next/image';
import LightMap from '../../public/lightmap.svg';
import DarkMap from '../../public/darkmap.svg';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Logout from '../../public/log-out.svg';
import Loader from '../components/shapes/loader';
import { User, context, SocketContext } from '../../context/context';
import { Socket, io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { set } from 'husky';
import { StoreID } from 'recoil';
import axios from 'axios';
import { availableParallelism } from 'os';

function Queue() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(context);
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  // const [map, setMap] = useState('');

    const toggleModal = (mode: string) => {
      // setMap(mode);
      const _user : User = user;
      _user.map = mode;
      setUser(_user);
      setIsOpen(true);
          user.socket?.emit('NewGame', {map: user.map, type: user.gameType, opponent: user.opponent});
          if (user.login !== user.opponent && user.gameType == 'private'){
            socket?.emit('notification', {login: user.opponent, senderId: user.login});
          }
          user.socket?.on('ready', (opponent : any)=>{
            const _user : User = user;
            _user.opponent = opponent.login;
            _user.oppenentAvatar = opponent.avatarUrl;
            setUser(_user);
            router.push('/game');
        })
      }
    
    const checkCancel = () => {
      user.socket?.emit('CancelGame');
      if(user.gameType == 'private'){
        socket?.emit('cancel-notif', {login: user.opponent});
        const _user :User = user;
        _user.gameType = '';
        setUser(_user);
      }
      setIsOpen(false);
    }

  useEffect(() => {
    if (!user.socket || (user.socket as Socket).connected == false) {
      const socket: Socket = io('http://localhost:3001', {
        auth: {
          token: localStorage.getItem('jwtToken'),
        },
      });

      socket.on('connect', () => {

      });
      const usersocket: User = user;
      usersocket.socket = socket;
      setUser(usersocket);
    }
    socket?.on('cancelInvite', () => {
      user.socket?.emit('CancelGame');
      const _user: User = user;
      _user.opponent = '';
      _user.gameType = '';
      setUser(_user);
      setIsOpen(false);
    });

    user.socket?.on('already connected', () => {
    
      router.push('/dashboard');
    });
  }, [user.socket]);

  useEffect(() => {
    if (!user.login && socket) {
      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.get(apiUrl, config).then((response: any) => {
        const _user = response.data;
        socket.emit('online', { token: localStorage.getItem('jwtToken') });
        _user.state = 1;
        socket.emit('inGame', { token: localStorage.getItem('jwtToken') });
        _user.state = 2;
        setUser(_user);
      }).catch(()=>{});
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if(user.gameType == 'private')
        socket?.emit('cancel-notif', { login: user.opponent });
      const _user: User = user;
      _user.gameType = '';
      setUser(_user);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center h-screen justify-center">
        <h1 className="font-Orbitron NeonShadow text-[30px] mb-[30px]">Choose a map</h1>
        <div className="flex content-center justify-center">
          <button className="" onClick={() => toggleModal('white')}>
            <Image src={LightMap} alt="LightMap" />
          </button>
          <button className="" onClick={() => toggleModal('black')}>
            <Image src={DarkMap} alt="DarkMap" />
          </button>
        </div>
      </div>
      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex justify-center items-center bg-opacity-40 bg-[#282828] w-screen h-screen">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="font-Orbitron NeonShadow px-6 py-1 flex flex-col justify-center items-center min-w-[280px] min-h-[479px] w-full h-[50%] md:w-2/3  lg:w-1/3  bg-black NeonShadowBord">
                    <div className="text-[35px]">Waiting for opponents</div>

                    <Loader />

                    <button
                      className="NeonShadow flex items-center justify-center NBord Boxshad h-[68px] w-[196px] text-[20px] hover:bg-white hover:text-black duration-300"
                      onClick={() => {
                        checkCancel();
                      }}
                    >
                      <Image src={Logout} alt="Logout" className="mr-3" />
                      <div>Cancel</div>
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
}

export default Queue;
