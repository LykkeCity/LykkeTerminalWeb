const ctx = document.createElement('canvas').getContext('2d');

export const measureText = (text: string, size: number, font: string) => {
  ctx!.font = `${size}px ${font}`;
  return Math.ceil(ctx!.measureText(text).width);
};
