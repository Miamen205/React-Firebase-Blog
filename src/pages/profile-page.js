
import React, { useState, useEffect } from "react"
import { Card, Button, Alert, Nav, Navbar } from "react-bootstrap"
import { getFirebase } from "../firebase";
import { useAuth } from "./auth-context";
import { Link, useHistory } from "react-router-dom";
import CommentPost from "../pages/comment-folder/comment-post";
import "./style-sheets/profile-page.css"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/home")
    } catch {
      setError("Failed to log out")
    }
  }
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() =>{
    getFirebase()
    .database()
    .ref("/posts")
    .orderByChild("date")
    .once("value")
    .then(snapshot => {
      let posts = [];
      const snapshotVal = snapshot.val();
      for (let slug in snapshotVal) {
        posts.push(snapshotVal[slug]);
      }

      const newestFirst = posts.reverse();
      setBlogPosts(newestFirst);
      setLoading(false);
    });
  },[])
  
  if (loading) {
    return <h1>Loading...</h1>;
  }


  return (
    <>
    <br/>
    <div>
    <Navbar id="Navbar" bg="primary" variant="dark">
    <Navbar.Brand href="#home"></Navbar.Brand>
     <Nav.Link id="NavLink" href="/create">Create New Post</Nav.Link>
      <Nav.Link id="NavLink" href="#features">Features</Nav.Link>
      <Button id="NavLink" variant="link" onClick={handleLogout}>
          Log Out
        </Button>
    <Nav className="mr-auto">
    </Nav>
  </Navbar>
    </div>
  <br/>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4"> Your Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong> Sign In As Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div>
      <br/>
       <CommentPost />

      <div className="w-100 text-center mt-2">
      {blogPosts.map(blogPost => (
         <center>
        <Card.Body  style={{ width: '100%', padding:"2px",display: "inline-block",
        margin: "25px 10px" }} key={blogPost.slug} className="card">
          <Card.Img variant="top" src={blogPost.coverImage} alt={blogPost.coverImageAlt} />
          <div className="card-content">
            <Card.Title>
              {blogPost.title} &mdash;{" "}
              <span style={{ color: "#5e5e5e" }}>{blogPost.datePretty}</span>
            </Card.Title>
            <Card.Text
              dangerouslySetInnerHTML={{
                __html: `${blogPost.content.substring(0, 200)}...`
              }}
            ></Card.Text>
            <Link  to={`/post/${blogPost.slug}`}>Continue reading...</Link>
          </div>
        </Card.Body>
        </center>
      ))}
      </div>
      </div>
    </>
  )
}