class User {
	constructor(firebase) {
		this.firebase = firebase;
	}

	getUser = async (account) => {
		if (!account) return;
		try {
			const userRef = this.firebase.db.collection('users').doc(account.email);
			const user = await userRef.get();
			if (!user.exists) {
				return null;
			} else {
				return {
					email: user.id,
					...user.data()
				};
			}
		} catch (e) {
			console.log(e);
		}
	};

	setUser = async (account) => {
		if (!account) return;
		try {
			const userRef = this.firebase.db.collection('users').doc(account.email);
			const user = await userRef.get();
			if (!user.exists) {
				await userRef.set({
					createdAt: new Date().getTime(),
					name: account.displayName || '',
					isMember: false,
					imageUrl: account.photoURL || '',
					deviceToken: account.deviceToken || ''
				});
			} else {
				await userRef.set({
					lastSignedIn: new Date().getTime(),
					deviceToken: account.deviceToken || user.data().deviceToken
				}, { merge: true });
			}
		} catch (e) {
			console.log(e);
		}
	};
}

export default User;