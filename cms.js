(function legacyPhoCmsLoader() {
  if (window.PHO_CMS && typeof window.PHO_CMS.reloadPublicContent === 'function') {
    window.PHO_CMS.reloadPublicContent();
  }
})();
