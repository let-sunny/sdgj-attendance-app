import React from 'react'

class Header extends React.Component {
	firebase = this.props.firebase;
	state = {
		user: null,
		isFetching: true
	};

	async componentDidMount() {
		await this.firebase.auth.onAuthStateChanged(this.user);
	};

	setUser = async (account) => {
		const userRef = this.firebase.db.collection('users').doc(account.email);
		const user = await userRef.get();
		if (!user.exists) {
			await userRef.set({
				createdAt: new Date().getTime(),
				name: account.displayName || '',
				isMember: false,
				imageUrl: ''
			});
		} else {
			await userRef.set({
				lastSignedIn: new Date().getTime()
			}, { merge: true });
		}
	};

	user = async (user) => {
		await this.setUser(user);
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