import {drawLine, drawRect, drawText, drawVerticalLine} from '../canvasUtils';

describe(' canvas utils', () => {
  let context: any;

  beforeEach(() => {
    context = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      fillRect: jest.fn(),
      fillText: jest.fn()
    };
  });

  const color = '#fff';
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
});
