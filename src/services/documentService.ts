import {InstrumentModel} from '../models';

export class DocumentService {
  static updateDocumentTitle = (instrument: InstrumentModel) => {
    document.title = `${instrument.price} ${
      instrument.displayName
    } – Lykke Trade`;
  };
}
