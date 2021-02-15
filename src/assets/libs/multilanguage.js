document.addEventListener("DOMContentLoaded", function(event) { 
  (function () {
    var langCode = navigator.language.substr(0, 2);
    var langs = ['en', 'es', 'ru', 'ua', 'vi', 'cn', 'jp', 'kr'];
  
    initLanguage();
  
    $('p[lang]').each(function (index) {
      $(this).click(() => {
        selectLanguage($(this).attr('lang'));
      });
    });
  
    $('#language-value').click(() => {
      $('#language').toggleClass('active');
    });
  
    $('#language-dropdown').mouseleave(() => {
      $('#language').removeClass('active');
    });
  
    $(window).scroll(() => {
      $('#language').removeClass('active');
    });
  
    function selectLanguage(selectedLang) {
      if (selectedLang === langCode) {
        return;
      }
  
      localStorage.setItem('language', selectedLang);
      location.reload();
    }
  
    function initLanguage() {
      var langFromStore = localStorage.getItem('language');
  
      if(langFromStore){
        langCode = langFromStore
      }
  
      $('#language-value').text(langCode.toUpperCase());
  
      $('#language-dropdown').html('');
  
      langs.map((lang) => {
        $('#language-dropdown').prepend(
          `<p lang="${lang}" style = ${
            lang == langCode ? 'display:none;' : ''
          }>${lang.toUpperCase()}</p>`
        );
      });
  
      var translate = function (jsdata) {
        $('[tkey]').each(function (index) {
          var strTr = jsdata[$(this).attr('tkey')];
          var children = $(this).children();
          $(this).html([strTr, ' ', children]);
        });
      };
  
      if (langs.indexOf(langCode) != -1) {
        $.getJSON('/assets/lang/' + langCode + '.json', translate);
      } else {
        langCode = 'en';
        $.getJSON('/assets/lang/en.json', translate);
      }
    }
  })();
});
