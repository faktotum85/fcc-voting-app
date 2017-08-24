(function() {
  document.querySelector('#option').addEventListener('change', (e) => {
    const el = e.target;
    if (el.options[el.selectedIndex].value === 'add') {
      document.querySelector('#newOption').removeAttribute('hidden');
    } else {
      document.querySelector('#newOption').setAttribute('hidden', true);
    }
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const addOption = document.querySelector('#addOption');
    const newOptionInput = document.querySelector('#newOptionInput');

    if (addOption && addOption.selected && newOptionInput.value === '') {
      alert('You have to put in some text for your custom option');
    } else {
      e.target.submit();
    }

    return false;
  });

})();
