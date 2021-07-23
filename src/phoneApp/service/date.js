export function hourTo12(hour24) {
    return (hour24 + 11) % 12 + 1;
}

export default class DateService {
    static Weekday = [
        {short:'Sun', long:'Sunday'},
        {short:'Mon', long:'Monday'},
        {short:'Tue', long:'Tuesday'},
        {short:'Wed', long:'Wednesday'},
        {short:'Thu', long:'Thursday'},
        {short:'Fri', long:'Friday'},
        {short:'Sat', long:'Saturday'}
    ];

    static Month = [
        {short:'Jan', long:'January'},
        {short:'Feb', long:'February'},
        {short:'Mar', long:'March'},
        {short:'Apr', long:'April'},
        {short:'May', long:'May'},
        {short:'Jun', long:'June'},
        {short:'Jul', long:'July'},
        {short:'Aug', long:'August'},
        {short:'Sep', long:'September'},
        {short:'Oct', long:'October'},
        {short:'Nov', long:'November'},
        {short:'Dec', long:'December'},
    ];

    static format(date, format) {
        const weekDay = date.getDay();
        const month = date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();
        const hour24 = date.getHours();
        const hour12 = (hour24 + 11) % 12 + 1;
        const minute = date.getMinutes();
        const second = date.getSeconds();

        // day
        format = format.replace(/%d/g, (day < 10 ? '0' : '') + day);
        format = format.replace(/%D/g, this.Weekday[weekDay].short);
        format = format.replace(/%j/g, day);
        format = format.replace(/%l/g, this.Weekday[weekDay].long);
        format = format.replace(/%N/g, weekDay + 1);
        format = format.replace(/%w/g, weekDay);

        // month
        format = format.replace(/%F/g, this.Month[month].long);
        format = format.replace(/%m/g, (month + 1 < 10 ? '0' : '') + (month + 1));
        format = format.replace(/%M/g, this.Month[month].short);
        format = format.replace(/%n/g, month + 1);

        // year
        format = format.replace(/%Y/g, year);
        format = format.replace(/%y/g, year.toString().slice(-2));

        // time
        format = format.replace(/%a/g, hour24 >= 12 ? 'pm' : 'am');
        format = format.replace(/%A/g, hour24 >= 12 ? 'PM' : 'AM');
        format = format.replace(/%g/g, hour12);
        format = format.replace(/%G/g, hour24);
        format = format.replace(/%h/g, (hour12 < 10 ? '0' : '') + hour12);
        format = format.replace(/%H/g, (hour24 < 10 ? '0' : '') + hour24);
        format = format.replace(/%i/g, (minute < 10 ? '0' : '') + minute);
        format = format.replace(/%s/g, (second < 10 ? '0' : '') + second);

        return format;
    }
}