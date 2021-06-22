import "./App.css";
import React from "react";
import NavBar from "./components/NavBar";
import Login from "./components/Users/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pets from "./components/pets/Pets";
import Pet from "./components/pets/Pet";

function App() {
  const [authUser, setAuthUser] = React.useState(false);

  React.useEffect(() => {
    let auth = localStorage.getItem("token");
    auth ? setAuthUser(auth) : setAuthUser(null);
  },[]);

  return authUser !== false ? (
    <Router>
      <div className="">
        <NavBar auth={authUser} />
        <Switch>
          <Route path="/" exact>
            Ruta de Inicio
          </Route>
          <Route path="/auth">
            <Login />
          </Route>
          <Route path="/pets/:id" exact>
            <Pet />
          </Route>
          <Route path="/pets">
            <Pets />
          </Route>
          Ruta de inicio
        </Switch>
      </div>
    </Router>
  ) : (
    <p>Cargando...</p>
  );
}

export default App;
