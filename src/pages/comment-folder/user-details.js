import React from 'react';
import ErrorBoundary from './error-boundary.js';
import ProfileCookies from './profile-cookies.js';
import { getFirebase} from '../../firebase'

class UserDetails extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={
			dob:"", imageURL:"", name:"", qualification:"",
			university:"", userURL:"", username:""
			}
		this.profileCookies = new ProfileCookies();
	}
	componentDidMount()
	{
		var username = this.profileCookies.retrieveUserSession();
        getFirebase.database().ref().child("users").orderByChild("username").equalTo(username).on('value',snap=>
			{
				var user = Object.values(snap.val())[0];
				this.setState({ dob:user.dob, imageURL:user.imageURL, name:user.name,
					qualification:user.qualification, university:user.university,
					userURL:user.userURL, username:user.username })
			});
	}
	render()
	{
		return(
			<ErrorBoundary>
			<div className="user">
				<div className="card postDiv">
	         		<div className = "card-body">
	         			<div className="flexDiv">
	         				<img className="icon" src="images/profile/profile.png" alt="profile"/>
		         			<a href={this.state.userURL}> {this.state.name} </a>
	         			</div>
	         			<div className="flexDiv">
	         				<img className="icon" src="images/icons/qualification.png" alt="qualification"/>
	         				<p> {this.state.qualification}</p>
	         			</div>
	         			<div className="flexDiv">
	         				<img className="icon" src="images/icons/university.png" alt="university"/>
	         				<p> {this.state.university}</p>
	         			</div>
	         		</div>
	         	</div>
			</div>
			</ErrorBoundary>
			);
	}
}

export default UserDetails;