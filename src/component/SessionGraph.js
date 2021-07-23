import DateService from "../phoneApp/service/date";

import './SessionGraph.css';
import {useEffect, useRef} from 'react';

const Offset = {x: 20, y: 0};
const AxisLabel = {x: 25, offset: 12};
const TimeLabel = {x: 60, y: 30, offset: 20};
const OunceLabel = {x: 0, y: 20, offset: 12};
const LabelMargin = 10;
const RuleColor = 'rgba(255, 255, 255, 0.5)';
const HistoryLineColor = 'white';
const HistoryNodeColor = 'yellow';

function getRange(startDate, endDate) {
  let start = new Date(startDate);
  start.setMinutes(0);
  start.setSeconds(0);

  let range = 0;

  while (start < endDate) {
    start.setHours(start.getHours() + 1);
    range++;
  }

  return range + 1;
}

export default function SessionGraph({session, history}) {
  const canvasRef = useRef(null);
  const title = DateService.format(new Date(session.start), '%l, %F %j, %Y - %g:%i %a');

  const startDate = new Date(history[0].date);
  const endDate = new Date(history[history.length - 1].date);
  const range = getRange(startDate, endDate);
  const width = window.innerWidth;
  const height = range * TimeLabel.y +
    OunceLabel.y +
    Offset.y * 2 +
    AxisLabel.x;

  const maxOunces = Math.ceil(history[history.length - 1].alcohol);
  const ounceWidth = (width - TimeLabel.x - Offset.x * 2) / maxOunces;

  const axisRect = {
    l: 0,
    t: Offset.y,
    w: width,
    h: AxisLabel.x
  };

  const ouncesRect = {
    l: TimeLabel.x + Offset.x,
    t: AxisLabel.x + Offset.y,
    w: width - (TimeLabel.x + Offset.x * 2),
    h: OunceLabel.y
  };

  const hoursRect = {
    l: Offset.x,
    t: OunceLabel.y + AxisLabel.x + Offset.y,
    w: TimeLabel.x,
    h: range * TimeLabel.y
  };

  const nodePath = new Path2D();
  nodePath.arc(0, 0, 5, 0, Math.PI * 2);
  nodePath.closePath();

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    draw(context);
  })

  function drawAxis(ctx) {
    const label = 'Alcohol (fl oz)';
    const metrics = ctx.measureText(label);
    const x = (axisRect.w - metrics.width) * 0.5;
    const y = axisRect.t + AxisLabel.offset;

    ctx.fillStyle = 'white';
    ctx.fillText(label, x, y);
  }

  function drawOunces(ctx) {
    let x, metrics;

    ctx.fillStyle = 'white';

    for (let i = 0; i < maxOunces + 1; i ++) {
      x = ouncesRect.l + i * ounceWidth;
      metrics = ctx.measureText(i.toString());

      ctx.fillText(
        i.toString(),
        x - metrics.width * 0.5,
        ouncesRect.t + OunceLabel.offset
      );
    }
  }

  function drawHours(ctx) {
    let date, label, metrics;

    ctx.fillStyle = 'white';

    date = new Date(startDate);

    for (let i = 0; i < range; i ++) {
      label = DateService.format(date, '%g:00%a').slice(0, -1);
      metrics = ctx.measureText(label);

      ctx.fillText(
        label,
        hoursRect.l + TimeLabel.x - metrics.width - LabelMargin,
        hoursRect.t + i * TimeLabel.y + TimeLabel.offset
      );

      date = new Date(date.getTime() + 60 * 60 * 1000);
    }
  }

  function drawRules(ctx) {
    let i, x, y;

    ctx.beginPath();
    ctx.lineWidth = 1;

    for (i = 0; i < range; i ++) {
      y = (i + 0.5) * TimeLabel.y + Offset.y + OunceLabel.y + AxisLabel.x;

      ctx.moveTo(TimeLabel.x + Offset.x, y);
      ctx.lineTo(width - Offset.x, y);
    }

    for (i = 0; i < maxOunces + 1; i ++) {
      x = i * ounceWidth + TimeLabel.x + Offset.x;
      y = Offset.y + OunceLabel.y + AxisLabel.x;

      ctx.moveTo(x, y);
      ctx.lineTo(x, height - Offset.y);
    }

    ctx.strokeStyle = RuleColor;
    ctx.stroke();
  }

  function drawHistory(ctx) {
    let x, y, i, minutes;

    minutes = startDate.getMinutes() / 60;

    y = (0.5 + minutes) * TimeLabel.y + OunceLabel.y + Offset.y + AxisLabel.x;
    x = TimeLabel.x + Offset.x;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (i = 0; i < history.length; i ++) {
      let {x, y} = getXYFromData(history[i], minutes);
      ctx.lineTo(x, y);
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = HistoryLineColor;
    ctx.stroke();

    ctx.fillStyle = HistoryNodeColor;

    for (i = 0; i < history.length; i ++) {
      let {x, y} = getXYFromData(history[i], minutes);

      ctx.save();
      ctx.translate(x, y);
      ctx.fill(nodePath);
      ctx.restore();
    }

  }

  function getXYFromData(historyPoint, minutes) {
    const date = new Date(historyPoint.date);
    const delta = (date - startDate) / 60 / 60 / 1000;

    const y = (delta + minutes + 0.5) * TimeLabel.y + OunceLabel.y + Offset.y + AxisLabel.x;
    const x = historyPoint.alcohol * ounceWidth + TimeLabel.x + Offset.x;
    return {x, y};
  }

  function clear(ctx) {
    ctx.clearRect(0, 0, width, height)
  }

  function draw(ctx) {
    clear(ctx);
    drawAxis(ctx);
    drawOunces(ctx);
    drawHours(ctx);
    drawRules(ctx);
    drawHistory(ctx);
  }

  return (
    <div className="SessionGraph">
      <div className="SessionGraphTitle">{title}</div>
      <canvas ref={canvasRef}
              width={width}
              height={height}
      />
    </div>
  );
};
