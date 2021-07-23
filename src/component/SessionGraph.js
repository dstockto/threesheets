import React, {Component} from "react";
import DateService from "../phoneApp/service/date";

import './SessionGraph.css';

export default class SessionGraph extends Component {
    static Offset = {x:20, y:0};
    static AxisLabel = {x:25, offset:12};
    static TimeLabel = {x:60, y:30, offset:20};
    static OunceLabel = {x:0, y:20, offset:12};
    static LabelMargin = 10;
    static RuleColor = 'rgba(255, 255, 255, 0.5)';
    static HistoryLineColor = 'white';
    static HistoryNodeColor = 'yellow';

    constructor(props) {
        super(props);

        this.startDate = new Date(props.history[0].date);
        this.endDate = new Date(props.history[props.history.length - 1].date);
        this.range = this.getRange();

        this.width = window.innerWidth;
        this.height = this.range * SessionGraph.TimeLabel.y +
            SessionGraph.OunceLabel.y +
            SessionGraph.Offset.y * 2 +
            SessionGraph.AxisLabel.x;

        this.maxOunces = Math.ceil(props.history[props.history.length - 1].alcohol);
        this.ounceWidth = (this.width - SessionGraph.TimeLabel.x - SessionGraph.Offset.x * 2) / this.maxOunces;

        this.axisRect = {
            l: 0,
            t: SessionGraph.Offset.y,
            w: this.width,
            h: SessionGraph.AxisLabel.x
        };

        this.ouncesRect = {
            l: SessionGraph.TimeLabel.x + SessionGraph.Offset.x,
            t: SessionGraph.AxisLabel.x + SessionGraph.Offset.y,
            w: this.width - (SessionGraph.TimeLabel.x + SessionGraph.Offset.x * 2),
            h: SessionGraph.OunceLabel.y
        };

        this.hoursRect = {
            l: SessionGraph.Offset.x,
            t: SessionGraph.OunceLabel.y + SessionGraph.AxisLabel.x + SessionGraph.Offset.y,
            w: SessionGraph.TimeLabel.x,
            h: this.range * SessionGraph.TimeLabel.y
        };

        this.nodePath = new Path2D();
        this.nodePath.arc(0, 0, 5, 0, Math.PI * 2);
        this.nodePath.closePath();

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.cnv = this.ref.current;
        this.ctx = this.cnv.getContext('2d');
        this.ctx.font = '16px Helvetica';

        this.draw();
    }

    getRange() {
        let start = new Date(this.startDate);
        start.setMinutes(0);
        start.setSeconds(0);

        let range = 0;

        while (start < this.endDate) {
            start.setHours(start.getHours() + 1);
            range ++;
        }

        return range + 1;
    }

    clear() {
        // this.ctx.fillStyle = 'purple';
        // this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw() {
        this.clear();
        this.drawAxis();
        this.drawOunces();
        this.drawHours();
        this.drawRules();
        this.drawHistory();
    }

    drawAxis() {
        // this.ctx.strokeStyle = 'white';
        // this.ctx.strokeRect(this.axisRect.l, this.axisRect.t, this.axisRect.w, this.axisRect.h);

        const label = 'Alcohol (fl oz)';
        const metrics = this.ctx.measureText(label);
        const x = (this.axisRect.w - metrics.width) * 0.5;
        const y = this.axisRect.t + SessionGraph.AxisLabel.offset;

        this.ctx.fillStyle = 'white';
        this.ctx.fillText(label, x, y);
    }

    drawOunces() {
        let x, metrics;

        // this.ctx.strokeStyle = 'white';
        // this.ctx.strokeRect(this.ouncesRect.l, this.ouncesRect.t, this.ouncesRect.w, this.ouncesRect.h);

        this.ctx.fillStyle = 'white';

        for (let i = 0; i < this.maxOunces + 1; i ++) {
            x = this.ouncesRect.l + i * this.ounceWidth;
            metrics = this.ctx.measureText(i.toString());

            // if (i < this.maxOunces) {
            //     this.ctx.strokeStyle = 'white';
            //     this.ctx.strokeRect(
            //         x,
            //         this.ouncesRect.t,
            //         this.ounceWidth,
            //         this.ouncesRect.h
            //     );
            // }

            this.ctx.fillText(
                i.toString(),
                x - metrics.width * 0.5,
                this.ouncesRect.t + SessionGraph.OunceLabel.offset
            );
        }
    }

