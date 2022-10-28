import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/*components*/
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";

import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Home from "./components/pages/Home";

import { UseProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <UseProvider>
        <Navbar />
        <Container>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </UseProvider>
    </Router>
  );
}

export default App;
