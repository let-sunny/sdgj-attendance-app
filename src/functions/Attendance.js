class Attendance {
	constructor(firebase) {
		this.firebase = firebase;
	}

	setAttendance = async (date, user) => {
		if (!user) return;
		const attendanceMemberRef = this.firebase.db
			.collection('attendances').doc(date)
			.collection('members').doc(user.email);
		const attendance = await attendanceMemberRef.get();
		try {
			if (!attendance.exists) {
				await attendanceMemberRef.set({
					createdAt: new Date().getTime(),
					name: user.name,
					isDeleted: false
				});
			}
			// 삭제 기능은 일단 보류
			// else {
			// 	await attendanceMemberRef.set({
			// 		isDeleted: !attendance.data().isDeleted,
			// 		updatedAt: new Date().getTime()
			// 	}, { merge: true });
			// }
		} catch (e) {
			console.log(e);
		}
	};

	getAttendances = async (date) => {
		const attendanceMemberRef = this.firebase.db
			.collection('attendances').doc(date).collection('members').where("isDeleted", "==", false);
		const querySnapshot = await attendanceMemberRef.get();
		if (!querySnapshot.empty) {
			const { docs } = querySnapshot;
			return docs.map(doc => ({ ...doc.data(), email: doc.id }))
		} else {
			return [];
		}
	}
}

export default Attendance;