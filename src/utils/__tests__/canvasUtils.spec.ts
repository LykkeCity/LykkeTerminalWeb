import {
  drawArea,
  drawCircle,
  drawLine,
  drawRect,
  drawText,
  drawVerticalLine
} from '../canvasUtils';

describe(' canvas utils', () => {
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    context = document
      .createElement('canvas')
      .getContext('2d') as CanvasRenderingContext2D;
  });

  const color = '#ffffff';
  const x = 100;
  const y = 100;
  const width = 100;
  const height = 100;
  const opacity = 0.5;
  const lineWidth = 1;
  const lineCap = 'round';
  const text = 'some text';
  const font = '10px sans-serif';
  const align = 'center';

  it('should fill context with property for rect', () => {
    context.fillRect = jest.fn();
    drawRect({
      ctx: context,
      color,
      x,
      y,
      width,
      height,
      opacity
    });

    expect(context.fillStyle).toBe(color);
    expect(context.globalAlpha).toBe(opacity);
    expect(context.fillRect).toHaveBeenCalledWith(x, y, width, height);
  });

  it('should fill context with property for line', () => {
    context.beginPath = jest.fn();
    context.moveTo = jest.fn();
    context.lineTo = jest.fn();
    context.stroke = jest.fn();

    drawLine({
      ctx: context,
      x,
      y,
      width,
      opacity,
      color,
      lineWidth
    });

    expect(context.strokeStyle).toBe(color);
    expect(context.globalAlpha).toBe(opacity);
    expect(context.lineWidth).toBe(lineWidth);
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalledWith(x, y);
    expect(context.lineTo).toHaveBeenCalledWith(width, y);
    expect(context.stroke).toHaveBeenCalled();
  });

  it('should fill context with property for vertical line', () => {
    context.beginPath = jest.fn();
    context.moveTo = jest.fn();
    context.lineTo = jest.fn();
    context.stroke = jest.fn();

    drawVerticalLine({
      ctx: context,
      x,
      y,
      height,
      lineWidth,
      color,
      lineCap
    });

    expect(context.strokeStyle).toBe(color);
    expect(context.globalAlpha).toBe(1);
    expect(context.lineWidth).toBe(lineWidth);
    expect(context.lineCap).toBe(lineCap);
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalledWith(x, y);
    expect(context.lineTo).toHaveBeenCalledWith(x, height);
    expect(context.stroke).toHaveBeenCalled();
  });

  it('should fill context with property for text', () => {
    context.fillText = jest.fn();

    drawText({
      ctx: context,
      color,
      text,
      x,
      y,
      font,
      align,
      opacity
    });

    expect(context.font).toBe(font);
    expect(context.globalAlpha).toBe(opacity);
    expect(context.fillStyle).toBe(color);
    expect(context.textAlign).toBe(align);
    expect(context.fillText).toHaveBeenCalledWith(text, x, y);
  });

  it('should fill context with property for circle', () => {
    context.arc = jest.fn();
    context.beginPath = jest.fn();
    context.stroke = jest.fn();
    context.fill = jest.fn();

    const radius = 5;
    drawCircle({
      ctx: context,
      radius,
      color,
      x,
      y,
      lineWidth,
      lineColor: 'black'
    });

    expect(context.lineWidth).toBe(lineWidth);
    expect(context.strokeStyle).toBe('black');
    expect(context.fillStyle).toBe(color);
    expect(context.arc).toHaveBeenCalledWith(x, y, radius, 0, 2 * Math.PI);
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.stroke).toHaveBeenCalled();
    expect(context.fill).toHaveBeenCalled();
  });

  it('should fill context with property for area', () => {
    context.setLineDash = jest.fn();
    context.beginPath = jest.fn();
    context.stroke = jest.fn();
    context.fill = jest.fn();
    context.closePath = jest.fn();

    const points = [
      {
        x: 1,
        y: 1
      },
      {
        x: 5,
        y: 5
      }
    ];
    drawArea({
      ctx: context,
      points,
      fill: color,
      lineWidth
    });

    expect(context.lineWidth).toBe(lineWidth);
    expect(context.fillStyle).toBe(color);
    expect(context.globalAlpha).toBe(1);
    expect(context.setLineDash).toHaveBeenCalledWith([]);
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.closePath).toHaveBeenCalled();
    expect(context.fill).toHaveBeenCalled();
    expect(context.stroke).toHaveBeenCalled();
  });
});
