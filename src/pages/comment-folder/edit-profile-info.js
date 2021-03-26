import React from 'react';
import {Helmet} from 'react-helmet';
import User from './user';
import ErrorBoundary from './error-boundary';
import FormValidate from './form-validate.js';
import ProfileCookies from './post-validation.js';
import { getFirebase} from '../../firebase';

class EditProfile extends React.Component
{
	constructor(props)
	{
		super(props);
		this.profileCookies = new ProfileCookies();
		this.userName = this.profileCookies.retrieveUserSession();
		this.formValidate = new FormValidate();
		this.formValidate.initializeError();
		this.state={
		    name:"", qualification:"", university:"",
			dob:"",updated:"",
		    nameValid:"", qualificationValid:"", universityValid:"", error:""
			
		};
		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleChangeQualification = this.handleChangeQualification.bind(this);
		this.handleChangeUniversity = this.handleChangeUniversity.bind(this);
		this.handleChangeDOB = this.handleChangeDOB.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChangeName(event)
	{
		this.setState({name:event.target.value, nameValid:this.formValidate.textError(event.target.name,event.target.value)})
	}
	handleChangeQualification(event)
	{
		this.setState({qualification:event.target.value, 
					   qualificationValid:this.formValidate.textError(event.target.name,event.target.value)})
	}
	handleChangeUniversity(event)
	{
		this.setState({university:event.target.value, 
			           universityValid:this.formValidate.textError(event.target.name,event.target.value)})
	}
	handleChangeEmployment(event)
	{
		this.setState({dob:event.target.value, dobValid:this.formValidate.dob(event.target.value)})
	}
	componentDidMount()
	{
		getFirebase.database().ref().child('users').orderByChild('username').equalTo(this.userName)
		.on("value",(snapshot)=>
		{
			var values = Object.values(snapshot.val())[0];
			this.setState({
				 name:values.name, qualification:values.qualification,
				university:values.university, dob:values.dob
			})
		})
	}
	checkFields()
	{
		this.setState(
		{
			nameValid:this.formValidate.textError("name",this.state.name),
			qualificationValid:this.formValidate.textError("qualification",this.state.qualification),
			universityValid:this.formValidate.textError("university",this.state.university),
			dobValid:this.formValidate.dob(this.state.dob)
		}
		)
	}
	updateInitialize()
	{
		var values =[];
		values[0] ={
			name:this.state.name,
			qualification:this.state.qualification,
			university:this.state.university,
			dob:this.state.dob,
			imageURL:"",
			username:this.userName,
			userURL:this.userName
		}
		values[1] = 
		{
			username:this.userName
		}
		return values;
	}
	update()
	{		
		var values = this.updateInitialize();
		getFirebase.database().ref().child('users').orderByChild('username').equalTo(this.userName)
			.on("value",(snapshot)=>
				{
					snapshot.forEach((child)=>
						{
							var update = {};
							update['/users/' + child.key] = values[0];
							 getFirebase.database().ref().update(update);
							update={};
							update['/login/'+child.key] = values[1];
							getFirebase.database().ref().update(update);
						})
		});
		this.setState({updated:"Profile Updated"})
		var updated;
		if(this.state.updated==="Profile Updated")
		{
			updated=this.state.updated;
			document.getElementById("editprofile").classList.remove("hidden");		
		}

		return(
			<div className="App">
				<Helmet>
					<title> Edit Profile </title>
				</Helmet>
				<ErrorBoundary>
				<User />
				</ErrorBoundary>
				<div className="card editProfile">
					<div className="card-body">
						<ErrorBoundary>
						<form onSubmit={this.handleSubmit}>
						<h4 className="heading"> Login Information </h4>
						<h4 className="heading"> Personal Details </h4>
						<div className="flexDiv">	
							<div className="label">
								<label> Full Name :  </label>
							</div>
							<div className="formelement">
								<input className="form-control" name="name" type="text" placeholder="Enter Full Name" onChange={this.handleChangeName} value={this.state.name}/>
								<div className="error"><p>{this.state.nameValid}</p></div>
							</div>
						</div>
						<div className="flexDiv">	
							<div className="label">
								<label> Highest Educational Qualification :  </label>
							</div>
							<div className="formelement">
								<input className="form-control" name="qualification" type="text" placeholder="Enter Qualification" onChange={this.handleChangeQualification} value={this.state.qualification}/>
								<div className="error"><p>{this.state.qualificationValid}</p></div>
							</div>
						</div>
						<div className="flexDiv">	
							<div className="label">
								<label> School/University :  </label>
							</div>
							<div className="formelement">
								<input className="form-control" name="university" type="text" placeholder="Enter School/University" onChange={this.handleChangeUniversity} value={this.state.university}/>
								<div className="error"><p>{this.state.universityValid}</p></div>
							</div>
						</div>
						<div className="flexDiv">	
							<div className="label">
								<label> Date of Birth :  </label>
							</div>
							<div className="formelement">
								<input className="form-control" name="dob" type="text" placeholder="Enter Date of Birth (E.g.:1993/02/19)" onChange={this.handleChangeDOB} value={this.state.dob}/>
								<div className="error"><p>{this.state.dobValid}</p></div>
							</div>
						</div>
						<div className="flexDiv">
							<button className="btn btn-primary update" type="submit"> Update Profile </button> 
							<button className="btn btn-primary update cancelEdit"> <a href="/">Cancel Changes </a></button>
						</div>
						</form>
						<div id="editprofile" className="hidden userUpdated"> {updated} </div>
						</ErrorBoundary>
					</div>
				</div>
			</div>
			);
	}
}

export default EditProfile;