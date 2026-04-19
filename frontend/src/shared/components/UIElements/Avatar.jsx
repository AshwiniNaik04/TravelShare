import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`}>
      <img
        src={`https://travelshare-mjrv.onrender.com/${props.image}`}
        alt={props.alt}
      />
    </div>
  );
};

export default Avatar;