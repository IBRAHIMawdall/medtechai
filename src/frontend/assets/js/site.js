(function() {
  // Theme handling using html[data-theme]
  var root = document.documentElement;
  var THEME_KEY = 'theme';
  var currentTheme = localStorage.getItem(THEME_KEY) || 'light';
  root.setAttribute('data-theme', currentTheme);

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // Pricing billing toggle
  function setBilling(mode) {
    var monthlyBtn = document.getElementById('billing-monthly');
    var yearlyBtn = document.getElementById('billing-yearly');
    if (monthlyBtn && yearlyBtn) {
      monthlyBtn.classList.toggle('active', mode === 'monthly');
      yearlyBtn.classList.toggle('active', mode === 'yearly');
    }

    document.querySelectorAll('.pricing .price').forEach(function(el){
      var amountEl = el.querySelector('.amount');
      var periodEl = el.querySelector('.period');
      if (!amountEl || !periodEl) return;
      var monthly = el.getAttribute('data-monthly');
      var yearly = el.getAttribute('data-yearly');
      if (mode === 'yearly' && yearly) {
        amountEl.textContent = Number(yearly).toLocaleString();
        periodEl.textContent = '/month billed yearly';
      } else if (monthly) {
        amountEl.textContent = Number(monthly).toLocaleString();
        periodEl.textContent = '/month';
      }
    });
    localStorage.setItem('billing', mode);
  }

  var monthlyBtn = document.getElementById('billing-monthly');
  var yearlyBtn = document.getElementById('billing-yearly');
  if (monthlyBtn && yearlyBtn) {
    monthlyBtn.addEventListener('click', function(){ setBilling('monthly'); });
    yearlyBtn.addEventListener('click', function(){ setBilling('yearly'); });
    setBilling(localStorage.getItem('billing') || 'monthly');
  }
})();
