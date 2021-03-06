import React from 'react';
import Avatar from './avatar';
import UserInfo from './user-info';
import ErrorBoundary from './error-boundary.js';
import ProfileCookies from './profile-cookies.js';
import CommentValidation from './comment-validation.js';
import {getFirebase} from '../../firebase';

class Comment extends React.Component
{

	constructor(props)
	{
		super(props);
		this.state={
			comments : [],
			value:""
		}
		this.db = getFirebase.database().ref();
		this.profileCookies = new ProfileCookies();
		this.logged = new ProfileCookies();
		this.commentV = new CommentValidation();
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.submitComment = this.submitComment.bind(this);
	}
	componentDidMount()
	{
		this.db.child("comment").orderByChild("postid").equalTo(this.props.postid)
			.on('value',snap=>
			{
				this.state.comments.push(snap.val())
				this.setState((state)=>({comments:this.state.comments}));
			});
	}
	handleChange(event)
	{
		let value = this;
		value.setState({value:event.target.value})
	}
	getCommentKey()
	{
		var commentDate= new Date();
		var date = commentDate.getFullYear().toString()+(commentDate.getMonth()+1).toString()+commentDate.getDate().toString()+
		commentDate.getHours().toString()+commentDate.getMinutes().toString()+commentDate.getSeconds().toString();
		var commentKey = "comment"+date.toString();
		return commentKey;
	}
	newComment(value)
	{		
		var commentDate= new Date();
		var dateString = commentDate.getFullYear()+"/"+(commentDate.getMonth()+1)+"/"+commentDate.getDate()+" "
		+commentDate.getHours()+":"+commentDate.getMinutes()+":"+commentDate.getSeconds();		
		const comment = {[this.getCommentKey()]:{
			"datetime":dateString,
			"description":value,
			"postid":this.props.postid,
			"username":this.profileCookies.retrieveUserSession()
		}}
		return comment;
	}
	getNewCommentKey()
    {
      return new Promise(function(resolve,reject){
        getFirebase.database().ref().child("comment").orderByChild("commentid").on("value",snapshot=>
      {
        var keys = Object.keys(snapshot.val());
        var value = keys[keys.length-1];     
        resolve("comment"+(parseInt(value[value.length-1])+1));
      }) 
    })
      
    }
	writeData(comment)
	{
		this.getNewCommentKey().then((key)=>{
			getFirebase.database().ref('comment/'+ key).set({
					"commentid":parseInt(key[key.length-1]),
					"datetime":Object.values(comment)[0]["datetime"],
					"description":Object.values(comment)[0]["description"],
					"postid":Object.values(comment)[0]["postid"],
					"username":Object.values(comment)[0]["username"]
			});
		})
	}

	submitComment(event)
	{
	  event.preventDefault();
      var id = event.target.id;
      var element = "comment"+id[id.length-1];
      var text = document.getElementById(element).innerHTML;

      if(this.logged.isLoggedIn()===true)
      {
	      this.commentV.updateComment(text,id[id.length-1],this.props.postid);
  	  }
      
	}

	handleSubmit(event)
	{
		event.preventDefault();
		if(this.state.comments[0]==null)
		{
			this.state.comments[0] = {};
		}
		var commentNew = this.newComment(this.state.value);
		this.state.value="";
		Object.assign(this.state.comments[0], commentNew);
		this.setState((state)=>({comments: this.state.comments}));
		this.writeData(commentNew);
	}

	render()
	{
		var commentsArr = Array.from(new Set(Object.values(Object(this.state.comments[0]))));
		return(
			<div>
				<div className="flexDiv"> 
					<p className="commentNumber"> {commentsArr.length} comment(s) </p>
				</div>
				<ErrorBoundary>
				<form onSubmit = {this.handleSubmit}>
					<div className="writecomment formgroup">
	                    <textarea value={this.state.value} className="form-control" rows="7" 
	                    onChange={this.handleChange} placeholder="Write Something"/>
	                    <button className="submit btn btn-primary" type="submit">Submit </button>
	                </div>
                </form>
                </ErrorBoundary>
				<div>
				{
       				commentsArr.map((comment,index)=>

       				<div className="comment" key={index}>
	       				<div className="flexDiv">
	       					<ErrorBoundary>
	       					<Avatar user={comment.username}/>
	       					</ErrorBoundary>
	       					<ErrorBoundary>
			        		<UserInfo commentId = {comment.commentid} userName = {comment.username} type="comment" date={comment.datetime}/>
							</ErrorBoundary>
						</div>
						<div className = "description">
								<ErrorBoundary>
	                              <p id={"comment"+comment.commentid} contentEditable="false" suppressContentEditableWarning="true"> {comment.description.replace(/&nbsp;/g, " ")} </p>
	                              <button id={"submit"+comment.commentid} onClick={this.submitComment} className="btn btn-primary hidden"> Submit </button>
	                    		</ErrorBoundary>
	                    </div>
	                    <hr/>
	                </div>  
       			)
       		}
       			</div>
       		</div>
			);
	}
}

export default Comment;