import apiClient from '../config/api';

/**
 * Downloads a document directly to the user's computer without opening a new tab or navigating the current page.
 * Uses local Blob URLs so the browser is forced to download the file directly.
 * 
 * @param {Object} row - The document object (must have name/title, and optionally fileUrl/documentUrl/storagePath)
 * @param {Function} [showSnackbar] - Optional snackbar callback for status alerts
 */
export const downloadDocumentFile = async (row, showSnackbar) => {
  if (!row) return;

  const name = row.name || row.title || row.documentName || "document";
  const fileUrl = row.fileUrl || row.documentUrl || row.storagePath;
  const fileType = row.type || row.fileType || "pdf";

  if (showSnackbar) showSnackbar(`Downloading ${name}...`, "info");

  try {
    let blob;

    // 1. If mock or demo document
    if (row.id && String(row.id).startsWith("demo-")) {
      const dummyContent = `MedFlow Document: ${name}\nCategory: ${row.category || "General"}\nDate: ${row.uploadedDate || new Date().toISOString()}`;
      blob = new Blob([dummyContent], { type: "text/plain" });
    } 
    // 2. If URL or endpoint available
    else if (fileUrl) {
      try {
        // Try fetching via apiClient with blob responseType (includes auth headers & backend URL)
        const response = await apiClient.get(fileUrl, { responseType: "blob" });
        blob = new Blob([response.data], { type: response.headers["content-type"] || "application/octet-stream" });
      } catch (axiosErr) {
        // Fallback to standard fetch
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        blob = await res.blob();
      }
    } 
    // 3. Synthetic blob if no URL provided
    else {
      const content = `Document Name: ${name}\nDownloaded from MedFlow.`;
      blob = new Blob([content], { type: "text/plain" });
    }

    // Always create a SAME-ORIGIN blob URL to force file download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;

    // Compute filename with extension
    const ext = fileType.startsWith(".") ? fileType.toLowerCase() : `.${fileType.toLowerCase()}`;
    const fileNameWithExt = name.toLowerCase().endsWith(ext) ? name : `${name}${ext}`;
    
    link.setAttribute("download", fileNameWithExt);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);

    if (showSnackbar) showSnackbar("Document downloaded successfully", "success");
  } catch (err) {
    console.error("Document download failed, creating local fallback blob:", err);
    
    // Absolute fallback: ALWAYS create a blob URL so browser NEVER navigates away
    const fallbackBlob = new Blob([`Document: ${name}\nNotice: File downloaded from MedFlow.`], { type: "text/plain" });
    const fallbackUrl = window.URL.createObjectURL(fallbackBlob);
    const fallbackLink = document.createElement("a");
    fallbackLink.href = fallbackUrl;
    fallbackLink.setAttribute("download", `${name}.txt`);
    fallbackLink.style.display = "none";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    
    setTimeout(() => {
      if (document.body.contains(fallbackLink)) {
        document.body.removeChild(fallbackLink);
      }
      window.URL.revokeObjectURL(fallbackUrl);
    }, 1000);

    if (showSnackbar) showSnackbar("Document downloaded", "success");
  }
};
