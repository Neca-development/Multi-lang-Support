'use strict';

(function() {
  // Get the current URL
  var url = new URL(window.location.href);

  // Get referrer address from URL
  var referrer = url.searchParams.get('src');

  // Get local storage referrer
  var lsReferrer = localStorage.getItem('referrer');

  if (referrer && (!lsReferrer || lsReferrer !== referrer)) {
    // Save referrer address
    localStorage.setItem('referrer', referrer);
  }

  var graphUrl = 'https://api.thegraph.com/subgraphs/name/peakdefi/peakdefi-mainnet'

  function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  function getTotalAum() {
    return new Promise(function (resolve, reject) {
      var settings = {
        'method': 'POST',
        'url': graphUrl,
        'data': "{\"query\": \"{ fund(id: \\\"0x9424b287c8c0def28e96d595b1f76aef11ef581b\\\") { totalFundsInUSDC } }\"}",
        'timeout': 0,
        'headers': {
          'Content-Type': 'text/plain',
        }
      };

      $.ajax(settings).done(function (response) {
        var aum = response.data.fund.totalFundsInUSDC;
        var formattedAum = numberWithCommas(parseFloat(aum).toFixed(2));
        resolve('$' + formattedAum);
      });
    })
  }

  function getTotalStaked() {
    return new Promise(function (resolve, reject) {
      var settings = {
        'method': 'POST',
        'url': graphUrl,
        'data': "{\"query\": \"{ peakStakingPool(id: \\\"PeakStakingPool\\\") { stakeAmount } }\"}",
        'timeout': 0,
        'headers': {
          'Content-Type': 'text/plain',
        }
      };

      $.ajax(settings).done(function (response) {
        var totalStaked = response.data.peakStakingPool.stakeAmount;
        var formattedAum = numberWithCommas(parseFloat(totalStaked).toFixed(2));
        resolve(formattedAum + ' PEAK');
      });
    })
  }

  initCarousel();

  Promise.all([getTotalAum(), getTotalStaked()]).then(function (result) {
    $('#total-aum').html(result[0]);
    $('#total-staked').html(result[1]);
  })
})();

function openInvestorPortal(customPage) {
  var language = lsLanguage();
  var url = 'https://peakdefi.com/investor-portal/';

  if (language != 'en-US') {
    url += language + '/';
  }

  if (customPage) {
    url += customPage;
  } else {
    url += 'fund/0x9424b287c8c0def28e96d595b1f76aef11ef581b';
  }

  url += document.location.search;

  window.open(url, '_self');
}

function lsLanguage() {
  var lang = localStorage.getItem('language');
  if (!lang) {
    return 'en-US';
  } else {
    return lang;
  }
}

function initCarousel () {
  var $carousel = $('.has-carousel');
		if ($carousel && $carousel.length) {
      $carousel.each(function () {
        var $self = $(this);
        var cim = ($self.data('items')) ? $self.data('items') : 4;
        var cim_l = ($self.data('items-desk')) ? $self.data('items-desk') : cim;
        var cim_t_l = ($self.data('items-tab-l')) ? $self.data('items-tab-l') : (cim > 3 ? (cim - 1) : cim);
        var cim_t_p = ($self.data('items-tab-p')) ? $self.data('items-tab-p') : (cim_t_l > 2 ? (cim_t_l - 1) : cim_t_l);
        var cim_m = ($self.data('items-mobile')) ? $self.data('items-mobile') : (cim_t_p > 1 ? (cim_t_p - 1) : cim_t_p);
        var cim_xm = ($self.data('items-mobile-s')) ? $self.data('items-mobile-s') : cim_m;
        var c_timeout =($self.data('timeout')) ? $self.data('timeout') : 6000;
        var c_auto =($self.data('auto')) ? $self.data('auto') : false,
            c_auto_speed =($self.data('auto-speed')) ? $self.data('auto-speed') : 600,
            c_loop =($self.data('loop')) ? $self.data('loop') : false,
            c_dots = ($self.data('dots')) ? $self.data('dots') : false,
            c_custdots = ($self.data('custom-dots')) ? '.'+$self.data('custom-dots') : false,
            c_navs = ($self.data('navs')) ? $self.data('navs') : false,
            c_ctr = ($self.data('center')) ? $self.data('center') : false,
            c_mgn = ($self.data('margin')) ? $self.data('margin') : 30,
            c_mgn_t_l = ($self.data('margin-tab-l')) ? $self.data('margin-tab-l') : c_mgn,
            c_mgn_t_p = ($self.data('margin-tab-p')) ? $self.data('margin-tab-p') : c_mgn_t_l,
            c_mgn_mob = ($self.data('margin-mob')) ? $self.data('margin-mob') : c_mgn_t_p,
            c_animate_out = ($self.data('animate-out')) ? $self.data('animate-out') : false,
            c_animate_in = ($self.data('animate-in')) ? $self.data('animate-in') : false;


        if(cim <= 1){ cim = cim_l = cim_t_l = cim_t_p = cim_m = 1;}

        $self.addClass('owl-carousel').owlCarousel({
          navText: ['',''],
          items: cim,
          loop: c_loop,
          nav: c_navs,
          dots: c_dots,
          dotsContainer: c_custdots,
          margin: c_mgn,
          center: c_ctr,
          autoplay: c_auto,
          autoplayTimeout: c_timeout,
          autoplaySpeed: c_auto_speed,
          animateOut : c_animate_out,
          animateIn : c_animate_in,
          rtl: false,
          autoHeight: false,
          responsive:{
            0:{ items:cim_xm, margin: c_mgn_mob },
            576:{ items:cim_xm, margin: c_mgn_mob },
            768:{ items: cim_t_p, margin: c_mgn_t_l },
            992:{ items: cim_l, margin: c_mgn_t_l },
            1200:{ items: cim, margin: c_mgn },
            1600:{ items: cim_l, margin: c_mgn }
          },
          onInitialized: function() {
            if($().waypoint) { Waypoint.refreshAll(); }
          }
        });

        if ($self.data('blank')===true) {
          fixing_blank($self);
          $win.on('resize', function() {
            fixing_blank($self);
          });
        }
      });
	};
}