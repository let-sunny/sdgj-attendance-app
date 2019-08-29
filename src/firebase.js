import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'
import config from './firebase-config'

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
		this.db = app.firestore();

		if (app.messaging.isSupported()) {
			this.messaging = app.messaging();
			this.messaging.usePublicVapidKey("BKT5Y-lwDSUMVzfmiRGUUSzBEnE1fz0_2VEABChqJer6pf-r7JHnQPAWlSBcSCYclfyL2pePRIrBRuL6y3efkqY");
		}

		this.googleProvider = new app.auth.GoogleAuthProvider();
	}

	enablePersistenceDB = () => this.db.enablePersistence();

	signIn = () => this.auth.signInWithRedirect(this.googleProvider);

	signOut = () => this.auth.signOut();
}

export default Firebase;