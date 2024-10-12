export function getProxyImageUrl(url: string): string {
  // We use the image proxy service from wsrv.nl
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&default=${encodeURIComponent(url)}`;
}
