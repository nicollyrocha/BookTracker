import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CadastroLivro from './components/cadastrar-livro/CadastroLivro';
import CadastroUser from './components/cadastro-user/CadastroUser';
import LandingPage from './components/landing-page/LandingPage';
import Login from './components/login/Login';

function Router() {
  return (
    <Router>
      <div className="router">
        <Link to="/home">Home</Link>
        <Link to="/cadastrar">About</Link>
      </div>
      <Switch>
        <Route path="/home" component={LandingPage} />
        <Route exact path="/" component={Login} />
        <Route path="/cadastrar" component={CadastroLivro} />
        <Route path="/cadastrarse" component={CadastroUser} />
      </Switch>
    </Router>
  );
}

export default Router;
