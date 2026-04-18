import "./SideDrawer.css";

const SideDrawer = props => {
  return (
    <aside className={`side-drawer ${props.show ? "open" : ""}`}>
      {props.children}
    </aside>
  );
};

export default SideDrawer;
