<?php
$year    = date("Y");
$base    = "/music";
$assets  = $base . "/assets";
$api     = $base . "/api.php?endpoint=";
$logo    = "/images/logo-web.png";
$ogImage = "https://malz-official.com" . $logo;
$v       = time();
$swv     = 7;
if (!empty($_GET['song'])) {
    $songId = preg_replace('/[^A-Za-z0-9_-]/', '', (string)$_GET['song']);
    if ($songId !== '') {
        header('Location: /music/watch.php?id=' . rawurlencode($songId), true, 302);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<script>
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('<?= $base ?>/sw-v3.js?v=<?= $swv ?>', { scope: '<?= $base ?>/' }).then(function(r){ try { r.update(); } catch(e){} }).catch(function(){});
    });
}
</script>
<meta charset="UTF-8">
<meta name="referrer" content="no-referrer">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#050505">
<meta name="color-scheme" content="dark">
<title>Malz-Musify | Stream Music No Limit</title>
<meta name="description" content="Malz-Musify — Web Music Player ringan. Streaming lagu Indonesia, Top Hits Global, K-Pop, dan banyak lagi. Tanpa iklan, tanpa limit.">
<meta name="keywords" content="malz musify, music player, streaming musik, lagu indonesia, top hits, kpop, web music, pemutar lagu online">
<meta name="author" content="Malz">

<link rel="icon" type="image/png" href="<?= $logo ?>">
<link rel="apple-touch-icon" href="<?= $logo ?>">
<link rel="shortcut icon" href="<?= $logo ?>">
<link rel="manifest" href="<?= $assets ?>/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Malz-Musify">
<meta name="mobile-web-app-capable" content="yes">

<meta property="og:site_name" content="Malz-Musify">
<meta property="og:type" content="website">
<meta property="og:title" content="Malz-Musify | Stream Music No Limit">
<meta property="og:description" content="Web Music Player ringan. Streaming lagu Indonesia, Top Hits Global, K-Pop, dan banyak lagi. Tanpa iklan, tanpa limit.">
<meta property="og:url" content="https://malz-official.com/music/">
<meta property="og:image" content="<?= $ogImage ?>">
<meta property="og:image:secure_url" content="<?= $ogImage ?>">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="600">
<meta property="og:image:height" content="600">
<meta property="og:image:alt" content="Malz-Musify Logo">
<meta property="og:locale" content="id_ID">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Malz-Musify | Stream Music No Limit">
<meta name="twitter:description" content="Web Music Player ringan. Streaming lagu Indonesia, Top Hits Global, K-Pop, dan banyak lagi.">
<meta name="twitter:image" content="<?= $ogImage ?>">
<meta name="twitter:image:alt" content="Malz-Musify">

<link rel="canonical" href="https://malz-official.com/music/">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= $assets ?>/css/style.css?v=<?= $v ?>">
<link rel="stylesheet" href="<?= $assets ?>/css/spotify.css?v=<?= $v ?>">
<link rel="stylesheet" href="<?= $assets ?>/css/malz-glass.css?v=<?= $v ?>">
<link rel="stylesheet" href="<?= $assets ?>/css/fp-anim.css?v=<?= $v ?>">
<link rel="stylesheet" href="<?= $assets ?>/css/theme.css?v=<?= $v ?>">
<script src="<?= $assets ?>/theme.js?v=<?= $v ?>"></script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Malz-Musify",
  "url": "https://malz-official.com/music/",
  "description": "Web Music Player ringan untuk streaming lagu Indonesia, Top Hits Global, K-Pop, dan lainnya.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "IDR" },
  "image": "<?= $ogImage ?>"
}
</script>
</head>
<body>

<div class="app-bg" aria-hidden="true"></div>

<div id="splash-screen">
    <div class="splash-logo">
        <img src="<?= $logo ?>" alt="Malz-Musify" onerror="this.style.display='none'">
    </div>
    <div class="splash-title">MALZ-MUSIFY</div>
    <div class="splash-sub">Menyiapkan musikmu</div>
    <div class="splash-bar"><i></i></div>
</div>

