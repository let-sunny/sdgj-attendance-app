import React from 'react'

class Header extends React.Component {
	state = {
		user: null,
		isFetching: true
	};

	async componentDidMount() {
		await this.props.firebase.auth.onAuthStateChanged(this.user);
	};

	user = (user) => {
		this.setState({
			user,
			isFetching: false
		});
	};

	signIn = async () => {
		try {
			await this.props.firebase.signIn();
		} catch (e) {
			console.log(e);
		}
	};

	signOut = async () => {
		try {
			await this.props.firebase.signOut();
		} catch (e) {
			console.log(e);
		}
	};

	render() {
		if (this.state.isFetching) {
			return (<div>...</div>);
		} else if (this.state.user) {
			return (
				<div>
					<p>{this.state.user.email || this.state.user.phoneNumber}</p>
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