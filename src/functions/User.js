class User {
	constructor(firebase) {
		this.firebase = firebase;
	}

	getUser = async (account) => {
		if (!account) return;

		const userRef = this.firebase.db.collection('users').doc(account.email);
		const user = await userRef.get();
		try {
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

		const userRef = this.firebase.db.collection('users').doc(account.email);
		const user = await userRef.get();
		try {
			if (!user.exists) {
				await userRef.set({
					createdAt: new Date().getTime(),
					name: account.displayName || '',
					isMember: false,
					imageUrl: account.photoURL || ''
				});
			} else {
				await userRef.set({
					lastSignedIn: new Date().getTime()
				}, { merge: true });
			}
		} catch (e) {
			console.log(e);
		}
	};
}

export default User;