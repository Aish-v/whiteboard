import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import "./index.css";


const Forms = ({ uuid,socket ,setUser}) => {
  return (
    <div className="row h-100 pt-5 justify-content-center">
      <div className="col-md-5 mt-5 form-box border border-2  p-5 rounded-2 d-flex flex-column align-items-center lavender-border">
        <h1 className="lavender-text fw-bold">Create Room</h1>
      <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
      </div>
      <div className="col-md-5 mt-5 form-box border border-2  p-5 rounded-2 d-flex flex-column align-items-center lavender-border">
        <h1 className="lavender-text fw-bold">Join Room</h1>
      <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
      </div>
    </div>
  );
};

export default Forms;
