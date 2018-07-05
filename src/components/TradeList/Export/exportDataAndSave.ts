import {HistoryResponseModel} from '../../../models';
import {historyToCsv} from '../../../models/mappers/historyToCsv';

const extension = '.csv';
const documentType = 'text/csv;charset=utf-8;';

const downloadLink = document.createElement('a');
downloadLink.style.display = 'none';
downloadLink.target = '_blank';
downloadLink.onclick = (event: MouseEvent) => {
  document.body.removeChild(event.target as Node);
};

const generateName = (): string => {
  const id = new Date().getTime();
  return `trades-${id}${extension}`;
};

const downloadFile = (objectUrl: string, filename: string) => {
  downloadLink.download = filename;
  downloadLink.href = objectUrl;
  document.body.appendChild(downloadLink);
  downloadLink.click();
};

const saveFile = async (
  fetchHistory: () => Promise<HistoryResponseModel[]>
) => {
  const rawHistory = await fetchHistory();
  const filename = generateName();
  const dataToSave = new Blob([historyToCsv(rawHistory)], {type: documentType});
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(dataToSave, filename);
  } else {
    const objectUrl = window.URL.createObjectURL(dataToSave);
    downloadFile(objectUrl, filename);
  }
};

export default saveFile;
