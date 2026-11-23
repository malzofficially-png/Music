(function () {
  'use strict';

  function gid(id) { return document.getElementById(id); }

  var Profile = {
    render: function () {
      var el = gid('view-dev');
      if (!el) return;
      el.style.display = 'block';
      var logo = (window.MALZ_CONFIG && MALZ_CONFIG.logo) || '/images/logo-web.png';

      el.innerHTML =
        '<section style="padding:90px 20px 20px;">' +
          '<h1 style="font-size:26px;font-weight:900;color:#fff;margin-bottom:20px;">Profil</h1>' +
          '<div style="text-align:center;padding:20px 0;">' +
            '<div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto 16px;border:2px solid rgba(255,255,255,0.15);">' +
              '<img src="' + logo + '" style="width:100%;height:100%;object-fit:cover;">' +
            '</div>' +
            '<h2 style="font-size:22px;font-weight:900;color:#fff;">Malz-Musify</h2>' +
            '<p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Stream Music No Limit</p>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;margin-top:20px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:13px;padding:8px 0;color:rgba(255,255,255,0.5);"><span>Versi</span><span style="color:#fff;">v1.0.0</span></div>' +
            '<div style="display:flex;justify-content:space-between;font-size:13px;padding:8px 0;color:rgba(255,255,255,0.5);"><span>Developer</span><span style="color:#fff;">Malz</span></div>' +
          '</div>' +
          '<a href="https://whatsapp.com/channel/0029VbCsS2r2phHIV3O0nO1a" target="_blank" style="display:block;text-align:center;padding:14px;border-radius:14px;background:#fff;color:#050505;font-weight:700;font-size:13px;text-decoration:none;margin-top:20px;">Gabung Channel WhatsApp</a>' +
        '</section>';
    }
  };

  window.Profile = Profile;

})();