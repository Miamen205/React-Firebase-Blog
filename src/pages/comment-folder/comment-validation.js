import React from 'react';
import { getFirebase} from '../../firebase'
import ProfileCookies from './profile-cookies';

class CommentValidation extends React.Component
{
	  constructor()
    {
      super();
      this.profileCookies = new ProfileCookies();
    }
    getComment=(id)=>
    {
      var element = "comment"+id;
      document.getElementById(element).contentEditable="true";
      document.getElementById(element).parentNode.childNodes[1].classList.remove("hidden");
    }

    comment=(text,id,post)=>
    {
      var commentDate = new Date();
      var dateString = commentDate.getFullYear()+"/"+(commentDate.getMonth()+1)+"/"+commentDate.getDate()+" "
                      +commentDate.getHours()+":"+commentDate.getMinutes()+":"+commentDate.getSeconds();
      var comment={
        datetime:dateString,
        edited:"true",
        commentid:id,
        description:text,
        postid:post,
        username:this.profileCookies.retrieveUserSession()
      }
      return comment;
    }

    updateComment=(text,id,post)=>
    {  
      var element = "comment"+id;
      document.getElementById(element).contentEditable="false";
      document.getElementById(element).parentNode.childNodes[1].classList.add("hidden");  
      getFirebase.database().ref().child('comment').orderByChild('commentid').equalTo(id)
      .on("value",(snapshot)=>
      {
        snapshot.forEach((child)=>
        {
          var update={};
          update['/comment/'+child.key] = this.comment(text,id,post);
          getFirebase.database().ref().update(update);
        })
      })
    }
}

export default CommentValidation;