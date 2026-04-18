import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`}>
      <img
        src={`http://localhost:5000/${props.image}`}
        alt={props.alt}
      />
    </div>
  );
};

export default Avatar;