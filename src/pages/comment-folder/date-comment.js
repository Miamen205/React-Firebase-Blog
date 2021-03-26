import React from 'react';
import * as GetDate from './get-date.js';

class DateComment extends React.Component
{
	render()
	{
		return(
			<p className="datetime"> {GetDate.getDate(this.props.date)} ago </p>
			);
	}
}

export default DateComment;