    drawHours() {
        let date, label, metrics;

        // this.ctx.strokeStyle = 'white';
        // this.ctx.strokeRect(this.hoursRect.l, this.hoursRect.t, this.hoursRect.w, this.hoursRect.h);

        this.ctx.fillStyle = 'white';

        date = new Date(this.startDate);

        for (let i = 0; i < this.range; i ++) {
            label = DateService.format(date, '%g:00%a').slice(0, -1);
            metrics = this.ctx.measureText(label);

            // this.ctx.strokeStyle = 'white';
            // this.ctx.strokeRect(
            //     this.hoursRect.l,
            //     this.hoursRect.t + i * SessionGraph.TimeLabel.y,
            //     this.hoursRect.w,
            //     SessionGraph.TimeLabel.y
            // );

            this.ctx.fillText(
                label,
                this.hoursRect.l + SessionGraph.TimeLabel.x - metrics.width - SessionGraph.LabelMargin,
                this.hoursRect.t + i * SessionGraph.TimeLabel.y + SessionGraph.TimeLabel.offset
            );

            date = new Date(date.getTime() + 60 * 60 * 1000);
        }
    }

    drawRules() {
        let i, x, y;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;

        for (i = 0; i < this.range; i ++) {
            y = (i + 0.5) * SessionGraph.TimeLabel.y + SessionGraph.Offset.y + SessionGraph.OunceLabel.y + SessionGraph.AxisLabel.x;

            this.ctx.moveTo(SessionGraph.TimeLabel.x + SessionGraph.Offset.x, y);
            this.ctx.lineTo(this.width - SessionGraph.Offset.x, y);
        }

        for (i = 0; i < this.maxOunces + 1; i ++) {
            x = i * this.ounceWidth + SessionGraph.TimeLabel.x + SessionGraph.Offset.x;
            y = SessionGraph.Offset.y + SessionGraph.OunceLabel.y + SessionGraph.AxisLabel.x;

            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, this.height - SessionGraph.Offset.y);
        }

        this.ctx.strokeStyle = SessionGraph.RuleColor;
        this.ctx.stroke();
    }

    drawHistory() {
        const {history} = this.props;
        let x, y, i, date, delta, minutes;

        minutes = this.startDate.getMinutes() / 60;

        y = (0.5 + minutes) * SessionGraph.TimeLabel.y + SessionGraph.OunceLabel.y + SessionGraph.Offset.y + SessionGraph.AxisLabel.x;
        x = SessionGraph.TimeLabel.x + SessionGraph.Offset.x;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        for (i = 0; i < history.length; i ++) {
            date = new Date(history[i].date);
            delta = (date - this.startDate) / 60 / 60 / 1000;

            y = (delta + minutes + 0.5) * SessionGraph.TimeLabel.y + SessionGraph.OunceLabel.y + SessionGraph.Offset.y + SessionGraph.AxisLabel.x;
            x = history[i].alcohol * this.ounceWidth + SessionGraph.TimeLabel.x + SessionGraph.Offset.x;

            this.ctx.lineTo(x, y);
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = SessionGraph.HistoryLineColor;
        this.ctx.stroke();

        this.ctx.fillStyle = SessionGraph.HistoryNodeColor;

        for (i = 0; i < history.length; i ++) {
            date = new Date(history[i].date);
            delta = (date - this.startDate) / 60 / 60 / 1000;

            y = (delta + minutes + 0.5) * SessionGraph.TimeLabel.y + SessionGraph.OunceLabel.y + SessionGraph.Offset.y + SessionGraph.AxisLabel.x;
            x = history[i].alcohol * this.ounceWidth + SessionGraph.TimeLabel.x + SessionGraph.Offset.x;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.fill(this.nodePath);
            this.ctx.restore();
        }
    }
    
    render() {
        const {session} = this.props;
        const title = DateService.format(new Date(session.start), '%l, %F %j, %Y - %g:%i %a');

        return <div className="SessionGraph">
            <div className="SessionGraphTitle">{title}</div>
            <canvas ref={this.ref}
                    width={this.width}
                    height={this.height}
            />
        </div>;
    }
}