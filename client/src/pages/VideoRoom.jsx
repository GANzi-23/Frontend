import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from 'react-player';
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";
import '../pages/VideoRoom.css';

const VideoRoomPage = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream, handleTrackEvent } = usePeer();
    // 모델 선택 메뉴
    const [isModelMenuVisible, setIsModelMenuVisible] = useState(false);
    // 모델 목록 정의
    const models = [
        { id : 1, name: "Original"},
        { id : 2, name: "Arcane"},
        { id : 3, name: "Pixar"},
        { id : 4, name: "Disney"}
    ];
    // 메뉴 표시 토글
    const toggleModelMenu = () => {
        setIsModelMenuVisible(!isModelMenuVisible);
    };

    const [myStream, setMyStream] = useState(null);
    // const [remoteStream, setRemoteStream] = useState(null);
    const [remoteEmailId, setRemoteEmaildId] = useState();

    const handleNewUserJoined = useCallback(async (data) => {
        const {emailId} = data;
        console.log("New user joined the room", emailId);
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
        setRemoteEmaildId(emailId)
    }, [createOffer, socket]);

    const handleIncommingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incomming Call From", from, offer);
        const ans = await createAnswer(offer);
        socket.emit('call-accepted', { emailId: from, ans });
        setRemoteEmaildId(from)
    }, [createAnswer, socket]);

    const handleCallAccepted = useCallback(
        async (data) => {
        const { ans } = data;
        console.log('Call Got Accepted', ans);
        await setRemoteAns(ans);
        sendStream(myStream);
    }, [setRemoteAns]
    );

    const getUserMediaStream = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        sendStream(myStream);
        setMyStream(stream);
    }, []);

    const handleNegosiation = useCallback(() =>
    {
        const localOffer = peer.localDescription;
        socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer });
    },[peer.localDescription, remoteEmailId, socket])

    useEffect(() => {
        socket.on("user-joined", handleNewUserJoined);
        socket.on("incomming-call", handleIncommingCall);
        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("user-joined", handleNewUserJoined);
            socket.off("incomming-call", handleIncommingCall);
            socket.off("call-accepted", handleCallAccepted);
        }

    }, [handleCallAccepted, handleIncommingCall, handleNewUserJoined, socket]);

    useEffect(() => {
        peer.addEventListener("negotiationneeded",handleNegosiation);
        return () => {
            peer.removeEventListener("negotiationneeded", handleNegosiation);
        };
    }, [handleTrackEvent, peer]);

    useEffect(() => {
        getUserMediaStream();
    }, [getUserMediaStream])

    return(
    <div className='videoroom-page-container'>
        {/* 헤더 바 */}
        <div className="header-bar">
            <div className='logo-container'>
               <img src="/images/Ganzi1.png" alt="로고이미지"/>
            </div>
            <div className="meeting-title">Ganzi meeting</div>
            <div className="meeting-date">11월 16일, 2023 |</div>
            <div className="meeting-time">08:00 PM</div>
            <div className="user-name">Minah</div>
        </div>

        {/* 비디오 스트림 화면 */}
        

        {/* 하단 바 */}
        <div className="bottom-bar">
            <img src="/images/mic.png" alt="mic" className="mic" />
            <button onClick={(e) => sendStream(myStream)} className="videobutton">
                <img src="/images/video.png" alt="videobutton" />
            </button>
            <img src="/images/chat.png" alt="chat" className="chat" />
            <button onClick={toggleModelMenu} className="plus">
                <img src="/images/plus.png" alt="plus" />
            </button>
            {isModelMenuVisible && (
                <div className="model-selection-menu">
                <h4>당신의 아바타를 선택하세요!</h4>
                <ul>
                    {models.map((model) => (
                        <li key={model.id}>{model.name}</li>
                    ))}
                </ul>
                </div>
            )}
            <img src="/images/end.png" alt="end" className="end" />
        </div>

        <div className="video-stream">
            {/* <h1>VideoRoom Page</h1> */}
            {/* <h4>{remoteEmailId} 함께 회의중 </h4> */}
            <ReactPlayer url={myStream} playing muted />
            <ReactPlayer url={remoteStream} playing />
        </div>

        <div className="right-sidebar">
                <div className="participant-list">
                    <h2>참여자 목록</h2>
                    <ul>
                        <li>{remoteEmailId}</li>
                    </ul>
                </div>
                <div className="chat-box">
                    <h2>채팅</h2>
                    <div className="chat-messages">
                    </div>
                    <input type="text" placeholder="메시지를 입력하세요" />
                    <button>Send</button>
                </div>
            </div>
    
        {/* <h1>VideoRoom Page</h1>
        <h4>Your are connected to {remoteEmailId}</h4>
        <button onClick={(e) => sendStream(myStream)}>Video</button>
        <ReactPlayer url={myStream} playing muted />
        <ReactPlayer url={remoteStream} playing /> */}
    </div>
    );
};

export default VideoRoomPage;