import chart, {
  MESH_LINES_OPACITY,
  POINTER_OPACITY,
  POPUP_ALIGN
} from '../../../constants/chartConstants';
import {DepthArea, DepthText, Order, Side} from '../../../models';
import {colors} from '../../styled';
import {
  drawChartElements,
  drawMeshElements,
  generatePoints,
  getCurrentArea,
  getDepthText,
  getPopupCoords,
  getTextXCoords,
  getTextYCoords,
  getXCoords,
  getYCoords,
  IChartDrawingTools,
  IMeshDrawingTools,
  updatePointsForDrawing
} from './chartHelpers';

describe('chart helpers', () => {
  describe('coordinates', () => {
    describe('popup coordinates', () => {
      it('should return sum of y and popup height', () => {
        const y = 100;
        const midY = 30;
        const result = getYCoords(y, midY);
        expect(result).toBe(180);
      });

      it('should return diff of y and popup height', () => {
        const y = 300;
        const midY = 30;
        const result = getYCoords(y, midY);
        expect(result).toBe(220);
      });

      it('should return value for bid area in the first half', () => {
        const area = DepthArea.Bid;
        const x = 100;
        const textWidth = 100;
        const midX = 300;
        const result = getXCoords(textWidth, x, area, midX);
        expect(result).toBe(220);
      });

      it('should return value for bid area in the second half', () => {
        const area = DepthArea.Bid;
        const x = 200;
        const textWidth = 10;
        const midX = 300;
        const result = getXCoords(textWidth, x, area, midX);
        expect(result).toBe(170);
      });

      it('should return value for ask area in the first half', () => {
        const area = DepthArea.Ask;
        const x = 100;
        const textWidth = 100;
        const midX = 300;
        const result = getXCoords(textWidth, x, area, midX);
        expect(result).toBe(220);
      });

      it('should return value for ask area in the second half', () => {
        const area = DepthArea.Ask;
        const x = 200;
        const textWidth = 10;
        const midX = 300;
        const result = getXCoords(textWidth, x, area, midX);
        expect(result).toBe(230);
      });

      it('should return popup coordinates', () => {
        const x = 100;
        const y = 100;
        const textWidth = 100;
        const area = DepthArea.Bid;
        const midX = 500;
        const midY = 300;
        const points = getPopupCoords(x, y, textWidth, area, midX, midY);

        expect(points[0].x).toBe(x);
        expect(points[0].y).toBe(y);

        expect(points[1].x).toBe(x);
        expect(points[1].y).toBe(180);

        expect(points[2].x).toBe(220);
        expect(points[2].y).toBe(180);

        expect(points[3].x).toBe(220);
        expect(points[3].y).toBe(y);
      });
    });

    describe('text coordinates', () => {
      it('should return y', () => {
        const y = 300;
        const midY = 30;
        const result = getTextYCoords(y, midY);
        expect(result).toBe(y);
      });

      it('should return sum of y and popup height', () => {
        const y = 100;
        const midY = 30;
        const result = getTextYCoords(y, midY);
        expect(result).toBe(180);
      });

      it('should return value for point in the bid 1st half area', () => {
        const x = 100;
        const textWidth = 200;
        const midX = 300;
        const endXPoint = 250;
        const area = DepthArea.Bid;
        const result = getTextXCoords(x, textWidth, endXPoint, area, midX);
        expect(result).toBe(110);
      });

      it('should return value for point in the bid 2st half area', () => {
        const x = 400;
        const textWidth = 200;
        const midX = 300;
        const endXPoint = 250;
        const area = DepthArea.Bid;
        const result = getTextXCoords(x, textWidth, endXPoint, area, midX);
        expect(result).toBe(140);
      });

      it('should return value for point in the ask 1st half area', () => {
        const x = 100;
        const textWidth = 200;
        const midX = 300;
        const endXPoint = 250;
        const area = DepthArea.Ask;
        const result = getTextXCoords(x, textWidth, endXPoint, area, midX);
        expect(result).toBe(110);
      });

      it('should return value for point in the ask 2st half area', () => {
        const x = 400;
        const textWidth = 200;
        const midX = 300;
        const endXPoint = 250;
        const area = DepthArea.Ask;
        const result = getTextXCoords(x, textWidth, endXPoint, area, midX);
        expect(result).toBe(410);
      });
    });

    describe('area', () => {
      it('should return ask area', () => {
        const x = 100;
        const midX = 50;
        expect(getCurrentArea(x, midX)).toBe(DepthArea.Ask);
      });

      it('should return bid area', () => {
        const x = 100;
        const midX = 150;
        expect(getCurrentArea(x, midX)).toBe(DepthArea.Bid);
      });
    });

    describe('text for popup', () => {
      it('should return text for bid area', () => {
        const area = DepthArea.Bid;
        expect(getDepthText(area)).toBe(DepthText.CanBeSold);
      });

      it('should return text for ask area', () => {
        const area = DepthArea.Ask;
        expect(getDepthText(area)).toBe(DepthText.CanBeBought);
      });
    });

    describe('area points', () => {
      const orders: Order[] = [];

      beforeEach(() => {
        orders.push(
          Order.create({
            id: '1',
            volume: 100,
            price: 100,
            timestamp: new Date(),
            side: Side.Sell,
            depth: 2,
            orderVolume: 100
          }),
          Order.create({
            id: '2',
            volume: 200,
            price: 200,
            timestamp: new Date(),
            side: Side.Buy,
            depth: 4,
            orderVolume: 200
          }),
          Order.create({
            id: '3',
            volume: 300,
            price: 300,
            timestamp: new Date(),
            side: Side.Buy,
            depth: 4,
            orderVolume: 300
          })
        );
      });

      it('should generate points for bid area', () => {
        const midX = 500;
        const height = 300;
        const area = DepthArea.Bid;
        const calculateStepLength = (index: number) => index + 1;
        const calculateStepHeight = (depth: number) => depth + 1;

        const result = generatePoints(
          midX,
          height,
          orders,
          area,
          calculateStepLength,
          calculateStepHeight
        );

        expect(result[0].x).toBe(midX);
        expect(result[0].y).toBe(height);

        expect(result[1].x).toBe(midX);
        expect(result[1].y).toBe(297);

        expect(result[2].x).toBe(499);
        expect(result[2].y).toBe(297);

        expect(result[3].x).toBe(499);
        expect(result[3].y).toBe(295);
      });

      it('should generate points for ask area', () => {
        const midX = 500;
        const height = 300;
        const area = DepthArea.Ask;
        const calculateStepLength = (index: number) => index + 1;
        const calculateStepHeight = (depth: number) => depth + 1;

        const result = generatePoints(
          midX,
          height,
          orders,
          area,
          calculateStepLength,
          calculateStepHeight
        );

        expect(result[0].x).toBe(midX);
        expect(result[0].y).toBe(height);

        expect(result[1].x).toBe(midX);
        expect(result[1].y).toBe(297);

        expect(result[2].x).toBe(501);
        expect(result[2].y).toBe(297);

        expect(result[3].x).toBe(501);
        expect(result[3].y).toBe(295);
      });

      it('should updated points with color and additional points', () => {
        const midX = 500;
        const height = 300;
        const area = DepthArea.Ask;
        const calculateStepLength = (index: number) => index + 1;
        const calculateStepHeight = (depth: number) => depth + 1;
        const color = colors.white;
        const additionalPoints = [{x: 0, y: 0}];

        const points = generatePoints(
          midX,
          height,
          orders,
          area,
          calculateStepLength,
          calculateStepHeight
        );

        const result = updatePointsForDrawing(points, color, additionalPoints);
        expect(result[0].color).toBe(color);
        expect(result[result.length - 1].x).toBe(additionalPoints[0].x);
        expect(result[result.length - 1].y).toBe(additionalPoints[0].y);
      });
    });

    describe('drawing tools', () => {
      describe('mesh drawing tools', () => {
        let drawingMeshTools: IMeshDrawingTools;
        let context: CanvasRenderingContext2D;

        beforeEach(() => {
          context = document
            .createElement('canvas')
            .getContext('2d') as CanvasRenderingContext2D;
          drawingMeshTools = drawMeshElements(context);
        });

        it('should fill context with drawHorizontalLine options', () => {
          drawingMeshTools.drawHorizontalLine(1, 2);
          expect(Math.round(context.globalAlpha * 100) / 100).toBe(
            MESH_LINES_OPACITY
          );
          expect(context.strokeStyle).toBe(chart.mesh.color);
          expect(context.lineWidth).toBe(chart.mesh.strokeWidth);

          const dashes = context.getLineDash();
          dashes.forEach((dash: number, index: number) => {
            expect(dash).toBe(chart.mesh.dash[index]);
          });
        });

        it('should fill context with drawVerticalLine options', () => {
          drawingMeshTools.drawVerticalLine(1, 2);
          expect(context.strokeStyle).toBe(chart.mesh.color);
          expect(Math.round(context.globalAlpha * 100) / 100).toBe(
            MESH_LINES_OPACITY
          );
          expect(context.lineWidth).toBe(chart.mesh.strokeWidth);

          const dashes = context.getLineDash();
          dashes.forEach((dash: number, index: number) => {
            expect(dash).toBe(chart.mesh.dots[index]);
          });
        });

        it('should fill context with drawMid options', () => {
          drawingMeshTools.drawMid(1, 2);
          expect(Math.round(context.globalAlpha * 100) / 100).toBe(
            MESH_LINES_OPACITY
          );
          expect(context.strokeStyle).toBe(chart.mesh.color);
          expect(context.lineWidth).toBe(chart.mesh.strokeWidth);
        });

        it('should fill context with drawLabel options', () => {
          const text = 'label';
          const font = '12px sans-serif';
          drawingMeshTools.drawLabel(text, 1, 1, font);
          expect(context.font).toBe(font);
          expect(context.fillStyle).toBe(chart.mesh.color);
          expect(context.globalAlpha).toBe(1);
          expect(context.textAlign).toBe('center');
        });
      });

      describe('chart drawing tools', () => {
        let drawingChartTools: IChartDrawingTools;
        let context: CanvasRenderingContext2D;

        beforeEach(() => {
          context = document
            .createElement('canvas')
            .getContext('2d') as CanvasRenderingContext2D;
          drawingChartTools = drawChartElements(context, () => DepthArea.Ask);
        });

        it('should fill context with drawPointer options', () => {
          drawingChartTools.drawPointer(1, 1);
          expect(context.lineWidth).toBe(1);
          expect(context.fillStyle).toBe(chart.asks.lineColor);
          expect(context.strokeStyle).toBe(chart.pointer.circleStrokeColor);
        });

        it('should fill context with drawLevel options', () => {
          drawingChartTools.drawLevel(
            [{x: 1, y: 1}, {x: 2, y: 2}],
            colors.green
          );
          expect(Math.round(context.globalAlpha * 100) / 100).toBe(1);
          expect(context.lineWidth).toBe(chart.strokeWidth);
          expect(context.fillStyle).toBe(colors.green);
        });

        it('should fill context with drawPointerLine', () => {
          drawingChartTools.drawPointerLine(1, 1, 1);
          expect(context.strokeStyle).toBe(chart.asks.lineColor);
          expect(Math.round(context.globalAlpha * 100) / 100).toBe(
            POINTER_OPACITY
          );
          expect(context.lineWidth).toBe(chart.mesh.strokeWidth);

          const dashes = context.getLineDash();
          dashes.forEach((dash: number, index: number) => {
            expect(dash).toBe(chart.pointer.dash[index]);
          });
        });

        it('should fill context with drawPopup options', () => {
          drawingChartTools.drawPopup([{x: 1, y: 1}, {x: 2, y: 2}]);
          expect(context.lineWidth).toBe(chart.modal.strokeWidth);
          expect(context.fillStyle).toBe(chart.modal.fillColor);
        });

        it('should fill context with drawText options', () => {
          const fontSize = 12;
          drawingChartTools.drawText(1, 2, DepthArea.Ask, 1, 1, 1)(
            1,
            'text',
            colors.green,
            fontSize,
            10
          );

          expect(context.font).toBe(
            `bold ${fontSize}px ${chart.modal.label.fontFamily}`
          );
          expect(context.fillStyle).toBe(colors.green);
          expect(context.textAlign).toBe(POPUP_ALIGN);
        });
      });
    });
  });
});
