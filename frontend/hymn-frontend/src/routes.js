import { Route, BrowserRouter as Router, Switch,useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/views/Home";
import ListView from "./components/views/ListView";

const Routes = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/list/:type/:listId' exact component={ListView}/>
        </Switch>
      </Layout>
    </Router>

  );
};

export default Routes;
