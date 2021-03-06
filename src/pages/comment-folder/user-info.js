import React from 'react';
import DateComment from './date-comment.js';
import ErrorBoundary from './error-boundary.js';
import ProfileCookies from './profile-cookies.js';
import { getFirebase}from '../../firebase'
import PostValidation from './post-validation';
import CommentValidation from './comment-validation.js';

class UserInfo extends React.Component
{
	constructor()
	{
		super();
		this.state={
			userURL : '',name:''
			}
		this.post = new PostValidation();
		this.profileCookies = new ProfileCookies();
		this.editPost = this.editPost.bind(this);
	}
	editPost(event)
	{
		var id = event.target.id;
		this.post.getPost(id);
	}
	editComment(event)
	{
		var id = event.target.id;
		var commentValidation = new CommentValidation();
		commentValidation.getComment(id);
	}
	componentDidMount()
	{
        getFirebase.database().ref().child("users").orderByChild("username").equalTo(this.props.userName).on('value',snap=>
		{
			var user=  Object.values(Object(snap.val()))[0];
			this.setState((state)=>(
		 	{
		 		userURL:user.userURL,
		 		name:user.name
		 	}));
		})
	}
	render()
	{
      	var button,edited="";
      	if(this.props.type==="post")
      	{
      		button=<button onClick={this.editPost} 
      		className={this.props.userName===this.profileCookies.retrieveUserSession()?'':'hidden'} > 
      		<img id={this.props.postId}  src="/images/icons/edit.png" className="editButton" alt="editPost"/></button>
      	}
      	if(this.props.type==="comment")
      	{
      		button=<button onClick={this.editComment}
      		className="{this.props.userName===this.profileCookies.retrieveUserSession()?'':'hidden'} editButtonbtn"> 
      		<img id={this.props.commentId}  src="/images/icons/edit.png" className="editButton" alt="editComment"/> </button>
      	}
      	if(this.props.edited==="true")
      	{
      		edited="Edited";
      	}
		return(
			<ErrorBoundary>
			<div className="postinformation">
				<div className="flexDiv">
					<a className="userLink" href={this.state.userURL} rel="noopener noreferer" target="_blank"><strong>{this.state.name} </strong></a>
					<div>
					<p className="edited">{edited}</p>
					<DateComment date={this.props.date}/>
					{button}
					</div>
				</div>
			</div>
			</ErrorBoundary>
			);
	}
}

export default UserInfo;