importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-messaging.js');

firebase.initializeApp({
	'messagingSenderId': '736755019580'
});
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	// Customize notification here
	var notificationTitle = payload.title;
	var notificationOptions = {
		body: payload.body,
		icon: './sdgj_logo.png'
	};

	// eslint-disable-next-line no-restricted-globals
	return self.registration.showNotification(notificationTitle, notificationOptions);
});
