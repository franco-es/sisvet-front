import React from "react";
import { Link, NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
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
    <Container fluid>
      <Nav className=" navbar navbar-expand-lg navbar-light bg-light ">
        <Link to="/" className="navbar-brand ">
          Sis Vet
        </Link>
        <Nav className="">
          <Nav.Item className="">
            <NavLink className="btn  mr-2" to="/" exact>
              Inicio
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink className="btn  mr-2" to="/pets">
              My Vet
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <button className="btn" onClick={signOut}>
              Cerrar Secion
            </button>
          </Nav.Item>
        </Nav>
      </Nav>
    </Container>
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
