class Attendance {
	constructor(firebase) {
		this.firebase = firebase;
	}

	setAttendance = async (date, user) => {
		if (!user || !date) return;
		try {
			const attendanceMemberRef = this.firebase.db
				.collection('attendances').doc(date)
				.collection('members').doc(user.email);
			const attendance = await attendanceMemberRef.get();
			if (!attendance.exists) {
				await attendanceMemberRef.set({
					createdAt: new Date().getTime(),
					name: user.name,
					isDeleted: false
				});
			} else {
				await attendanceMemberRef.set({
					isDeleted: !attendance.data().isDeleted,
					updatedAt: new Date().getTime()
				}, { merge: true });
			}
		} catch (e) {
			console.log(e);
		}
	};

	getAttendances = async (date) => {
		if (!date) return;
		try {
			const attendanceMemberRef = this.firebase.db
				.collection('attendances').doc(date)
				.collection('members').where('isDeleted', '==', false).orderBy('createdAt');
			const querySnapshot = await attendanceMemberRef.get();
			if (!querySnapshot.empty) {
				const { docs } = querySnapshot;
				return docs.map(doc => ({ ...doc.data(), email: doc.id }))
			} else {
				return [];
			}
		} catch (e) {
			console.log(e);
		}
	}
}

export default Attendance;