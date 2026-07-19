export async function forceDownload(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // free memory shortly after the browser has started the save
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  } catch {
    // fallback: if fetch fails (e.g. CORS), just open the file directly
    window.open(url, '_blank');
  }
}
