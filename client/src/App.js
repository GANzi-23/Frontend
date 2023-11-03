import { Routes, Route } from 'react-router-dom'
import './App.css';

import { SocketProvider } from './providers/Socket';
import { PeerProvider } from './providers/Peer';

import StartVideopage from "./pages/StartVideo";
import VideoRoompage from "./pages/VideoRoom";
import Account from "./pages/Account";
import Login from "./pages/Login";

function App() {
  return ( 
  <div className="App">
      <SocketProvider>
        <PeerProvider> 
          <Routes>
            <Route path="/account" element = {<Account></Account>} />
            <Route path="/login" element = {<Login></Login>} />
            <Route path="/" element = {<StartVideopage />} />
            <Route path="/videoroom/:roomId" element={<VideoRoompage />} />
          </Routes>
        </PeerProvider> 
      </SocketProvider>
    </div>
  );
}


  export default App;
