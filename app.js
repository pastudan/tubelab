var request = require('request');
var io = require('socket.io').listen(8888);
var playlists = {}; //replace with Redis sooner or later..
var search = {};
var UAParser = require('ua-parser-js');
var parser = new UAParser();

//shamelessly stolen from Swappa.com :-D
var phoneModels = [
    "AIO","ASUS VivoTab Note 8 (Wi-Fi) [M80TA]","AT&T","AT&T Z998 (AT&T)","Acer","Acer Iconia Tab 8 (Wi-Fi)","Acer Iconia Tab A1-810 (Wi-Fi)","Acer Iconia Tab A100 (Wi-Fi)","Acer Iconia Tab A200 (Wi-Fi)","Acer Iconia Tab A210 (Wi-Fi)","Acer Iconia Tab A500 (Wi-Fi)","Acer Iconia Tab A510 (Wi-Fi)","Acer Iconia Tab A700 (Wi-Fi)","Acer Iconia W3-810 (Wi-Fi)","Acer Iconia W500 (Wi-Fi)","Acer Iconia W510 (Wi-Fi)","Acer Iconia W700 (Wi-Fi)","Advent","Advent Vega (Wi-Fi)","Alcatel","Alcatel One Touch Evolve (Metro PCS)","Alcatel One Touch Evolve (T-Mobile)","Alcatel One Touch Fierce (Metro PCS)","Alcatel One Touch Fierce (T-Mobile)","Alltel","Amazon","Amazon Fire Phone (AT&T)","Amazon Kindle 4 (Amazon)","Amazon Kindle 5 (Amazon)","Amazon Kindle Fire (Amazon)","Amazon Kindle Fire 2nd Gen (Amazon)","Amazon Kindle Fire HD (Amazon)","Amazon Kindle Fire HD 2nd Gen (Amazon)","Amazon Kindle Fire HD 3rd Gen (Amazon)","Amazon Kindle Fire HD 8.9 (Amazon)","Amazon Kindle Fire HD 8.9 4G LTE (Amazon)","Amazon Kindle Fire HDX 7 (Wi-Fi)","Amazon Kindle Fire HDX 7 4G LTE (AT&T)","Amazon Kindle Fire HDX 7 4G LTE (Verizon)","Amazon Kindle Fire HDX 8.9 (Amazon)","Amazon Kindle Fire HDX 8.9 LTE (AT&T)","Amazon Kindle Fire HDX 8.9 LTE (Verizon)","Amazon Kindle Paperwhite (Amazon)","Amazon Kindle Paperwhite 2 (Amazon)","Amazon Kindle Paperwhite 2 3G (Amazon)","Amazon Kindle Paperwhite 3G (Amazon)","Amazon Kindle Touch (Amazon)","Amazon Kindle Touch 3G (Amazon)","America Movil","Apple","Apple iPad (3G) (Unlocked)","Apple iPad (AT&T)","Apple iPad (Wi-Fi)","Apple iPad 2 (3G) (Other) [A1396]","Apple iPad 2 (AT&T)","Apple iPad 2 (Sprint) [A1397]","Apple iPad 2 (Verizon) [A1397]","Apple iPad 2 (Wi-Fi) [A1395]","Apple iPad 3 (3G/4G) (Other)","Apple iPad 3 (AT&T)","Apple iPad 3 (Sprint)","Apple iPad 3 (Verizon)","Apple iPad 3 (Wi-Fi)","Apple iPad 4 (AT&T)","Apple iPad 4 (Sprint)","Apple iPad 4 (Unlocked)","Apple iPad 4 (Verizon)","Apple iPad 4 (Wi-Fi)","Apple iPad Air (AT&T)","Apple iPad Air (Sprint)","Apple iPad Air (T-Mobile)","Apple iPad Air (US Cellular)","Apple iPad Air (Unlocked)","Apple iPad Air (Verizon)","Apple iPad Air (Wi-Fi)","Apple iPad Mini Retina (AT&T)","Apple iPad Mini Retina (Sprint)","Apple iPad Mini Retina (T-Mobile)","Apple iPad Mini Retina (Unlocked)","Apple iPad Mini Retina (Verizon)","Apple iPad Mini Retina (Wi-Fi)","Apple iPad mini (AT&T)","Apple iPad mini (Sprint)","Apple iPad mini (Verizon)","Apple iPad mini (Wi-Fi)","Apple iPhone (AT&T)","Apple iPhone 3G (AT&T)","Apple iPhone 3GS (AT&T)","Apple iPhone 3GS (Unlocked)","Apple iPhone 4 (AT&T) [A1332]","Apple iPhone 4 (CricKet) [A1349]","Apple iPhone 4 (Other)","Apple iPhone 4 (Sprint) [A1349]","Apple iPhone 4 (Unlocked) [A1332]","Apple iPhone 4 (Verizon) [A1349]","Apple iPhone 4 (Virgin Mobile) [A1349]","Apple iPhone 4S (AT&T) [A1387]","Apple iPhone 4S (Alltel)","Apple iPhone 4S (C-Spire) [A1387]","Apple iPhone 4S (CricKet) [A1387]","Apple iPhone 4S (Orange) [A1387]","Apple iPhone 4S (Rogers)","Apple iPhone 4S (Sprint) [A1387]","Apple iPhone 4S (Straight Talk) [A1387]","Apple iPhone 4S (T-Mobile UK) [A1387]","Apple iPhone 4S (US Cellular) [A1387]","Apple iPhone 4S (Unlocked) [A1387]","Apple iPhone 4S (Verizon) [A1387]","Apple iPhone 4S (Virgin Mobile) [A1387]","Apple iPhone 5 (AT&T) [A1428]","Apple iPhone 5 (CricKet) [A1429]","Apple iPhone 5 (Rogers) [A1428]","Apple iPhone 5 (Sprint) [A1429]","Apple iPhone 5 (Straight Talk) [A1428]","Apple iPhone 5 (T-Mobile) [A1428]","Apple iPhone 5 (TracFone) [A1429]","Apple iPhone 5 (Unlocked) [A1428]","Apple iPhone 5 (Verizon) [A1429]","Apple iPhone 5 (Virgin Mobile) [A1429]","Apple iPhone 5C (AT&T) [A1532]","Apple iPhone 5C (Boost) [A1456]","Apple iPhone 5C (CricKet) [A1532]","Apple iPhone 5C (Sprint) [A1456]","Apple iPhone 5C (T-Mobile) [A1532]","Apple iPhone 5C (US Cellular) [A1456]","Apple iPhone 5C (Unlocked) [A1532]","Apple iPhone 5C (Verizon) [A1532]","Apple iPhone 5C (Virgin Mobile) [A1532]","Apple iPhone 5S (AT&T) [A1533]","Apple iPhone 5S (Boost) [A1453]","Apple iPhone 5S (CricKet) [A1453]","Apple iPhone 5S (Other)","Apple iPhone 5S (Sprint) [A1453]","Apple iPhone 5S (T-Mobile) [A1533]","Apple iPhone 5S (US Cellular) [A1453]","Apple iPhone 5S (Unlocked) [A1533]","Apple iPhone 5S (Verizon) [A1533]","Apple iPhone 5S (Virgin Mobile) [A1453]","Apple iPod Nano 6th Gen (Wi-Fi)","Apple iPod Touch 2nd Gen (Wi-Fi)","Apple iPod Touch 3rd Gen (Wi-Fi)","Apple iPod Touch 4th Gen (Wi-Fi)","Apple iPod Touch 5th Gen (Wi-Fi)","Archos","Archos 101 (Other)","Archos 101 G9 Turbo (Wi-Fi)","Archos 28 (Other)","Archos 5 (Other)","Archos 7 (Other)","Archos 70 (Other)","Archos 80 G9 Turbo (Other)","Archos Familypad 2 (Wi-Fi)","Asus","Asus Eee Pad Transformer Prime TF201 (Wi-Fi)","Asus Eee Pad Transformer TF101 (Wi-Fi)","Asus Fonepad (Unlocked)","Asus Memo Pad 8 (Wi-Fi)","Asus Memo Pad Smart 10 (Wi-Fi) [ME301T]","Asus Memopad FHD 10 (Wi-Fi)","Asus Memopad FHD 10 LTE (Unlocked)","Asus Padfone (Unlocked)","Asus Padfone 2 (Unlocked)","Asus Padfone Infinity (Unlocked)","Asus Padfone Infinity 2 (Unlocked)","Asus Padfone X (AT&T)","Asus Portable AiO (Wi-Fi)","Asus Slider (Wi-Fi)","Asus Transformer Book T100 (Wi-Fi)","Asus Transformer Infinity TF700 (Wi-Fi)","Asus Transformer Pad TF300 (Wi-Fi)","Asus Transformer TF701T (Wi-Fi)","Asus VivoTab RT TF600T (Wi-Fi)","Asus VivoTab Smart ME400C (Wi-Fi)","Asus VivoTab TF810C (Wi-Fi)","Asus Zenfone 4 (Unlocked)","Asus Zenfone 6 (Unlocked)","Bell (Canada)","BlackBerry Bold 9650 (Sprint)","BlackBerry Curve 8530 (Boost)","BlackBerry Curve 8530 (Sprint)","BlackBerry Curve 8530 (US Cellular)","BlackBerry Curve 8530 (Verizon)","BlackBerry Curve 9380 (AT&T)","BlackBerry Curve 9380 (T-Mobile)","BlackBerry Storm 2 (Verizon)","Blackberry","Blackberry Bold 9650 (Verizon)","Blackberry Bold 9780 (T-Mobile)","Blackberry Bold 9900 (AT&T)","Blackberry Bold 9900 (T-Mobile)","Blackberry Bold 9900 (Unlocked)","Blackberry Bold 9930 (Sprint)","Blackberry Bold 9930 (Verizon)","Blackberry Curve 9360 (AT&T)","Blackberry Curve 9360 (T-Mobile)","Blackberry Curve 9360 (Unlocked)","Blackberry Dev Alpha B (Unlocked)","Blackberry Dev Alpha C (Unlocked)","Blackberry Playbook (Other)","Blackberry Q10 (AT&T)","Blackberry Q10 (Sprint)","Blackberry Q10 (T-Mobile)","Blackberry Q10 (Unlocked)","Blackberry Q10 (Verizon)","Blackberry Q5 (Unlocked)","Blackberry Torch (AT&T)","Blackberry Torch (Sprint)","Blackberry Torch 9860 (AT&T) [9860]","Blackberry Z10 (AT&T)","Blackberry Z10 (Sprint)","Blackberry Z10 (T-Mobile)","Blackberry Z10 (Unlocked)","Blackberry Z10 (Verizon)","Blackberry Z30 (Unlocked) [STA100-5]","Blackberry Z30 (Verizon)","Blu","Blu Advance 4.0 (Unlocked)","Blu Amour (Unlocked) [D280]","Blu Amour Dual SIM (Unlocked) [D290]","Blu Dash (Unlocked)","Blu Dash 4.0 (Unlocked) [D261]","Blu Dash 4.0 Dual SIM (Unlocked) [D271]","Blu Dash 4.0 Music (Unlocked) [D271]","Blu Dash 4.0 Music Dual SIM (Unlocked) [D272]","Blu Dash 4.5 (Unlocked) [D300]","Blu Dash 4.5 Dual SIM (Unlocked) [D310]","Blu Dash 5.0 (Unlocked) [D400]","Blu Dash 5.0 Dual SIM (Unlocked) [D410]","Blu Dash Jr Dual SIM (Unlocked) [D140]","Blu Life 8 (Unlocked)","Blu Life One (Unlocked) [L120]","Blu Life One M (Unlocked)","Blu Life One X (Unlocked)","Blu Life Play (Unlocked)","Blu Life Play S (Unlocked)","Blu Life Play X (Unlocked)","Blu Life Pro (Unlocked)","Blu Life Pure (Unlocked)","Blu Life Pure XL (Unlocked) [L259L]","Blu Life Pure XL (Unlocked) [L260L]","Blu Life Pure mini (Unlocked)","Blu Life View (Unlocked) [L110]","Blu Life View Tab (Unlocked)","Blu Neo 3.5 (Unlocked)","Blu Neo 4.5 (Unlocked)","Blu Quattro 4.5 (Unlocked)","Blu Quattro 4.5 HD (Unlocked)","Blu Quattro 5.7 HD (Unlocked)","Blu Studio 5.0 (Unlocked) [D530]","Blu Studio 5.0 Dual SIM (Unlocked) [D520]","Blu Studio 5.0 S (Unlocked) [D570]","Blu Studio 5.0 S Dual SIM (Unlocked) [D560]","Blu Studio 5.0 S II (Unlocked)","Blu Studio 5.0 S LTE (Unlocked) [Y530Q]","Blu Studio 5.3 (Unlocked)","Blu Studio 5.3 II (Unlocked)","Blu Studio 5.3 S (Unlocked) [D580]","Blu Studio 5.3 S Dual SIM (Unlocked) [D590]","Blu Studio 5.5 (Unlocked)","Blu Studio 5.5s (Unlocked)","Blu Studio 6.0 HD (Unlocked) [D650]","Blu Tank 4.5 (Unlocked) [W100]","Blu Tank 4.5 Dual SIM (Unlocked) [W110]","Blu VIVO IV (Unlocked) [D970L]","Blu Vivo 4.8 HD (Unlocked)","Boost","C-Spire","Casio Hitachi G'zOne Commando (Verizon)","Casio Hitachi G'zOne Commando 4G LTE (Verizon)","Caterpillar CAT B15 (Unlocked)","Cellcom","Claro","ConnecteDevice","ConnecteDevice cookoo (Smart Watch)","CricKet","Dell","Dell Latitude 10 (Wi-Fi)","Dell Streak 5 (AT&T)","Dell Streak 7 (T-Mobile)","Dell Streak 7 (Wi-Fi)","Dell Venue 11 Pro (Wi-Fi)","Dell Venue 7 (Unlocked)","Dell Venue 7 (Wi-Fi)","Dell Venue 8 (Wi-Fi)","Dell Venue 8 Pro (Wi-Fi)","Dell Venue Pro (Unlocked)","Dell XPS 10 (Unlocked)","Dell XPS 10 (Wi-Fi)","Dev Phone 1 (Google)","Dev Phone 2 (Google)","Droid DNA (Verizon)","Droid Maxx (Verizon)","Droid Mini (Verizon)","Droid RAZR M (Verizon)","Droid Razr (Verizon)","Droid Razr HD (Verizon)","Droid Razr Maxx (Verizon)","Droid Razr Maxx HD (Verizon)","Droid Ultra (Verizon)","EE","EVGA Tegra Note 7 (Wi-Fi)","Epad T1 (Other)","Epic Touch 4G (Boost) [SPH-D710]","Epic Touch 4G (Sprint) [SPH-D710]","FAEA F2 (Unlocked) [MTK6589T]","Fairphone (Unlocked)","Fuhu","Fujitsu","Fujitsu Arrows X F02E (Other)","G1 (T-Mobile)","Galaxy Nexus (Sprint) [SPH-L700]","Galaxy Nexus (Unlocked) [GT-i9250]","Galaxy Nexus (Verizon) [SCH-i515]","Garmin-Asus","Garminfone (T-Mobile)","Google","Google Glass (Wearable)","Google Ion (Google)","HP ElitePad (Wi-Fi)","HP Omni 10 (Wi-Fi)","HP Slate 2 (Wi-Fi)","HP Slate 7 Extreme (Wi-Fi)","HP SlateBook 10 X2 (Wi-Fi)","HP TouchPad (Wi-Fi)","HTC","HTC 7 Mozart (Unlocked)","HTC 8X (AT&T)","HTC 8X (T-Mobile)","HTC 8X (Verizon)","HTC 8XT (Sprint)","HTC Amaze 4G (T-Mobile)","HTC Aria (AT&T)","HTC Arrive (Sprint)","HTC Butterfly (Unlocked)","HTC Butterfly S (Unlocked)","HTC Desire (Telus)","HTC Desire (US Cellular)","HTC Desire (Unlocked)","HTC Desire (Virgin Mobile) [601]","HTC Desire 610 (AT&T)","HTC Desire 700 Dual SIM (Unlocked)","HTC Desire 816 (Unlocked)","HTC Desire C (Unlocked)","HTC Desire HD (Unlocked)","HTC Desire S (Unlocked)","HTC Desire V (Unlocked)","HTC Desire X (Unlocked)","HTC Desire Z (Bell (Canada))","HTC Desire Z (Unlocked)","HTC Detail (Other)","HTC Dream (Rogers)","HTC Droid Eris (Verizon)","HTC Droid Incredible (Verizon)","HTC Droid Incredible 2 (Verizon)","HTC EVO 3D (Rogers)","HTC EVO 3D (Sprint)","HTC EVO 3D (Virgin Mobile)","HTC EVO 4G (Sprint)","HTC EVO 4G LTE (Sprint)","HTC EVO Design 4G (Sprint)","HTC EVO Shift 4G (Sprint)","HTC EVO V 4G (Virgin Mobile)","HTC EVO View 4G (Sprint)","HTC Explorer (Other)","HTC First (AT&T)","HTC Flyer 3G (Sprint)","HTC Flyer 3G (T-Mobile)","HTC Flyer WiFi (Other)","HTC G2 (T-Mobile)","HTC HD2 (T-Mobile)","HTC HD7 (T-Mobile)","HTC Hero (Sprint)","HTC Hero (Telus)","HTC Incredible 4G LTE (Verizon)","HTC Incredible S (Unlocked)","HTC Inspire 4G (AT&T)","HTC Jetstream (AT&T)","HTC Legend (Other)","HTC Magic (Rogers)","HTC Magic (Unlocked)","HTC Merge (US Cellular)","HTC Merge (Verizon)","HTC One (AT&T)","HTC One (Rogers)","HTC One (Sprint)","HTC One (T-Mobile)","HTC One (Telus)","HTC One (Unlocked)","HTC One (Verizon)","HTC One Dual-SIM (Unlocked)","HTC One Google Edition (Unlocked)","HTC One M8 (AT&T) [0P6B120]","HTC One M8 (Sprint) [0P6B700]","HTC One M8 (T-Mobile) [0P6B130]","HTC One M8 (Unlocked) [0P6B100]","HTC One M8 (Verizon) [0P6B200]","HTC One M8 Developer Edition (Unlocked) [0P6B120]","HTC One M8 Google Edition (Unlocked) [0P6B120]","HTC One M8 Harman Kardon (Sprint) [ONEM8HKE]","HTC One Max (AT&T)","HTC One Max (Sprint)","HTC One Max (Unlocked)","HTC One Max (Verizon)","HTC One S (T-Mobile)","HTC One S (Unlocked)","HTC One SV (Boost)","HTC One SV (Unlocked)","HTC One V (AT&T)","HTC One V (CricKet)","HTC One V (Unlocked)","HTC One V (Virgin Mobile)","HTC One VX (AT&T)","HTC One X (AT&T)","HTC One X (Rogers)","HTC One X (Unlocked)","HTC One X+ (AT&T)","HTC One X+ (Telus)","HTC One X+ (Unlocked)","HTC One XL (Unlocked)","HTC One mini (AT&T)","HTC One mini (Unlocked)","HTC Radar (Unlocked)","HTC Radar 4G (T-Mobile)","HTC Rezound (Verizon)","HTC Rhyme (Verizon)","HTC Salsa (AT&T)","HTC Sensation (Unlocked)","HTC Sensation 4G (T-Mobile)","HTC Sensation XE (Unlocked)","HTC Sensation XL (Unlocked)","HTC Status (AT&T)","HTC Surround (AT&T)","HTC Thunderbolt (Verizon)","HTC Tilt 2 (AT&T)","HTC Titan (AT&T)","HTC Titan II (AT&T)","HTC Trophy (Verizon)","HTC Vivid (AT&T)","HTC Wildfire (Unlocked)","HTC Wildfire S (T-Mobile)","HTC Wildfire S (Unlocked)","HTC Windows Phone 8S (Unlocked)","Hewlett-Packard","Hisense","Hisense Sero 7 Pro (Wi-Fi)","Huawei","Huawei Ascend (CricKet)","Huawei Ascend II (CricKet)","Huawei Ascend Mate (Unlocked)","Huawei Ascend Mate2 4G (Unlocked)","Huawei Ascend P6 (Unlocked)","Huawei Ascend Y (Net10)","Huawei Fusion (AT&T)","Huawei Fusion 2 (AT&T)","Huawei Honor 2 (Unlocked)","Huawei Ideos U8800 X5 (Unlocked)","Huawei Ideos U9000 X6 (Unlocked)","Huawei Impulse 4G (AT&T)","Huawei Mercury (CricKet)","Huawei Premia 4G (Metro PCS) [M931]","Huawei Valiant (Metro PCS)","Huawei myTouch (T-Mobile)","Huawei myTouch Q (T-Mobile)","JXD S7300b (Wi-Fi)","Jolla Jolla (Unlocked)","Kajeet","Kyocera","Kyocera Echo (Kajeet)","Kyocera Echo (Sprint)","Kyocera Hydro (Boost)","Kyocera Hydro (CricKet)","Kyocera Hydro Edge (Boost)","Kyocera Hydro Edge (CricKet)","Kyocera Hydro Edge (Sprint)","Kyocera Hydro Elite (Verizon)","Kyocera Hydro XTRM (T-Mobile)","Kyocera Rise (Sprint)","Kyocera Rise (Virgin Mobile)","Kyocera Torque (Sprint)","Kyocera Zio (CricKet)","LG","LG Ally (Verizon)","LG Connect 4G (Metro PCS)","LG Escape (AT&T)","LG Esteem (Metro PCS)","LG G Flex (AT&T)","LG G Flex (Sprint)","LG G Flex (T-Mobile)","LG G Flex (Unlocked)","LG G Pad 8.3 (Verizon)","LG G Pad 8.3 (Wi-Fi)","LG G Pad 8.3 Google Edition (Wi-Fi)","LG G Pro 2 (AT&T) [F350]","LG G Pro 2 (Sprint) [F350]","LG G Pro 2 (T-Mobile) [F350]","LG G Pro 2 (Unlocked) [F350]","LG G Pro 2 (Verizon) [F350]","LG G Watch (Smart Watch)","LG G2 (AT&T) [D800]","LG G2 (Claro) [D801]","LG G2 (Sprint) [LS980]","LG G2 (T-Mobile) [D801]","LG G2 (Unlocked) [D802]","LG G2 (Verizon) [VS980]","LG G2X (T-Mobile)","LG G3 (AT&T) [D850]","LG G3 (Sprint) [LS990]","LG G3 (T-Mobile) [D851]","LG G3 (Unlocked) [D855]","LG G3 (Unlocked) [F400]","LG G3 (Verizon) [VS985]","LG GT540 Optimus (Unlocked)","LG Intuition (Verizon)","LG Lucid 2 (Verizon)","LG Lucid 3 (Verizon) [VS876]","LG Lucid 4G (Verizon)","LG Mach (Sprint)","LG Majestic (US Cellular)","LG Marquee (Boost)","LG Marquee (Sprint)","LG Marquee (Virgin Mobile)","LG Motion (Metro PCS)","LG Nitro HD (AT&T)","LG Optimus 2X (Unlocked)","LG Optimus 3D (Unlocked)","LG Optimus 4X HD (AT&T)","LG Optimus 7 (Unlocked)","LG Optimus Black (Other)","LG Optimus C (CricKet)","LG Optimus Elite (Kajeet)","LG Optimus Elite (Sprint)","LG Optimus Elite (Virgin Mobile)","LG Optimus F3 (Metro PCS)","LG Optimus F3 (T-Mobile)","LG Optimus F3 (Virgin Mobile)","LG Optimus F6 (Metro PCS)","LG Optimus F6 (Other)","LG Optimus F6 (T-Mobile)","LG Optimus F7 (Boost)","LG Optimus G (AT&T)","LG Optimus G (Sprint)","LG Optimus G (Unlocked)","LG Optimus G Pro (AT&T)","LG Optimus G Pro (Unlocked)","LG Optimus L3 E400 (Unlocked)","LG Optimus L5 (Unlocked)","LG Optimus L5 II (Unlocked) [E460]","LG Optimus L7 (Unlocked)","LG Optimus L7 II Dual (Unlocked) [P715]","LG Optimus L9 (Metro PCS)","LG Optimus L9 (T-Mobile)","LG Optimus L9 II (T-Mobile) [D605]","LG Optimus L90 (T-Mobile) [D405]","LG Optimus M (Metro PCS)","LG Optimus M+ (Metro PCS)","LG Optimus ME P350 (Unlocked)","LG Optimus One (Telus)","LG Optimus Q (TracFone)","LG Optimus S (Kajeet)","LG Optimus S (Sprint)","LG Optimus Slider (Kajeet)","LG Optimus Slider (Virgin Mobile)","LG Optimus T (T-Mobile)","LG Optimus U (US Cellular)","LG Optimus V (Virgin Mobile)","LG Optimus Vu (Unlocked)","LG Prada 3.0 (Unlocked)","LG Revolution (Verizon)","LG Spectrum (Verizon)","LG Spectrum 2 (Verizon)","LG Thrill 4G (AT&T)","LG Thrive (AT&T)","LG Viper 4G LTE (Sprint)","LG Volt (Boost) [LS740]","LG Vortex (Verizon)","LG myTouch (T-Mobile)","LG myTouch Q (T-Mobile)","Lava XOLO X900 (Unlocked)","Lenovo","Lenovo A820 (Unlocked)","Lenovo IdeaPad K1 (Other)","Lenovo IdeaTab S6000 (Unlocked)","Lenovo Ideatab A2107 (Wi-Fi)","Lenovo Ideatab Miix 10 (Wi-Fi)","Lenovo K860 IdeaPhone (Other)","Lenovo K900 (Unlocked)","Lenovo Miix2 (Wi-Fi)","Lenovo ThinkPad 8 (Wi-Fi)","Lenovo Thinkpad Tablet (Other)","Lenovo Vibe Z K910 (Unlocked)","Lenovo Yoga Tablet 10 (Wi-Fi)","Lenovo Yoga Tablet 10+  (Wi-Fi)","Martian Notifier (Smart Watch)","Maylong m150 Universe (Other)","Meizu","Meizu MX (Unlocked)","Meizu MX2 (Unlocked)","Meizu MX3 (Unlocked)","Metro PCS","Microsoft","Microsoft Surface 2 (AT&T)","Microsoft Surface 2 (Wi-Fi)","Microsoft Surface Pro (Wi-Fi)","Microsoft Surface Pro 2 (Wi-Fi)","Microsoft Surface Pro 3 (Wi-Fi)","Microsoft Surface RT (Wi-Fi)","Moto E (Unlocked) [XT1021]","Moto G (AIO)","Moto G (Boost)","Moto G (Republic Wireless)","Moto G (Verizon)","Moto G Google Edition (Unlocked)","Moto G International (Unlocked)","Moto G LTE (Unlocked)","Moto G US (Unlocked)","Moto X (AT&T) [XT1058]","Moto X (America Movil) [XT1058]","Moto X (EE) [XT1052]","Moto X (Republic Wireless) [XT1049]","Moto X (Sprint) [XT1056]","Moto X (US Cellular) [XT1055]","Moto X (Unlocked) [XT1053]","Moto X (Verizon) [XT1060]","Moto X Developer Edition (Unlocked) [XT1053]","Moto X Developer Edition (Verizon)","Motorola","Motorola Admiral (Sprint)","Motorola Atrix 2 4G (AT&T)","Motorola Atrix 4G (AT&T)","Motorola Atrix 4G (Bell (Canada))","Motorola Atrix HD (AT&T)","Motorola Backflip (AT&T)","Motorola Backflip (Telus)","Motorola Bravo (AT&T)","Motorola CLIQ (T-Mobile)","Motorola CLIQ 2 (T-Mobile)","Motorola CLIQ XT (Rogers)","Motorola CLIQ XT (T-Mobile)","Motorola Charm (T-Mobile)","Motorola Citrus (Verizon)","Motorola DEXT (Bell (Canada))","Motorola Defy (Republic Wireless)","Motorola Defy (T-Mobile)","Motorola Defy+ (T-Mobile)","Motorola Devour (Verizon)","Motorola Droid (Verizon)","Motorola Droid 2 (Verizon)","Motorola Droid 2 Global (Unlocked)","Motorola Droid 2 Global (Verizon)","Motorola Droid 3 (Verizon)","Motorola Droid 4 (Verizon)","Motorola Droid Bionic (Verizon)","Motorola Droid Pro (Verizon)","Motorola Droid R2-D2 (Verizon)","Motorola Droid X (Verizon)","Motorola Droid X2 (Verizon)","Motorola Droid Xyboard 10.1 (Verizon)","Motorola Droid Xyboard 10.1 (Wi-Fi)","Motorola Droid Xyboard 8.2 (Verizon)","Motorola Droid Xyboard 8.2 (Wi-Fi)","Motorola Electrify (US Cellular)","Motorola Electrify 2 (US Cellular)","Motorola Electrify M (US Cellular)","Motorola FLIPSIDE (AT&T)","Motorola Flipout (AT&T)","Motorola Milestone (Telus)","Motorola Milestone (Unlocked)","Motorola Milestone Plus (Other)","Motorola Milestone XT720 (Unlocked)","Motorola MotoActv (Smart Watch)","Motorola Photon 4G (Sprint)","Motorola Photon Q LTE (Sprint)","Motorola Razr HD (Unlocked)","Motorola Razr Maxx (Unlocked)","Motorola Razr V (Unlocked) [XT885]","Motorola Razr i (Unlocked)","Motorola Triumph (Virgin Mobile)","Motorola XOOM (Verizon)","Motorola XOOM (Wi-Fi)","Motorola XOOM Family Edition (Wi-Fi)","Motorola XPRT (Sprint)","Motorola Xoom 2 (Wi-Fi)","Motorola Xoom 2 3G (Unlocked)","Motorola Xoom 2 Media Edition (Wi-Fi)","Motorola i1 (Boost)","Motorola i1 (Sprint)","Nabi 2 (Wi-Fi)","Net10","NextBook Premium7 (Other)","Nexus 10 (Wi-Fi)","Nexus 4 (Unlocked)","Nexus 5 (Sprint)","Nexus 5 (Unlocked)","Nexus 5 International (Unlocked)","Nexus 7 2012 (Wi-Fi)","Nexus 7 2012 GSM (Unlocked)","Nexus 7 2013 (Wi-Fi)","Nexus 7 2013 LTE (Unlocked)","Nexus 7 2013 LTE (Verizon)","Nexus One (Unlocked)","Nexus S (Unlocked)","Nexus S 4G (Sprint)","Nokia","Nokia Lumia 1020 (AT&T)","Nokia Lumia 1020 (Unlocked)","Nokia Lumia 1320 (CricKet)","Nokia Lumia 1520 (AT&T)","Nokia Lumia 1520 (Unlocked)","Nokia Lumia 2520 (AT&T) [RX-114]","Nokia Lumia 2520 (Verizon) [RX-114]","Nokia Lumia 520 (AT&T)","Nokia Lumia 521 (T-Mobile)","Nokia Lumia 620 (Unlocked)","Nokia Lumia 630 (CricKet)","Nokia Lumia 635 (T-Mobile) [RM-974]","Nokia Lumia 710 (T-Mobile)","Nokia Lumia 710 (Unlocked)","Nokia Lumia 720 (Unlocked)","Nokia Lumia 800 (AT&T)","Nokia Lumia 800 (Unlocked)","Nokia Lumia 810 (T-Mobile)","Nokia Lumia 820 (AT&T)","Nokia Lumia 822 (Verizon)","Nokia Lumia 900 (AT&T)","Nokia Lumia 920 (AT&T)","Nokia Lumia 920 (Unlocked)","Nokia Lumia 925 (AT&T)","Nokia Lumia 925 (T-Mobile)","Nokia Lumia 928 (Verizon)","Nokia Lumia 930 (Unlocked)","Nokia Lumia Icon (Verizon)","Nokia N9 (Unlocked)","Nook Color (Other)","Nook HD (Wi-Fi)","Nook HD+ (Wi-Fi)","Nook Tablet (Other)","Notion Ink Adam (Wi-Fi)","Nvidia","Nvidia Shield (Wi-Fi)","Nvidia Shield Tablet (Wi-Fi)","Nvidia Shield Tablet LTE (Unlocked)","Omate TrueSmart (Smart Watch)","OnePlus","OnePlus One (Unlocked)","OnePlus One Chinese Edition (Unlocked)","Oppo","Oppo Find 5 (Unlocked)","Oppo Find 7 (Unlocked)","Oppo Find 7a (Unlocked)","Oppo Finder (Unlocked)","Oppo N1 (Unlocked)","Oppo R819 (Unlocked)","Orange","Other","Pantech","Pantech Breakout (Verizon)","Pantech Burst (AT&T)","Pantech Crossover (AT&T)","Pantech Discover (AT&T)","Pantech Element (AT&T)","Pantech Flex (AT&T)","Pantech Marauder (Verizon)","Pantech Pocket (AT&T)","Pebble","Pebble Steel (Smart Watch)","Pebble Watch (Smart Watch)","Qualcomm","Qualcomm Toq (Smart Watch) [ToqSW1]","Quanta Corp","Razr XT910 (Unlocked)","Republic Wireless","Rogers","Samsung","Samsung ATIV 700T (Wi-Fi)","Samsung ATIV S (Unlocked)","Samsung ATIV S Neo (AT&T)","Samsung ATIV S Neo (Sprint)","Samsung ATIV SE (Verizon)","Samsung ATIV Smart PC 500T (Wi-Fi)","Samsung Acclaim (US Cellular)","Samsung Admire (Metro PCS)","Samsung Behold II (T-Mobile)","Samsung Captivate (AT&T)","Samsung Captivate Glide (AT&T) [SGH-I927]","Samsung Conquer 4G (Sprint)","Samsung Continuum (Verizon)","Samsung Dart (T-Mobile)","Samsung Droid Charge (Verizon)","Samsung Epic 4G (Sprint)","Samsung Exhibit 2 4G (T-Mobile)","Samsung Exhibit 4G (T-Mobile)","Samsung Fascinate (Verizon)","Samsung Focus (AT&T)","Samsung Focus 2 (AT&T)","Samsung Focus Flash (AT&T)","Samsung Focus S (AT&T)","Samsung Galaxy (Bell (Canada))","Samsung Galaxy Ace (Other)","Samsung Galaxy Ace 2 (Unlocked)","Samsung Galaxy Ace II x (Unlocked)","Samsung Galaxy Ace Plus (Unlocked)","Samsung Galaxy Admire (US Cellular)","Samsung Galaxy Admire 2 (CricKet)","Samsung Galaxy Admire 4G (Metro PCS)","Samsung Galaxy Apollo (Unlocked)","Samsung Galaxy Aviator 4G (US Cellular)","Samsung Galaxy Camera (AT&T)","Samsung Galaxy Camera (Unlocked)","Samsung Galaxy Camera (Verizon)","Samsung Galaxy Camera (Wi-Fi)","Samsung Galaxy Centura (Straight Talk)","Samsung Galaxy Exhibit (Metro PCS)","Samsung Galaxy Exhilarate 4G (AT&T)","Samsung Galaxy Express (AT&T)","Samsung Galaxy Fit (Other)","Samsung Galaxy Gear (Smart Watch)","Samsung Galaxy Gio (Other)","Samsung Galaxy Grand (Unlocked)","Samsung Galaxy Grand 2 (Unlocked) [SM-G7105]","Samsung Galaxy Indulge (Metro PCS)","Samsung Galaxy Legend (Verizon)","Samsung Galaxy Light (T-Mobile)","Samsung Galaxy Mega (AT&T) [SGH-I527]","Samsung Galaxy Mega (Metro PCS) [SGH-M819]","Samsung Galaxy Mega (Sprint) [SPH-L600]","Samsung Galaxy Mega (US Cellular)","Samsung Galaxy Mega 5.8 (Unlocked) [SGH-I9150]","Samsung Galaxy Mega 6.3 (Unlocked) [SGH-I9200]","Samsung Galaxy Mega 6.3 LTE (Unlocked) [SGH-I9205]","Samsung Galaxy Mini (Unlocked)","Samsung Galaxy Note (AT&T) [SGH-i717]","Samsung Galaxy Note (T-Mobile)","Samsung Galaxy Note (Unlocked)","Samsung Galaxy Note 10.1 (Unlocked)","Samsung Galaxy Note 10.1 (Verizon)","Samsung Galaxy Note 10.1 (Wi-Fi)","Samsung Galaxy Note 10.1 2014 (Unlocked)","Samsung Galaxy Note 10.1 2014 (Verizon)","Samsung Galaxy Note 10.1 2014 (Wi-Fi)","Samsung Galaxy Note 10.1 2014 LTE (Unlocked)","Samsung Galaxy Note 3  (Claro) [N900W8]","Samsung Galaxy Note 3 (AT&T) [N900A]","Samsung Galaxy Note 3 (Sprint) [N900P]","Samsung Galaxy Note 3 (T-Mobile) [N900T]","Samsung Galaxy Note 3 (US Cellular)","Samsung Galaxy Note 3 (Unlocked) [N9000]","Samsung Galaxy Note 3 (Unlocked) [N900W8]","Samsung Galaxy Note 3 (Verizon) [N900V]","Samsung Galaxy Note 3 Dual SIM (Unlocked) [N9002]","Samsung Galaxy Note 3 LTE (Unlocked) [N9005]","Samsung Galaxy Note 8 (AT&T)","Samsung Galaxy Note 8 (Telus)","Samsung Galaxy Note 8 (Unlocked)","Samsung Galaxy Note 8 (Wi-Fi)","Samsung Galaxy Note II (AT&T) [SGH-i317]","Samsung Galaxy Note II (Sprint) [SPH-L900]","Samsung Galaxy Note II (T-Mobile) [SGH-T889]","Samsung Galaxy Note II (US Cellular) [SCH-R950]","Samsung Galaxy Note II (Unlocked) [GT-N7100]","Samsung Galaxy Note II (Unlocked) [SGH-i317M]","Samsung Galaxy Note II (Verizon) [SCH-i605]","Samsung Galaxy Note II LTE (Unlocked) [GT-N7105]","Samsung Galaxy Note Pro 12.2 (Unlocked) [SM-P901]","Samsung Galaxy Note Pro 12.2 (Verizon) [SM-P905v]","Samsung Galaxy Note Pro 12.2 (Wi-Fi) [SM-P900]","Samsung Galaxy Note Pro 12.2 LTE (Unlocked) [SM-P905]","Samsung Galaxy Player 4.0 (Other)","Samsung Galaxy Player 4.2 (Wi-Fi)","Samsung Galaxy Player 5.0 (Other)","Samsung Galaxy Precedent (Straight Talk)","Samsung Galaxy Prevail (Boost)","Samsung Galaxy Prevail 2 (Boost)","Samsung Galaxy Proclaim (Straight Talk)","Samsung Galaxy R (Unlocked)","Samsung Galaxy Reverb (Virgin Mobile)","Samsung Galaxy Rugby Pro (AT&T)","Samsung Galaxy Rush (Boost)","Samsung Galaxy S 4 (AT&T) [SGH-I337]","Samsung Galaxy S 4 (Bell (Canada)) [SGH-I337m]","Samsung Galaxy S 4 (C-Spire) [SCH-R970X]","Samsung Galaxy S 4 (Cellcom) [SCH-I545L]","Samsung Galaxy S 4 (CricKet) [SCH-R970C]","Samsung Galaxy S 4 (CricKet) [SGH-I337Z]","Samsung Galaxy S 4 (Metro PCS) [SGH-M919N]","Samsung Galaxy S 4 (Rogers) [SGH-I337m]","Samsung Galaxy S 4 (Sprint) [SPH-L720T]","Samsung Galaxy S 4 (Sprint) [SPH-L720]","Samsung Galaxy S 4 (T-Mobile) [SGH-M919]","Samsung Galaxy S 4 (Telus) [SGH-I337m]","Samsung Galaxy S 4 (Ting)","Samsung Galaxy S 4 (US Cellular) [SCH-R970]","Samsung Galaxy S 4 (Unlocked) [SGH-I9506]","Samsung Galaxy S 4 (Verizon) [SCH-I545]","Samsung Galaxy S 4 Active (AT&T) [SGH-I537]","Samsung Galaxy S 4 Active (Unlocked) [SGH-I9295]","Samsung Galaxy S 4 Dual-SIM (Unlocked) [SGH-i9502]","Samsung Galaxy S 4 Google Edition (Unlocked) [GT-i9505G]","Samsung Galaxy S 4 International (Unlocked) [SGH-i9500]","Samsung Galaxy S 4 LTE (Unlocked) [SGH-I9505]","Samsung Galaxy S 4 Mini (Sprint)","Samsung Galaxy S 4 Mini (US Cellular)","Samsung Galaxy S 4 Mini (Unlocked)","Samsung Galaxy S 4 Mini (Verizon)","Samsung Galaxy S 4 Mini LTE (Unlocked)","Samsung Galaxy S 4 Zoom (AT&T)","Samsung Galaxy S 4 Zoom (Unlocked)","Samsung Galaxy S 4G (T-Mobile)","Samsung Galaxy S 5 (AT&T) [SM-G900A]","Samsung Galaxy S 5 (Boost)","Samsung Galaxy S 5 (Metro PCS) [SM-G900T1]","Samsung Galaxy S 5 (Sprint) [SM-G900P]","Samsung Galaxy S 5 (T-Mobile) [SM-G900T]","Samsung Galaxy S 5 (US Cellular) [SM-G900R4]","Samsung Galaxy S 5 (Unlocked) [SM-G900F]","Samsung Galaxy S 5 (Unlocked) [SM-G900H]","Samsung Galaxy S 5 (Unlocked) [SM-G900W8]","Samsung Galaxy S 5 (Unlocked) [SM-G900i]","Samsung Galaxy S 5 (Verizon) [SM-G900V]","Samsung Galaxy S 5 (Virgin Mobile) [SM-G900P]","Samsung Galaxy S 5 (Vodafone) [SM-G900M]","Samsung Galaxy S 5 Active (AT&T) [SM-G870A]","Samsung Galaxy S 5 LTE-A (Unlocked)","Samsung Galaxy S Advance (Unlocked)","Samsung Galaxy S Blaze 4G (T-Mobile)","Samsung Galaxy S Captivate (Rogers)","Samsung Galaxy S Duos (Unlocked)","Samsung Galaxy S Fascinate (Telus)","Samsung Galaxy S I9000 (Other)","Samsung Galaxy S II (AT&T) [SGH-I777]","Samsung Galaxy S II (Straight Talk)","Samsung Galaxy S II (T-Mobile) [SGH-T989]","Samsung Galaxy S II (US Cellular) [SCH-R760]","Samsung Galaxy S II (Virgin Mobile) [i9210]","Samsung Galaxy S II GT-I9100 (Unlocked) [GT-I9100]","Samsung Galaxy S II HD LTE (Unlocked)","Samsung Galaxy S II SHW-M250K (Unlocked)","Samsung Galaxy S II Skyrocket (AT&T)","Samsung Galaxy S III (AT&T) [SGH-I747]","Samsung Galaxy S III (Boost) [SCH-S960L]","Samsung Galaxy S III (C-Spire)","Samsung Galaxy S III (CricKet) [SCH-R530]","Samsung Galaxy S III (Metro PCS) [SCH-R530]","Samsung Galaxy S III (Metro PCS) [SGH-T999N]","Samsung Galaxy S III (Other)","Samsung Galaxy S III (Rogers) [SGH-I747M]","Samsung Galaxy S III (Sprint) [SPH-L710]","Samsung Galaxy S III (Straight Talk) [SCH-S968C]","Samsung Galaxy S III (T-Mobile) [SGH-T999]","Samsung Galaxy S III (US Cellular) [SCH-R530]","Samsung Galaxy S III (Verizon) [SCH-I535]","Samsung Galaxy S III (Virgin Mobile) [SCH-S960L]","Samsung Galaxy S III International (Unlocked) [GT-I9300]","Samsung Galaxy S III Korea (Other)","Samsung Galaxy S III LTE (T-Mobile) [SGH-T999L]","Samsung Galaxy S III LTE (Unlocked) [GT-I9305]","Samsung Galaxy S III Mini (AT&T)","Samsung Galaxy S III Mini (US Cellular)","Samsung Galaxy S III Mini (Unlocked)","Samsung Galaxy S III Mini (Verizon)","Samsung Galaxy S M110S (Unlocked)","Samsung Galaxy S Plus i9001 (Unlocked)","Samsung Galaxy S Relay (T-Mobile) [T699]","Samsung Galaxy S Relay 4G (T-Mobile)","Samsung Galaxy S Vibrant (Bell (Canada))","Samsung Galaxy S i9000 (Unlocked)","Samsung Galaxy SL i9003 (Unlocked)","Samsung Galaxy Stellar (Verizon)","Samsung Galaxy Stratosphere II (Verizon)","Samsung Galaxy Tab (AT&T)","Samsung Galaxy Tab (Sprint)","Samsung Galaxy Tab (T-Mobile)","Samsung Galaxy Tab (Verizon)","Samsung Galaxy Tab 10.1 (LE) (Google)","Samsung Galaxy Tab 10.1 (T-Mobile)","Samsung Galaxy Tab 10.1 (US Cellular)","Samsung Galaxy Tab 10.1 (Unlocked)","Samsung Galaxy Tab 10.1 (Verizon)","Samsung Galaxy Tab 10.1 (Wi-Fi)","Samsung Galaxy Tab 2 10.1 (AT&T)","Samsung Galaxy Tab 2 10.1 (Sprint)","Samsung Galaxy Tab 2 10.1 (T-Mobile)","Samsung Galaxy Tab 2 10.1 (Unlocked)","Samsung Galaxy Tab 2 10.1 (Wi-Fi)","Samsung Galaxy Tab 2 7.0 (Unlocked)","Samsung Galaxy Tab 2 7.0 (Verizon)","Samsung Galaxy Tab 2 7.0 (Wi-Fi)","Samsung Galaxy Tab 3 10.1 (Unlocked)","Samsung Galaxy Tab 3 10.1 (Wi-Fi)","Samsung Galaxy Tab 3 10.1 LTE (Unlocked)","Samsung Galaxy Tab 3 7 (AT&T)","Samsung Galaxy Tab 3 7 (Sprint)","Samsung Galaxy Tab 3 7 (T-Mobile)","Samsung Galaxy Tab 3 7 (Unlocked)","Samsung Galaxy Tab 3 7 (Wi-Fi)","Samsung Galaxy Tab 3 7 LTE (Unlocked)","Samsung Galaxy Tab 3 8 (Unlocked)","Samsung Galaxy Tab 3 8 (Wi-Fi)","Samsung Galaxy Tab 3 8 LTE (Unlocked)","Samsung Galaxy Tab 4 10.1 (Unlocked) [SM-T531]","Samsung Galaxy Tab 4 10.1 (Wi-Fi) [SM-T530]","Samsung Galaxy Tab 4 10.1 LTE (Unlocked) [SM-T535]","Samsung Galaxy Tab 4 7 (Unlocked) [SM-T231]","Samsung Galaxy Tab 4 7 (Wi-Fi) [SM-T230]","Samsung Galaxy Tab 4 7 LTE (Unlocked) [SM-T235]","Samsung Galaxy Tab 4 8 (Unlocked) [SM-T331]","Samsung Galaxy Tab 4 8 (Wi-Fi) [SM-T330]","Samsung Galaxy Tab 4 8 LTE (Unlocked) [SM-T335]","Samsung Galaxy Tab 7.0 Plus (T-Mobile)","Samsung Galaxy Tab 7.0 Plus (Unlocked)","Samsung Galaxy Tab 7.0 Plus (Wi-Fi)","Samsung Galaxy Tab 7.7 (Unlocked)","Samsung Galaxy Tab 7.7 (Verizon)","Samsung Galaxy Tab 7.7 (Wi-Fi)","Samsung Galaxy Tab 8.9 (AT&T)","Samsung Galaxy Tab 8.9 (Wi-Fi)","Samsung Galaxy Tab 8.9 GSM (Unlocked)","Samsung Galaxy Tab GSM (Unlocked)","Samsung Galaxy Tab Pro 10.1 (Wi-Fi)","Samsung Galaxy Tab Pro 12.2 (Wi-Fi) [SM-T9000]","Samsung Galaxy Tab Pro 12.2 3G (Unlocked) [SM-T900]","Samsung Galaxy Tab Pro 12.2 LTE (Unlocked) [SM-T905]","Samsung Galaxy Tab Pro 8.4 (Wi-Fi) [SM-T320]","Samsung Galaxy Tab Pro 8.4 LTE (Unlocked) [SM-T325]","Samsung Galaxy Tab S 10.5 (Wi-Fi)","Samsung Galaxy Tab S 8.4 (Wi-Fi)","Samsung Galaxy Tab Wi-Fi (Other)","Samsung Galaxy Victory (Sprint)","Samsung Galaxy Victory (Virgin Mobile)","Samsung Galaxy W (Unlocked)","Samsung Galaxy Y (Unlocked)","Samsung Gear 2 (Smart Watch)","Samsung Gear 2 Neo (Smart Watch)","Samsung Gear Fit (Smart Watch)","Samsung Gear Live (Smart Watch)","Samsung Gem (US Cellular)","Samsung Gem (Verizon)","Samsung Gravity Smart (T-Mobile)","Samsung Illusion (Verizon)","Samsung Indulge (CricKet)","Samsung Infuse 4G (AT&T)","Samsung Intercept (Kajeet)","Samsung Intercept (Sprint)","Samsung Intercept (Virgin Mobile)","Samsung Mesmerize (US Cellular)","Samsung Moment (Sprint)","Samsung Odyssey (Verizon)","Samsung Omnia 7 (Unlocked)","Samsung Replenish (Sprint)","Samsung Rugby Smart (AT&T)","Samsung SHV-E120L Galaxy S II HD LTE (Unlocked Non-US)","Samsung Series 7 Slate (Wi-Fi)","Samsung Stratosphere (Verizon)","Samsung Transfix (CricKet)","Samsung Transform (Sprint)","Samsung Transform Ultra (Boost)","Samsung Transform Ultra (Sprint)","Samsung Vibrant (T-Mobile)","Samsung Vitality (CricKet)","Sanyo","Sanyo Zio (Sprint)","Sharp","Sharp Aquos SH-02D (Other)","Sharp FX Plus (AT&T)","Sharp SH7218U (Unlocked)","Sidekick 4G (T-Mobile)","Skytex","Skytex Imagine 7 (Other)","Smart Watch","Sony","Sony Ericsson Xperia Pro (Unlocked)","Sony Smartwatch 2 (Smart Watch)","Sony Tablet S (Wi-Fi)","Sony VAIO Tap 11 (Wi-Fi)","Sony Xperia Acro S (Unlocked)","Sony Xperia Advance (Unlocked)","Sony Xperia E (Unlocked) [C1504]","Sony Xperia E Dual SIM (Unlocked) [C1605]","Sony Xperia Go (Unlocked)","Sony Xperia Ion (AT&T)","Sony Xperia Ion (Unlocked)","Sony Xperia Neo (Unlocked)","Sony Xperia P (Unlocked)","Sony Xperia PLAY (AT&T)","Sony Xperia PLAY (Other)","Sony Xperia PLAY (Verizon)","Sony Xperia S (Unlocked)","Sony Xperia SL (Unlocked)","Sony Xperia SP (Unlocked) [C5302]","Sony Xperia SP LTE (Unlocked) [C5303]","Sony Xperia T (Unlocked)","Sony Xperia TL (AT&T)","Sony Xperia TX (Unlocked)","Sony Xperia Tablet S (Wi-Fi)","Sony Xperia Tablet S 3G (Unlocked)","Sony Xperia Tablet Z (Wi-Fi)","Sony Xperia Tablet Z LTE (Unlocked)","Sony Xperia U (Unlocked)","Sony Xperia V (Unlocked) [LT25i]","Sony Xperia X1 (Unlocked)","Sony Xperia X10 Mini (Unlocked)","Sony Xperia Z (T-Mobile)","Sony Xperia Z (Unlocked) [C6602]","Sony Xperia Z Ultra (Unlocked)","Sony Xperia Z Ultra Google Edition (Unlocked)","Sony Xperia Z1 (Unlocked) [C6903]","Sony Xperia Z1 Compact (Unlocked)","Sony Xperia Z1S (T-Mobile)","Sony Xperia Z2 (Unlocked)","Sony Xperia Z2 Tablet (Verizon)","Sony Xperia Z2 Tablet (Wi-Fi)","Sony Xperia ZL (Unlocked)","Sony Xperia sola (Unlocked)","Sony-Ericsson","Sprint","Straight Talk","T-Mobile","T-Mobile Comet (T-Mobile)","T-Mobile Concord (T-Mobile)","T-Mobile G-Slate (T-Mobile)","T-Mobile Prism (T-Mobile)","T-Mobile Prism II (T-Mobile)","T-Mobile SpringBoard (T-Mobile)","T-Mobile UK","Telus","Ting","Toshiba","Toshiba Excite 10 (Wi-Fi)","Toshiba Excite 7.7 (Unlocked)","Toshiba Excite Pro (Wi-Fi)","Toshiba Folio 100 (Unlocked)","Toshiba Thrive 10 (Wi-Fi)","Toshiba Thrive 7 (Wi-Fi)","TracFone","US Cellular","Unlocked","Unlocked Non-US","Vea Buddy Bluetooth Watch (Smart Watch)","Verizon","Verizon Ellipsis 7 (Verizon)","Viewsonic","Viewsonic Viewpad 7 (Unlocked)","Viewsonic gTablet (Other)","Virgin Mobile","Vodafone","Wearable","Wi-Fi","Xiaomi","Xiaomi MI-3 (TD) (Unlocked)","Xiaomi MI-3 (WCDMA) (Unlocked)","Xiaomi MI-One (Unlocked)","Xiaomi MI-One S (Unlocked)","Xiaomi Mi-2 (Unlocked)","Xiaomi Mi-2A (Unlocked)","Xiaomi Mi-2S (Unlocked)","Xolo","Xperia Arc (Unlocked)","Xperia Ray (Unlocked)","Xperia X10 (AT&T)","Xperia X10 (Rogers)","Xperia X10 (Unlocked)","Xperia X10 (Vodafone)","Xperia X8 (Unlocked)","ZTE","ZTE Awe (Virgin Mobile)","ZTE Blade (Unlocked)","ZTE Chorus (CricKet)","ZTE Flash (Sprint)","ZTE Force (Boost)","ZTE Force (Sprint)","ZTE Grand Memo (Unlocked) [V9815]","ZTE Grand S (Unlocked)","ZTE Max (Boost) [N9520]","ZTE Open (Unlocked)","ZTE Optik (Sprint) [V55]","ZTE Origin (Unlocked)","ZTE Score (CricKet)","ZTE Source (CricKet)","ZTE Supreme (Virgin Mobile)","ZTE Vital (Sprint)","ZTE Warp (Boost)","ZTE Warp 4G (Boost)","Zeki","Zeki 7 inch Tablet (Wi-Fi) [TB782B]","myTouch 3G (T-Mobile)","myTouch 3G Fender (T-Mobile)","myTouch 3G Slide (T-Mobile)","myTouch 4G (T-Mobile)","myTouch Slide 4G (T-Mobile)"
];

