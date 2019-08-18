import app from 'firebase/app'
import 'firebase/auth'
import config from './firebase-config'

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
		// this.db = app.database();

		this.googleProvider = new app.auth.GoogleAuthProvider();
	}

	signIn = () => this.auth.signInWithRedirect(this.googleProvider);

	signOut = () => this.auth.signOut();
}

export default Firebase;