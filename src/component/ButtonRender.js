import React, {Component} from "react";

export default class ButtonRender extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.round = 5;
    }

    componentDidMount() {
        this.cnv = this.ref.current;
        this.cnv.width = 90;
        this.cnv.height = 90;
        this.ctx = this.cnv.getContext('2d');

        this.drawHamburger(0, 0, '#afafaf');
        this.drawHamburger(30, 0, 'white');
        this.drawHamburger(60, 0, 'white', '#5f5f5f');

        this.drawBack(0, 30, '#afafaf');
        this.drawBack(30, 30, 'white');
        this.drawBack(60, 30, 'white', '#5f5f5f');

        this.drawForward(0, 60, '#afafaf');
        this.drawForward(30, 60, 'white');
        this.drawForward(60, 60, 'white', '#5f5f5f');
    }

    fillButton(x, y, fill) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.round, y);
        this.ctx.lineTo( x + 30 - this.round, y);
        this.ctx.arc(x + 30 - this.round, y + this.round, this.round, Math.PI * 1.5, Math.PI * 2);
        this.ctx.lineTo( x + 30, y + 30 - this.round);
        this.ctx.arc(x + 30 - this.round, y + 30 - this.round, this.round, 0, Math.PI * 0.5);
        this.ctx.lineTo(x + this.round, y + 30);
        this.ctx.arc(x + this.round, y + 30 - this.round, this.round, Math.PI * 0.5, Math.PI);
        this.ctx.lineTo(x, y + this.round);
        this.ctx.arc(x + this.round, y + this.round, this.round, Math.PI, Math.PI * 1.5);
        this.ctx.closePath();

        this.ctx.fillStyle = fill;
        this.ctx.fill();
    }

    drawHamburger(x, y, stroke, fill) {
        const margin = {x:5, y:5.5};
        const thick = 5;
        const spacing = 9;

        if (fill) {
            this.fillButton(x, y, fill);
        }

        this.ctx.lineWidth = thick;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();

        this.ctx.moveTo(x + margin.x, y + margin.y);
        this.ctx.lineTo(x + 30 - margin.x, y + margin.y);

        this.ctx.moveTo(x + margin.x, y + margin.y + spacing);
        this.ctx.lineTo(x + 30 - margin.x, y + margin.y + spacing);

        this.ctx.moveTo(x + margin.x, y + margin.y + spacing * 2);
        this.ctx.lineTo(x + 30 - margin.x, y + margin.y + spacing * 2);

        this.ctx.strokeStyle = stroke;
        this.ctx.stroke();
    }

    drawBack(x, y, stroke, fill) {
        const thick = 5;

        if (fill) {
            this.fillButton(x, y, fill);
        }

        this.ctx.lineWidth = thick;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();

        this.ctx.moveTo(x + 20, y + 5);
        this.ctx.lineTo( x + 10, y + 15);
        this.ctx.lineTo(x + 20, y + 25);

        this.ctx.strokeStyle = stroke;
        this.ctx.stroke();
    }

    drawForward(x, y, stroke, fill) {
        const thick = 5;

        if (fill) {
            this.fillButton(x, y, fill);
        }

        this.ctx.lineWidth = thick;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();

        this.ctx.moveTo(x + 10, y + 5);
        this.ctx.lineTo( x + 20, y + 15);
        this.ctx.lineTo(x + 10, y + 25);

        this.ctx.strokeStyle = stroke;
        this.ctx.stroke();
    }

    render() {
        return <canvas ref={this.ref} style={{position:'absolute',right:'0',top:'0'}} />;
    }
}