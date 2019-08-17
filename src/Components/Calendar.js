import React from 'react'
import moment from 'moment'
moment.updateLocale('kr', {
	weekdaysShort : ['일', '월', '화', '수', '목', '금', '토']
});

class Calendar extends React.Component {
	state = {
		dateObject: moment(),
		selectedDay: null
	};

	weekdayShort = moment.weekdaysShort();

	firstDayOfMonth = () => {
		const { dateObject } = this.state;
		return moment(dateObject)
			.startOf('month')
			.format('d');
	};

	daysInMonth = () => {
		return this.state.dateObject.daysInMonth();
	};

	today = () => {
		return this.state.dateObject.format('D');
	};

	month = () => {
		return this.state.dateObject.format('M');
	};

	year = () => {
		return this.state.dateObject.format('Y');
	};

	onPrev = () => {
		this.setState({
			dateObject: this.state.dateObject.subtract(1, 'month'),
			selectedDay: null
		});
	};

	onNext = () => {
		this.setState({
			dateObject: this.state.dateObject.add(1, 'month'),
			selectedDay: null
		});
	};

	isSunday = (d) => {
		const { dateObject } = this.state;
		const day = moment({
			years: dateObject.format('Y'),
			months: Number(dateObject.format('MM'))-1,
			date: d
		}).day();
		return day === 0;
	};

	onSelect = (d) => {
		this.setState({
			selectedDay: d
		});
	};

	render() {
		let weekdaysName = this.weekdayShort.map(day => {
			return (
				<th key={day} className="calendar-week-day">{day}</th>
			);
		});

		const blanks = new Array(Number(this.firstDayOfMonth())).fill(0).map((num, i) => {
			return (
				<td key={`blank-${i}`} className="calendar-day blank">{''}</td>
			);
		});

		const daysInMonth = new Array(this.daysInMonth()).fill(0).map((num, i) => {
			const day = i + 1;

			// set class
			const classes = ['calendar-day'];
			if (Number(day) === Number(this.today())) classes.push('today');
			if (this.isSunday(day)) classes.push('sunday');

			return (
				<td key={day} className={classes.join(' ')}>
					<button type="button"
					        name={day} onClick={() => this.onSelect(day)}>{day}</button>
				</td>
			);
		});

		const totalCells = [...blanks, ...daysInMonth];
		let weeks = [];
		let week = [];
		totalCells.forEach((cell, i) => {
			if (i === 0 || i % 7 !== 0) {
				week.push(cell);
			} else { // new week
				weeks.push(week);
				week = [];
				week.push(cell);
			}
			// last day
			if (i === totalCells.length - 1) { weeks.push(week); }
		});

		let weeksInMonth = weeks.map((week, i) => {
			return <tr key={`week-${i}`}>{week}</tr>;
		});

		return (
			<div className="calendar">
				<section className="calendar-header">
					<nav className="calendar-nav">
						<button onClick={() => {this.onPrev();}}
						        className="calendar-button button-prev"
						>{'<'}</button>
						<button onClick={() => {this.onNext();}}
						        className="calendar-button button-next"
						>{'>'}</button>
					</nav>
					<div className="calendar-label">
						<div className="calendar-label-month"><strong>{this.month().toUpperCase()}</strong></div>
						<div className="calendar-label-year"> {this.year()}</div>
					</div>
				</section>

				<section className="calendar-body">
					<table className="calendar-table">
						<thead><tr>{weekdaysName}</tr></thead>
						<tbody>{weeksInMonth}</tbody>
					</table>
				</section>

				<section className="calendar-footer">
					© 2019 시대공작
				</section>
			</div>
		);
	}
}

export default Calendar;