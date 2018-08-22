const saveFile = async (fetchFileUrl: () => Promise<string>) => {
  const url = await fetchFileUrl();
  if (url) {
    window.location.replace(url);
  }
};

export default saveFile;
