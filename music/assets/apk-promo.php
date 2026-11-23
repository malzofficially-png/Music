<?php
$apk_url = '/music/app/MalzMusify-v4.0.apk?v=2026111413';
$apk_size = '63 MB';
$apk_ver = 'v4.0';
$apk_new = true;
?>
<div class="apk-promo" id="apkPromo" style="display:none">
  <div class="apk-promo-backdrop" id="apkPromoBg"></div>
  <div class="apk-promo-card" role="dialog" aria-modal="true" aria-label="Muat turun APK Malz-Musify">
    <button class="apk-promo-x" type="button" id="apkPromoX" aria-label="Tutup">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="apk-promo-head">
      <img class="apk-promo-icon" src="/music/assets/icons/icon-192.png" alt="Malz-Musify" onerror="this.style.display='none'">
      <div>
        <b>Malz-Musify untuk Android <?php if ($apk_new): ?><span class="apk-promo-badge"><?= htmlspecialchars($apk_ver, ENT_QUOTES, 'UTF-8') ?> BARU</span><?php endif; ?></b>
        <span><?= htmlspecialchars($apk_ver, ENT_QUOTES, 'UTF-8') ?> &middot; <?= htmlspecialchars($apk_size, ENT_QUOTES, 'UTF-8') ?> &middot; Android 5.0+</span>
      </div>
    </div>
    <ul class="apk-promo-list">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>Kawalan main di notifikasi &amp; lock screen</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>Pemain terapung bila main game</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>Main musik ketika skrin mati</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>UI kekal bila tiada internet</li>
    </ul>
    <div class="apk-promo-actions">
      <a class="apk-promo-dl" href="<?= htmlspecialchars($apk_url, ENT_QUOTES, 'UTF-8') ?>" download>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>Muat Turun APK <?= htmlspecialchars($apk_ver, ENT_QUOTES, 'UTF-8') ?>
      </a>
      <button class="apk-promo-no" type="button" id="apkPromoNo">Terus guna web</button>
    </div>
  </div>
</div>
<style>
.apk-promo{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
.apk-promo-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.68);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);opacity:0;transition:opacity .28s}
.apk-promo.show .apk-promo-backdrop{opacity:1}
.apk-promo-card{position:relative;width:min(430px,100%);padding:24px 22px 20px;border:1px solid rgba(255,255,255,.14);border-radius:26px;background:linear-gradient(150deg,rgba(24,28,33,.93),rgba(12,15,18,.95));backdrop-filter:blur(34px) saturate(160%);-webkit-backdrop-filter:blur(34px) saturate(160%);box-shadow:0 30px 90px rgba(0,0,0,.6),0 0 0 1px rgba(30,215,96,.06);opacity:0;transform:translateY(26px) scale(.96);transition:opacity .32s cubic-bezier(.22,1,.36,1),transform .32s cubic-bezier(.22,1,.36,1)}
.apk-promo.show .apk-promo-card{opacity:1;transform:translateY(0) scale(1)}
.apk-promo-x{position:absolute;top:14px;right:14px;width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.07);color:#fff;display:grid;place-items:center;cursor:pointer;transition:background .2s}
.apk-promo-x:hover{background:rgba(255,255,255,.16)}
.apk-promo-x svg{width:14px;height:14px}
.apk-promo-head{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.apk-promo-icon{width:52px;height:52px;border-radius:15px;box-shadow:0 8px 24px rgba(0,0,0,.4);flex:0 0 auto}
.apk-promo-head b{display:block;font-size:16px;letter-spacing:-.2px;color:#fff}
.apk-promo-badge{display:inline-block;vertical-align:middle;margin-left:7px;padding:2px 7px;border-radius:6px;background:#1ed760;color:#061008;font-size:9.5px;font-weight:800;letter-spacing:.4px}
.apk-promo-head span{display:block;margin-top:3px;font-size:11.5px;color:rgba(255,255,255,.5)}
.apk-promo-list{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-direction:column;gap:10px}
.apk-promo-list li{display:flex;align-items:center;gap:11px;font-size:12.5px;color:rgba(255,255,255,.82)}
.apk-promo-list svg{width:17px;height:17px;flex:0 0 auto;color:#1ed760}
.apk-promo-actions{display:flex;gap:9px}
.apk-promo-dl{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 16px;border-radius:14px;background:#1ed760;color:#061008;font-size:13px;font-weight:800;text-decoration:none;transition:transform .2s,filter .2s}
.apk-promo-dl:hover{transform:translateY(-2px);filter:brightness(1.08)}
.apk-promo-dl svg{width:16px;height:16px}
.apk-promo-no{flex:0 0 auto;padding:14px 16px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.05);color:rgba(255,255,255,.75);font:inherit;font-size:12.5px;cursor:pointer;transition:background .2s}
.apk-promo-no:hover{background:rgba(255,255,255,.12)}
@media(max-width:600px){.apk-promo-card{padding:20px 18px 18px;border-radius:22px}.apk-promo-head b{font-size:15px}.apk-promo-list li{font-size:12px}.apk-promo-dl,.apk-promo-no{padding:13px 13px;font-size:12px}}
</style>
<script>
(function(){
  var box=document.getElementById('apkPromo');if(!box)return;
  function show(){box.style.display='flex';requestAnimationFrame(function(){box.classList.add('show');});}
  function hide(){box.classList.remove('show');setTimeout(function(){box.style.display='none';},300);}
  window.apkPromoShow=show;window.apkPromoHide=hide;
  var bg=document.getElementById('apkPromoBg'),x=document.getElementById('apkPromoX'),no=document.getElementById('apkPromoNo');
  if(bg)bg.onclick=hide;if(x)x.onclick=hide;if(no)no.onclick=hide;
  document.addEventListener('keydown',function(e){if(e.key==='Escape')hide();});
  setTimeout(show,2200);
})();
</script>
