const extension = '.csv';

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

const downloadFile = (url: string, filename: string) => {
  downloadLink.href = url;
  downloadLink.target = '_blank';
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
};

const saveFile = async (fetchHistory: () => Promise<any>) => {
  const url = await fetchHistory();
  const filename = generateName();
  downloadFile(url, filename);
};

export default saveFile;
