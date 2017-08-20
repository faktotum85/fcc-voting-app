(function() {
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let options = document.querySelector('textarea').value.split('\n');
    options = options.filter(option => {
      return option.trim() !== ''
    });
    if (options.length < 2) {
      alert('Please include at least two answer options.')
    } else {
      e.target.submit();
    }
    return false;
  });
})();
