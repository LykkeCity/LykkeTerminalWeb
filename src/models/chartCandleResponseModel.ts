class ChartCandleResponseModel {
  High: number;
  Low: number;
  Open: number;
  Close: number;
  Volume: number;
  OppositeVolume: number;
  DateTime: string;
  AbsoluteChange?: number;
  PercentChange?: number;
  Dividend?: string;
  Split?: string;
}

export default ChartCandleResponseModel;
