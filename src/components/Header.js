import React from 'react'
import User from '../actions/User';

class Header extends React.Component {
	firebase = this.props.firebase;
	state = {
		user: null,
		isFetching: true
	};

	async componentDidMount() {
		await this.firebase.auth.onAuthStateChanged(this.user);
		if (this.firebase.messaging) {
			await this.firebase.messaging.onTokenRefresh(this.getToken);
			await this.getToken();
			this.requestPermission();
		}
	};

	getToken = async () => {
		try {
			const currentToken = await this.firebase.messaging.getToken();
			if (currentToken) {
				this.setState({ deviceToken: currentToken });
			} else {
				console.log('No Instance ID token available. Request permission to generate one.');
			}
		} catch (e) {
			console.log(e);
		}
	};

	setUser = async (user) => await new User(this.firebase).setUser(user);

	user = async (user) => {
		if (user) await this.setUser({ ...user, deviceToken: this.state.deviceToken });
		this.setState({
			user,
			isFetching: false
		});
	};

	signIn = async () => {
		try {
			await this.firebase.signIn();
		} catch (e) {
			console.log(e);
		}
	};

	signOut = async () => {
		try {
			await this.firebase.signOut();
		} catch (e) {
			console.log(e);
		}
	};

	requestPermission = () => {
		console.log('Requesting permission...');
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			} else {
				console.log('Unable to get permission to notify.');
			}
		});
	};

	render() {
		if (this.state.isFetching) {
			return (<div><p>...</p></div>);
		} else if (this.state.user) {
			return (
				<div>
					{
						this.state.user.photoURL
							? (<img src={this.state.user.photoURL} alt={this.state.user.email} />)
							: (<p>{this.state.user.email || this.state.user.phoneNumber}</p>)
					}
					{/*<button onClick={() => this.signOut()}>나가기</button>*/}
				</div>
			);
		} else {
			return (
				<div>
					<button onClick={() => this.signIn()}>입장</button>
				</div>
			);
		}
	}
}

export default Header;