import React, { Component } from 'react';
import UploadForm from '../../organisms/upload/index';
import { getDecodedAccessToken } from '../../../services/shared/auth';
class UploadPage extends Component {
	constructor() {
		super();
		if(getDecodedAccessToken() === undefined) {
			window.location.replace("/login");
		}
	}
	render() {
		return (
			<>
				<UploadForm/>
			</>
		);
	}
}

export default UploadPage;