
import React from "react"
import Signup from "./pages/sign-up"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./pages/auth-context"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./pages/profile-page"
import Home from "./pages/home"
import Login from "./pages/sign-in"
import PrivateRoute from "./pages/secret-route"
import ForgotPassword from "./pages/reset-password"
import UpdateProfile from "./pages/update-profile"
import Create from "./pages/create";
import Post from "./pages/post";
import SecondNoMatch from"./pages/second-no-match";
import NoMatch from "./pages/no-match";
import SecondPost from "./pages/second-post";
import CommentPost from "./pages/comment-folder/comment-post"


function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/create" component={Create} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateRoute  path="/post/:slug" component={Post} />
              <PrivateRoute path="/comment-post" component={CommentPost} />
              <Route path="/signup" component={Signup} />
              <Route path="/404" component={NoMatch} />
              <Route path="/second404" component={SecondNoMatch} />
              <Route  path="/home" component={Home} />
              <Route  path="/second-post" component={SecondPost} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
