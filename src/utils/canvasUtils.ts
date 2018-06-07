interface RectInterface {
  ctx: any;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}

interface LineInterface {
  ctx: any;
  x: number;
  y: number;
  width: number;
  opacity?: number;
  color: string;
  lineWidth: number;
}

interface TextInterface {
  ctx: any;
  color: string;
  text: string | number;
  x: number;
  y: number;
  font: string;
  align: string;
  opacity?: number;
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
  lineWidth
}: LineInterface) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = opacity;
  ctx.beginPath();
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
  lineCap
}: any) => {
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, height);
  ctx.stroke();
};

export const drawText = ({
  ctx,
  color,
  text,
  x,
  y,
  font,
  align,
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
