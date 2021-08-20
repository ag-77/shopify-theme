// Focus on password
function passwordForcus() {
  window.setTimeout(function () {
    if (!$('#Login').hasClass('.no-js')) {
      $('#Password').focus();
    }
  }, 500);
} // open login on click


$('a[href="#Login"]').on('click', function () {
  $('#Login').toggleClass('no-js');
  passwordForcus();
}); // Allow deep linking to Login form

var hash = window.location.hash;

if (hash === '#Login') {
  $('#Login').removeClass('no-js');
  passwordForcus();
}