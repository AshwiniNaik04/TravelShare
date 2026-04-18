import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  const activeLink = ({ isActive }) =>
    isActive ? "active" : undefined;

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" end className={activeLink}>
          ALL USERS
        </NavLink>
      </li>

      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>
            MY PLACES
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new" className={activeLink}>
            ADD PLACE
          </NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" className={activeLink}>
            LOGIN
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <button
            className="nav-links__logout"
            onClick={auth.logout}
          >
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
