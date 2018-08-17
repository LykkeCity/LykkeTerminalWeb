const saveFile = async (fetchFileUrl: () => Promise<string>) => {
  const url = await fetchFileUrl();
  window.location.replace(url);
};

export default saveFile;
