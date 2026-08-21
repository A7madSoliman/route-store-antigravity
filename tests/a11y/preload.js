const originalFetch = globalThis.fetch;

globalThis.fetch = function (url, options) {
  let urlStr = typeof url === "string" ? url : url.toString();
  if (urlStr.startsWith("https://ecommerce.routemisr.com")) {
    urlStr = urlStr.replace("https://ecommerce.routemisr.com", "http://localhost:3001");
    // Ensure we don't reject local HTTP requests since SSL is disabled on localhost:3001
    return originalFetch(urlStr, options);
  }
  return originalFetch(url, options);
};
