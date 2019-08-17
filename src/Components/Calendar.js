import React from 'react'
import moment from 'moment'
import 'moment-lunar'
import Logo from '../sdgj_horizontal_logo.png';

class Calendar extends React.Component {
	state = {
		dateObject: moment(),
		selectedDay: null,
		touched: false,
		startX: null,
		currentX: null
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

	onSelect = (d) => {
		this.setState({
			selectedDay: d
		});
	};

	onTouchMove = (e) => {
		if (this.state.touched) {
			this.setState({
				currentX: e.targetTouches[0].clientX
			});
		} else {
			this.setState({
				startX: e.targetTouches[0].clientX,
				touched: true
			});
		}
	};

	onTouchEnd = () => {
		const { currentX, startX } = this.state;
		if (Math.abs(currentX - startX ) > 130) {
			currentX - startX > 0 ? this.onPrev() : this.onNext();
		}
		this.setState({
			touched: false,
			currentX: null,
			startX: null
		});
	};

	isToday = (d) => {
		const { dateObject } = this.state;
		const day = moment({
			years: dateObject.format('Y'),
			months: Number(dateObject.format('MM'))-1,
			date: d
		});
		const today = moment().format('YYYY-MM-DD');
		return !!day.isSame(today)
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

	isSaturday = (d) => {
		const { dateObject } = this.state;
		const day = moment({
			years: dateObject.format('Y'),
			months: Number(dateObject.format('MM'))-1,
			date: d
		}).day();
		return day === 6;
	};

	isHoliday = (d) => {
		const { dateObject } = this.state;
		const holidays = [
			// 신정
			moment({ years: this.year(), months: 0, date: 1}),
			// 설날
			moment({ years: this.year(), months: 0, date: 1}).solar(),
			moment({ years: this.year(), months: 0, date: 1}).subtract(1, 'day').solar(),
			moment({ years: this.year(), months: 0, date: 1}).add(1, 'day').solar(),
			// 3.1
			moment({ years: this.year(), months: 2, date: 1}),
			// 어린이날
			moment({ years: this.year(), months: 4, date: 5}),
			// 부처님 오신날
			moment({ years: this.year(), months: 4, date: 12}),
			// 현충일
			moment({ years: this.year(), months: 5, date: 6}),
			// 광복절
			moment({ years: this.year(), months: 7, date: 15}),
			// 추석
			moment({ years: this.year(), months: 7, date: 15}).solar(),
			moment({ years: this.year(), months: 7, date: 15}).subtract(1, 'day').solar(),
			moment({ years: this.year(), months: 7, date: 15}).add(1, 'day').solar(),
			// 개천절
			moment({ years: this.year(), months: 9, date: 3}),
			// 한글날
			moment({ years: this.year(), months: 9, date: 9}),
			// 크리스마스
			moment({ years: this.year(), months: 11, date: 25}),
		];
		const day = moment({
			years: dateObject.format('Y'),
			months: Number(dateObject.format('MM'))-1,
			date: d
		});
		return !!holidays.find((holiday) => holiday.isSame(day));
	};

	render() {
		let weekdaysName = this.weekdayShort.map((day, i) => {
			let chineseWeekday = '';
			switch (i) {
				case 0:
					chineseWeekday = '日';
					break;
				case 1:
					chineseWeekday = '月';
					break;
				case 2:
					chineseWeekday = '火';
					break;
				case 3:
					chineseWeekday = '水';
					break;
				case 4:
					chineseWeekday = '木';
					break;
				case 5:
					chineseWeekday = '金';
					break;
				case 6:
					chineseWeekday = '土';
					break;
				default:
					break;
			}
			return (
				<th key={day} className="calendar-week-day">
					<p className="ch">{chineseWeekday}</p>
					<p className="en">{day.toUpperCase()}</p>
				</th>
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
			if (this.isToday(day)) classes.push('today');
			if (this.isSunday(day) || this.isHoliday(day)) classes.push('holiday');
			if (this.isSaturday(day)) classes.push('saturday');
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
			<div className="calendar"
			     onTouchMove={(e) => this.onTouchMove(e)}
			     onTouchEnd={() => this.onTouchEnd()}>
				<section className="calendar-header">
					<div className="calendar-label">
						<div className="calendar-label-month">{this.month().toUpperCase()}</div>
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
					<img src={Logo} alt="logo" />
					<p className="address">서울 마포구 서교동 358-93</p>
					<p className="copy-rights">© 2019 시대공작</p>
				</section>
			</div>
		);
	}
}

export default Calendar;