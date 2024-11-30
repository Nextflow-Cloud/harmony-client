import { Router, Route, Navigate } from "@solidjs/router";
import Main from "./Main";

function App() {

  return (
    <>
      <Router>
        <Route path="/" component={() => <Navigate href="/app" />} />
        <Route path="/app" component={Main} />
      </Router>
    </>
  )
}

export default App;