<nav class="nav">
    <div class="nav-in">
        <a href="<?= $base ?>/" class="logo">
            <img src="<?= $logo ?>" alt="Malz-Musify" onerror="this.style.display='none'">
            <span>MALZ<b>-</b>MUSIFY</span>
        </a>
        <div class="nav-rail-head"><i></i>Malz-Musify</div>
        <ul class="nav-menu">
            <li><a href="#" class="active" data-nav="home"><svg viewBox="0 0 24 24" style="width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:9px"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>Home</a></li>
            <li><a href="#" data-nav="search"><svg viewBox="0 0 24 24" style="width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:9px"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Search</a></li>
            <li><a href="#" data-nav="library"><svg viewBox="0 0 24 24" style="width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:9px"><path d="M4 4v16M9 4v16"/><path d="m14 5 4 15"/></svg>Library</a></li>
            <li><a href="#" data-nav="liked"><svg viewBox="0 0 24 24" style="width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:9px"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z"/></svg>Liked</a></li>
        </ul>
        <div class="nav-right">
            <button class="icon-btn" aria-label="Akun" data-nav="dev">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button class="icon-btn mobile-toggle" aria-label="Menu" aria-expanded="false" onclick="toggleMenu(this)">
                <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
        </div>
    </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
    <a href="#" data-nav="home">Home</a>
    <a href="#" data-nav="search">Search</a>
    <a href="#" data-nav="library">Library</a>
    <a href="#" data-nav="liked">Liked</a>
</div>

<div class="wrap">
    <div id="main-area">
        <div id="view-home"></div>
        <div id="view-search" style="display:none;"></div>
        <div id="view-library" style="display:none;"></div>
        <div id="view-liked" style="display:none;"></div>
        <div id="view-offline" style="display:none;"></div>
        <div id="view-dev" style="display:none;"></div>
    </div>
</div>

<div id="pwa-offline-banner" style="display:none" class="fixed top-3 left-1/2 -translate-x-1/2 z-[500] bg-white text-black font-bold text-xs px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2">
    <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.5"><path d="M1 1l22 22"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    <span>Mode Offline</span>
</div>

<div id="nav-container"></div>
<div id="mini-container"></div>
<div id="full-container"></div>
<div id="lyrics-container"></div>
<div id="artist-container"></div>
<div id="album-container"></div>
<div id="library-modal" class="viewer-overlay" style="display:none"></div>
<div id="yt-player" style="position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;"></div>
<audio id="audio" preload="auto"></audio>

<script>
window.MALZ_CONFIG = {
    base: "<?= $base ?>",
    assets: "<?= $assets ?>",
    api: "<?= $api ?>",
    logo: "<?= $logo ?>",
    v: "<?= $v ?>"
};
</script>

<script src="<?= $assets ?>/player.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/home.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/search.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/liked.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/library.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/profile.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/miniplayer.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/fullplayer.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/artist.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/album.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/app.js?v=<?= $v ?>"></script>
<script src="<?= $assets ?>/extras.js?v=<?= $v ?>"></script>

<script>
(function () {
    document.addEventListener('visibilitychange', function () {
        document.documentElement.classList.toggle('tab-hidden', document.hidden);
    });

    var menu = document.getElementById("mobileMenu");
    window.toggleMenu = function (btn) {
        if (!menu) return;
        var open = menu.classList.toggle("open");
        if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    window.closeMenu = function () { if (menu) menu.classList.remove("open"); };

    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-nav]');
        if (!el) return;
        e.preventDefault();
        var view = el.getAttribute('data-nav');
        if (window.App && App.switch) App.switch(view);
        if (window.closeMenu) closeMenu();
    });

    setTimeout(function () {
        var sp = document.getElementById("splash-screen");
        if (sp && !sp.classList.contains("hide")) {
            sp.classList.add("hide");
            setTimeout(function () { if (sp && sp.parentNode) sp.parentNode.removeChild(sp); }, 700);
        }
    }, 1800);

    // Debug helper — panggil window.debugState() dalam Console
    window.debugState = function () {
        var out = {};
        ['Player','MP','FullPlayer','App','Home','Search','Liked','Library','Profile','Artist','Album'].forEach(function (n) {
            out[n] = typeof window[n];
        });
        out.miniContainer = !!(document.getElementById('mini-container') && document.getElementById('mini-container').innerHTML.length);
        out.fullContainer = !!(document.getElementById('full-container') && document.getElementById('full-container').innerHTML.length);
        out.currentTrack = window.S && window.S.ct ? window.S.ct.title : null;
        console.table ? console.table(out) : console.log(out);
        return out;
    };
})();
</script>

<?php include __DIR__ . '/assets/apk-promo.php'; ?>
</body>
</html>