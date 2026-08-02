// public/workers/search.worker.js
// Web Worker for offloading search index compilation and query matching

let searchIndex = [];
let debounceTimeout = null;

self.onmessage = function (e) {
  const { type, payload } = e.data || {};

  if (type === "INIT") {
    searchIndex = payload || [];
    self.postMessage({ type: "INITIALIZED", count: searchIndex.length });
    return;
  }

  if (type === "SEARCH") {
    const { query, maxSubjects = 4, maxResources = 6 } = payload || {};

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (!query || query.trim() === "") {
      self.postMessage({
        type: "SEARCH_RESULTS",
        payload: { query: "", subjects: [], resources: [] },
      });
      return;
    }

    // 200ms debounce on worker thread
    debounceTimeout = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const subjects = [];
      const resources = [];

      for (let i = 0; i < searchIndex.length; i++) {
        const item = searchIndex[i];
        if (item.type === "subject") {
          if (item.subjectName && item.subjectName.toLowerCase().includes(q)) {
            subjects.push(item);
          }
        } else {
          const labelMatch = item.resourceLabel && item.resourceLabel.toLowerCase().includes(q);
          const subjectMatch = item.subjectName && item.subjectName.toLowerCase().includes(q);
          const unitMatch = item.unitTitle && item.unitTitle.toLowerCase().includes(q);
          if (labelMatch || subjectMatch || unitMatch) {
            resources.push(item);
          }
        }
      }

      self.postMessage({
        type: "SEARCH_RESULTS",
        payload: {
          query,
          subjects: subjects.slice(0, maxSubjects),
          resources: resources.slice(0, maxResources),
        },
      });
    }, 200);
  }
};
