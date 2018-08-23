import {IPoint} from '../components/DepthChart/helpers/chartHelpers';

interface RectInterface {
  ctx: CanvasRenderingContext2D;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}

interface LineInterface {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  opacity?: number;
  color: string;
  lineWidth: number;
  dashSegments?: number[];
}

interface VerticalLineInterface {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  height: number;
  lineWidth: number;
  color: string;
  lineCap?: string;
  opacity?: number;
  dashSegments?: number[];
}

interface TextInterface {
  ctx: CanvasRenderingContext2D;
  color: string;
  text: string;
  x: number;
  y: number;
  font: string;
  align?: string;
  opacity?: number;
}

interface CircleInterface {
  ctx: CanvasRenderingContext2D;
  radius: number;
  color: string;
  x: number;
  y: number;
  lineWidth: number;
  lineColor: string;
}

interface AreaInterface {
  ctx: CanvasRenderingContext2D;
  points: IPoint[];
  lineWidth: number;
  lineCap?: string;
  opacity?: number;
  dashSegments?: number[];
  fill: string;
}

export const drawRect = ({
  ctx,
  color,
  x,
  y,
  width,
  height,
  opacity = 1
}: RectInterface) => {
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.fillRect(x, y, width, height);
};

export const drawLine = ({
  ctx,
  x,
  y,
  width,
  opacity = 1,
  color,
  lineWidth,
  dashSegments = []
}: LineInterface) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.setLineDash(dashSegments);
  ctx.moveTo(x, y);
  ctx.lineTo(width, y);
  ctx.stroke();
};

export const drawVerticalLine = ({
  ctx,
  x,
  y,
  height,
  lineWidth,
  color,
  lineCap = '',
  opacity = 1,
  dashSegments = []
}: VerticalLineInterface) => {
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.beginPath();
  ctx.setLineDash(dashSegments);

  ctx.moveTo(x, y);
  ctx.lineTo(x, height);
  ctx.stroke();
};

export const drawArea = ({
  ctx,
  points,
  lineWidth,
  lineCap = '',
  opacity = 1,
  dashSegments = [],
  fill
}: AreaInterface) => {
  ctx.globalAlpha = opacity;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.beginPath();
  ctx.setLineDash(dashSegments);
  ctx.moveTo(points[0].x, points[0].y);

  points.forEach((point, i: number) => {
    if (i !== 0) {
      ctx.strokeStyle = point.color || 'transparent';
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  });

  ctx.fillStyle = fill;
  ctx.fill();
  ctx.closePath();
};

export const drawCircle = ({
  ctx,
  radius,
  color,
  x,
  y,
  lineWidth,
  lineColor
}: CircleInterface) => {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
};

export const drawText = ({
  ctx,
  color,
  text,
  x,
  y,
  font,
  align = 'center',
  opacity = 1
}: TextInterface) => {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

export const defineCanvasScale = (
  ctx: any,
  canvas: any,
  oldWidth: number,
  oldHeight: number
) => {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  const ratio = devicePixelRatio / backingStoreRatio;
  let auto = true;
  if (typeof auto === 'undefined') {
    auto = true;
  }

  if (auto && devicePixelRatio !== backingStoreRatio) {
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    ctx.scale(ratio, ratio);
  }
};