var defaultNames = [
    "Donut","Penguin","Stumpy","Whicker","Shadow","Howard","Wilshire","Darling","Disco","Jack","The Bear","Sneak","The Big L","Whisp","Wheezy","Crazy","Goat","Pirate","Saucy","Hambone","Butcher","Walla Walla","Snake","Caboose","Sleepy","Killer","Stompy","Mopey","Dopey","Weasel","Ghost","Dasher","Grumpy","Hollywood","Tooth","Noodle","King","Cupid","Prancer"
];
//
//setInterval(function () {
//    console.log("playlists: ", JSON.stringify( playlists, null, 2 ) );
////   console.log("sockets: ", io.sockets);
//}, 3000);

function makeplid() {
    var text = "";
    var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789";
    for (var i = 0; i < 4; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

io.sockets.on('connection', function (socket) {

    this.plid = '';

    console.log("CLIENT CONNECTED: " + socket.id);

//
//    TODO: flesh this out:
//    socket.on('playlist:add', function(data){
//        //todo: hash playlist after adding / removing a song so we can send it whenever requested by the client
//    })


    //todo: this is super dangerous. we shouldn't let clients push playlist:sync commands :(
    //this just gets us up and running fast.
    socket.on('playlist:sync', function(data){
        if (this.plid){
            console.log(" PLID")
            playlists[this.plid].songs = [];
            for (i=0; i<data.playlist.length; i++){
                playlists[this.plid].songs.push({
                    ext_id: data.playlist[i].ext_id,
                    title: data.playlist[i].title
                })
            }
            for (key in playlists[this.plid].clients) {
                io.sockets.socket(key).emit('playlist:sync', playlists[this.plid].songs);
            }
        } else {
            console.log("error, no PLID")
        }
    });


    socket.on('playlist:play', function(data){
        //todo: some logic could go here to prevent abuse.
        // ...maybe a counter to log number of song plays / client
        for (key in playlists[this.plid].clients) {
            io.sockets.socket(key).emit('playlist:play', data);
        }
    });

    socket.on('playlist:toggleplayback', function(data){
        playlists[this.plid].isPlaying = data;
        for (key in playlists[this.plid].clients) {
            io.sockets.socket(key).emit('playlist:toggleplayback', data);
        }
    });

    socket.on('playlist:playing', function(data){
        playlists[this.plid].playing = data;
        for (key in playlists[this.plid].clients) {
            io.sockets.socket(key).emit('playlist:playing', data);
        }
    });

    socket.on('client:newpin', function () {
        //todo: actually store this new pin in a cache somewhere
        socket.emit('client:newpin', Math.floor((Math.random() * 10000)));
    });

    socket.on('client:authenticate', function (data) {
        console.log("AUTHENTICATING:");

        //associate plid with the socket
        var plid = this.plid = data.plid;
        if(plid == ''){
            //todo: delay the generation of new plid until user adds a song
            plid = makeplid()
            while (typeof playlists[plid] != 'undefined')
                plid = makeplid()
            socket.emit('playlist:newplid', plid);
        }

        if (typeof playlists[plid] == 'undefined') {
            playlists[plid] = {
                clients: {},
                songs  : []
            };
        }

        //todo: only if a PIN has been used and was correct
        for (key in playlists[plid].clients) {
            io.sockets.socket(key).emit('client:newpin', Math.floor((Math.random() * 10000)));
        }

        //todo: set cookie if not set (pin or not)
        // if password || pin:
        var permissions = 'rw';
        //else
        var permissions = 'r';






        var ua = this.handshake.headers['user-agent'];     // user-agent header from an HTTP request

        var uaResult = parser.setUA(ua).getResult();
        console.log(uaResult.os);
        var model = uaResult.device.model,
            browser = uaResult.browser,
            os = uaResult.os;

        var genericModelName;
        for (i in phoneModels){
            if (phoneModels[i].indexOf( '[' + model + ']' ) >= 0){
                genericModelName = phoneModels[i].split('[')[0];
            }
        }

        genericModelName = genericModelName || model;
        var name = defaultNames[Math.floor(Math.random() * (defaultNames.length))];


        for (key in playlists[plid].clients) {
            io.sockets.socket(key).emit('client:add', {
                model: genericModelName,
                browser  : browser,
                os       : os,
                name     : name
            });
        }

        playlists[plid].clients[socket.id] = {
            permissions   : permissions,
            remote_address: socket.handshake.address.address,
            remote_port   : socket.handshake.address.port,
            version       : data.version,
            model         : genericModelName,
            browser       : browser,
            os            : os,
            name          : name
        };

        console.log("client:authenticate: ", data);

        if (playlists[plid].songs.length > 0){
            socket.emit('playlist:sync', playlists[plid].songs);
            //TODO: also check that the below properties exist.
            var playing = playlists[plid].playing;
            //playing.stored = true; //todo: surely there's a cleaner way?
            socket.emit('playlist:playing', playing);
            socket.emit('playlist:toggleplayback', playlists[plid].isPlaying);
        }
    });

    socket.on('search:query', function(data){
        if (typeof data.query != "undefined"){
            var query = data.query;
            if (typeof search[query] == "undefined"){
                var options = {
                    url: "http://gdata.youtube.com/feeds/api/videos?q="+query+"&alt=json&start-index=1&max-results=25&v=2",
                    json: true
                }
                if (!query){
                    console.log(search[query]);
                    socket.emit('search:results', search[query]);
                } else {
                    request.get(options, function (error, response, body) {
        //                console.log(JSON.stringify( body, null, 2 ));
        //                console.log(body.feed.openSearch$totalResults.$t)
                        if (!error){
                            if (body.feed.openSearch$totalResults.$t > 0) {
                                search[query] = [];
                                if (typeof body.feed.entry != 'undefined') {
                                    for (i = 0; i < body.feed.entry.length; i++) {
                                        search[query].push({
                                            title: body.feed.entry[i].title.$t,
                                            ext_id: body.feed.entry[i].media$group.yt$videoid.$t
                                        });
                                    }
                                }
                            } else {
                                search[query] = [{
                                    title: "No results found...",
                                    subtitle: "Instead, here's a baby panda",
                                    ext_id: "FzRH3iTQPrk"
                                }];
                            }
                            console.log(search[query]);
                            socket.emit('search:results', search[query]);
                        } else {
                            console.log("response: "+response, "body: "+body);
                            //throw new Error("possible error parsing json? .. error: "+error);
                        }
                    })
                }
            } else {
                console.log(search[query]);
                socket.emit('search:results', search[query]);
            }
        } else {
            console.log(search[query]);
            socket.emit('search:results', []);
        }
    });




    socket.on('disconnect', function () {

//        delete playlists[this.plid].clients[this.id];
    })


});
