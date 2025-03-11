// LocalStorage tracker
// This script intercepts localStorage operations to log them for debugging

(function() {
  // Save original methods
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  
  // Override setItem to log operations
  localStorage.setItem = function(key, value) {
    console.log('localStorage.setItem', key, value);
    originalSetItem.call(localStorage, key, value);
  };
  
  // Override getItem to log operations
  localStorage.getItem = function(key) {
    const value = originalGetItem.call(localStorage, key);
    console.log('localStorage.getItem', key, value);
    return value;
  };
  
  console.log('LocalStorage tracker initialized');
})();
