import React, { useState , useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"
import { useSocket } from '../providers/Socket'
import '../pages/StartVideo.css';

const StartVideopage = () => {
    const { socket } = useSocket();
    // socket.emit('join-room', { roomId: "1", emailId: "ming" });
    // console.log("socket", socket);
    const navigate = useNavigate()

    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();

    const handleRoomJoined = useCallback(({ roomId }) => {
        // console.log('Room-joined', roomId);
        navigate(`/videoroom/${roomId}`);
    }, [navigate]);

    useEffect(()=> {
        socket.on('joined-room', handleRoomJoined)
        return () => {
            socket.off('joined-room', handleRoomJoined);
        }
    }, [handleRoomJoined, socket]);
    
    const hadleJoinRoom = () => {
        socket.emit('join-room', { emailId: email, roomId })
    }

    return (
        <div>
            {/* logo-container */}
            <div className='logo-container'>
               <img src="/images/Ganzi1.png" alt="로고이미지"/>
            </div>

            {/* Introduce-container */}
            <div className='Introduce-container'>
                <img src="/images/introduce1.png" alt="소개1이미지"/>
                <img src="/images/introduce2.png" alt="소개2이미지"/>
                <img src="/images/introduce3.png" alt="소개3이미지"/>
            </div>

            {/* StartVideo-container */}
            <div className='StartVideo-container'>
                <div></div>
                <div className="input-container">
                    <input value = {email} onChange = {e => setEmail(e.target.value)} type="name" placeholder='+ 회의에 사용할 이름 입력'></input>
                    <input value = {roomId} onChange = {e => setRoomId(e.target.value)} type="text" placeholder='+ 회의 링크 입력'></input>
                    <button onClick={hadleJoinRoom}>참여</button>
                </div>
            </div>
        </div>
    )
}

export default StartVideopage;