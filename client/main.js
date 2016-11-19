import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

class Month {

    /**
     * Create a month
     * @param month 1-based index number of the month
     * @param year
     */
    constructor(month, year = (new Date).getFullYear()) {
        this.date = new Date(year, month, 0)
        this._days = new Array(this.date.getDate())
    }

    get days() {
        return Array.from(this._days.keys()).map(day => day + 1)
    }

    get weeks() {
        const overflowDays = this.firstWeekDaysNotInThisMonth
        const days = this.days
        let rest = []
        for (var day=7-overflowDays.length; day<days.length; day+=7)
            rest.push(days.slice(day, day+7))
        return {
            first: {
                overflowDays,
                normalDays: days.slice(0, 7-overflowDays.length)
            },
            rest
        }
    }

    get firstWeekDaysNotInThisMonth() {
        let lastDay = new Date(this.date.getTime())
        const count = (lastDay.getDay() - this.days.length%7 + 7) % 7
        lastDay.setDate(0);
        const lastDate = lastDay.getDate()
        return Array.from((new Array(count)).keys()).map(index => lastDate - count + 1 + index)
    }

    toString() {
        return this.date.toLocaleString(undefined, {month: 'long'})
    }
}

Template.body.helpers({
   months: [new Month(1), new Month(2)]
});