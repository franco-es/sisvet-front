import React from "react";
import { Link, NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";

const NavBar = (props) => {
  const [auth, setAuth] = React.useState(props.authUser);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      setAuth(localStorage.getItem("token"));
    } else {
      setAuth(null);
    }
  });

  const signOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    props.history.push("/auth");
    setAuth(null);
    console.log("cerrando secion");
  };

  return auth !== null ? (
    <div className="navbar navbar-expand-lg navbar-light bg-light ">
      <Link to="/" className="navbar-brand">
        React Admin
      </Link>
      <div className="">
        <div className="d-flex">
          <NavLink className="btn  mr-2" to="/" exact>
            Inicio
          </NavLink>
          <NavLink className="btn  mr-2" to="/pets">
            My Vet
          </NavLink>
          <button className="btn" onClick={signOut}>
            Cerrar Secion
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="navbar navbar-expand-lg navbar-light bg-light ">
      <Link to="/" className="navbar-brand">
        React Admin
      </Link>
      <div className="">
        <div className="d-flex">
          <NavLink className="btn  mr-2" to="/" exact>
            Inicio
          </NavLink>
          <NavLink className="btn " to="/auth">
            <i className="far fa-user"></i>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default withRouter(NavBar);
