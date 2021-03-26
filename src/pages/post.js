import React,{useState, useEffect} from "react";
import { Redirect } from "react-router-dom";
import {getFirebase} from "../firebase";

const Post = ({ match }) => {
  const [loading, setLoading]= useState(true)
  const[currentPost, setCurrentPost] =useState();
useEffect(() => {
  const slug = match.params.slug;
  
  //decode the slug
  const formattedSlug = decodeURI(slug);

  getFirebase()
  .database()
  .ref()
  .child(`/posts/${formattedSlug}`)
  .once("value")
  .then(snapshot => {
    console.log("snapshot", snapshot);
   if(snapshot.val()){
     setCurrentPost(snapshot.val())
   }
   setLoading(false);
    });
},[match]);

 if(loading && !currentPost) {

   }
   if(loading) {
    return <h1>Loading...</h1>;
   }

   const postDoesNotExist = !currentPost;
   if (postDoesNotExist) {
     return <Redirect to="/404" />;
   }

  return (
    <>
    <center>
      <img src={currentPost.coverImage} alt={currentPost.coverImageAlt}/>
      <h1>{currentPost.title}</h1>
      <em>{currentPost.datePretty}</em>
      <p dangerouslySetInnerHTML ={{__html: currentPost.content}}></p>
      </center>
    </>
  );
};

export default Post;
