const functions = require('firebase-functions');
const admin = require('firebase-admin');

try {
	admin.initializeApp();
} catch (e) {
	console.log(e);
}
const db = admin.firestore();

// Send push notification when a user has been attending.
exports.sendNotification = functions.firestore
	.document('attendances/{date}/members/{email}')
	// eslint-disable-next-line consistent-return
	.onWrite(async (change, context) => {
		const email = context.params.email;
		const date = context.params.date;
		const dateString = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(-2)}`;


		let members = [];
		try {
			members = await getMembers();
		} catch (e) {
			console.log(e);
		}

		let currentMember = {};
		const otherMembers = [];
		members.forEach(member => {
			if (member.email === email) {
				currentMember = member;
			} else {
				otherMembers.push(member);
			}
		});

		const tokens = otherMembers.filter(member => member.deviceToken).map(member => member.deviceToken);
		// Notification details.
		const payload = {
			notification: {
				title: `${dateString} 출석`,
				body: `${currentMember.name}님이 출석하셨습니다.`
			}
		};
		if (tokens.length) return admin.messaging().sendToDevice(tokens, payload);
	});

const getMembers = async () => {
	const ref = db.collection('users').where('isMember', '==', true);
	const querySnapshot = await ref.get();
	if (!querySnapshot.empty) {
		const { docs } = querySnapshot;
		return docs.map(doc => ({ ...doc.data(), email: doc.id }))
	} else {
		return [];
	}
};
