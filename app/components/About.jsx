import React from 'react';

class About extends React.Component {
	constructor(){
		super();
	}
	render(){
		return (
			<div className="about">
				<p>This is a note-taking application. It was made using node.js, react.js, redux and some more useful tools.</p>
			</div>
		);
	}
}

export default About;
