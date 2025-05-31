// Background service worker

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_BADGES') {
    fetch('https://persona-prague.vercel.app/api/badges')
      .then(res => res.json())
      .then(data => sendResponse({ badges: data }))
      .catch(err => sendResponse({ badges: [], error: err.toString() }));
    return true; // keep the message channel open for async response
  }
});
