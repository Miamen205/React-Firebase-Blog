import React from 'react';

import{ getFirebase} from '../../firebase';


class Avatar extends React.Component
{
	render()
	{
		return(
				<img className="avatar" src="images/profile/profile.png" alt="userImage"/>
			);
	}
}

export default Avatar;