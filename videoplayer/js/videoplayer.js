var ver_check = "Player: videoplayer js updated on 08 - 12 - 2017 | 19:11";
console.log(ver_check);
/*
<div id="videoPlayerObj" style="
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(255,255,255,0.0);
    z-index: 99;
"></div>
*/
function makePlayer(id, external_vd, external_config) {
    var dashplayer;
    var firstAd=true;
    var protData = {};
    var spd;
    var isLiveTest = false;
    var QUALITY_SWITCHING_STATE = "SWITCHED";
    var playerState = "IDLE";
    if (typeof lap_verCheck == 'function') {
        lap_verCheck(ver_check);
    }
    //---------CHECK DOMAIN CODE--------------
    var locationProtocol = location.protocol;
    var seekstart = 0;
    var adErrorCount = 0;
    var adErrorCountMax = 1;
    var tracking_url = locationProtocol + "//ping.hungama.com/eventTracker.js";
    var new_tracking_url = locationProtocol + "//ping.hungama.com/mediaEvent.py";
    var playhungama_tracking_url = "//ping.hungama.com/addTracker.py";
    var config = {
        vd: {},
        withCredentials:true,
        extraParam: {
            backup: '', //"assets/21ETjILN-1753141.mp4",
            viewingTime: -1,
            rentStatus: false,
            rentPrice: 0,
            showPlayIcon: false
        },
        loginStatus: true,
        "spd_extra": {
            "thumb_width": "120px",
            "thumb_height": "69px",
            "gap_in_secs": "10",
            "thumbs_in_one_sprite": "48",
            "thumb_col_count": "12",
            "thumb_row_count": "4"
        },
        userQuality: 'auto',
        subscribeStatus: true,
        loadTime: 0,
        errorMessage: "",
        seeked: false,
        seekCount: 0,
        pauseCount: 0,
        playTime: 0,
        pauseTime: 0,
        idleTime: 0,
        bufferTime: 0,
        playertype: "movie",
        playerContainer: "",
        controls: true,
        subscriptionPrice: 299,
        autoStart: false,
        userInactiveTimer: -1,
        mute: true,
        playTimeInterval: 0,
        pauseTimeInterval: 0,
        idleTimeInterval: 0,
        bufferTimeInterval: 0,
        userInactiveTimeOut: 0,
        property: "HUNGAMA",
        platform: "WEB",
        notifyAutoPlaySec: 10,
        notifyAutoPlayText: "Starts in",
    };
    $.extend(true, config, external_config);
    var vd = {
        "file": "",
        "mediaid": "1",
        "title": "",
        "albumname": "",
        "type": "",
        "image": "",
        "imagethumb": "",
        "genre": "",
        "lang": "",
        "year": "",
        "contenttype": "",
        "ad_setup": {
            "client": "googima",
            "tag": ""
        },
        "dashprotection":{
            "key":"",
            "keytype":"widewine"
        },
        "tracks": [{
            "file": "",
            "label": "English",
            "kind": "captions",
            "default": true
        }],
        "spd": {
            "sprite_image_path": [{
                    "path": ""
                },
                {
                    "path": ""
                }
            ]
        }
    }
    $.extend(true, vd, external_vd);
    var hls;
    var adplayed = false;
    var apn_received = false;
    var vplayerWidth = 0;
    var vplayerHeight = 0;
    var downloaded = false;
    var dev = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    var isApple = (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()));
    var hlsconfig = {
        //startLevel: 2,
        autoStartLoad: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 30,
        xhrSetup: function(xhr, url) {
            xhr.withCredentials = config.withCredentials; // do send cookies
        }
    };
    var playerControlTimeout = 0;
    var mobile_hide_ctrls_timer;
    var element = $("#" + id);
    var preserve = {
        volume: 80
    };
    var hls = new Hls(hlsconfig);
    config.vd = vd;
    vplayerWidth = element.width();
    vplayerHeight = (vplayerWidth / 16) * 9;
    var skinHtml = '<div id="hun_vp" class="videoPlayer player" style="overflow:hidden;width:' + vplayerWidth + 'px;height:' + vplayerHeight + 'px; background:#000;"><div id="adContainer" style="overflow:hidden;width:100%;height:100%; position: absolute;top:0px;left:0px;z-index:99;"></div><!--<button is="google-cast-button" id="castbutton"></button>--><div class="bg_logo"></div><div class="thumb"></div><div class="liveRibbon"><img src="http://player.hungama.com/lap/images/liveplayer.png" alt="live"/></div><video id="videoPlayerObj" width="' + vplayerWidth + '" height="' + vplayerHeight + '"  src="' + vd.file + '" poster="' + vd.image + '"></video><div><a href="javascript:;" class="jw-playBtn replysub"><i class="icon-ic_play-84"></i></a></div><div id="loadingVideo" class="loadersmall"></div><div class="vp_skin mouseout"> <div class="playerProgressbar"> <div class="bufferBar"></div> <div id="playerProgressbar"></div> </div> <div class="playerControls left"> <ul class="playerControlbar"> <li><a href="javascript:void(0);" class="playerControlbtn btnPre_30"><i class="playerIcons icon-ic_replay30_1-49"></i></a><a href="javascript:void(0);" class="playerControlbtn btnPre"><i class="icon-ic_previous-86"></i></a></li> <li><a href="javascript:void(0);" class="playerControlbtn jw_play btnPlay"><i class="icon-ic_play-84"></i></a> </li> <li><a href="javascript:void(0);" class="playerControlbtn btnNxt_30"><i class="icon-ic_forward_30_1-50"></i></a><a href="javascript:void(0);" class="playerControlbtn btnNxt"><i class="icon-ic_next-87"></i></a></li> <li> <div class="timeBar"><span class="jw_position">0:00</span> <span class="jw_dash">/</span> <span class="jw_duration">0:00</span> </div> </li> </ul> </div> <div class="playerControls right clearfix"> <ul class="playerControlbar"><li><span class="space"></span></li> <li class="customBar"> <a href="javascript:void(0);" class="playerControlbtn jw_favourite"><i class="icon-ic_favourite_1-46" id="hpjw_fav"></i></a> </li><li class="mp4"> <a href="javascript:void(0);" class="playerControlbtn jw_download"><i class="icon-ic_mp4-73-73"></i></a> </li><li class="volumebar"><div class="soundControlbar"><div id="soundControlbar"></div></div><a href="javascript:void(0);" class="playerControlbtn jw_volume"><i class="playerIcons btnVolume icon-ic_volume_1-37"></i></a></li><li class="settingbar"><a href="javascript:void(0);" class="playerControlbtn jp-settings jw_settings" style="display:none;"><i class="playerIcons icon-ic_settings_1-09"></i></a><div class="settingbox"><div class="inner"><ul class="setmb"><li class="clearfix" id="jw_autoplay_li"><div class="setleft">Autoplay</div><div class="setright"><input type="checkbox" name="onoffswitch1" id="autoPlaySwitch" checked></div></li><li class="clearfix jw_subtitle"><div class="setleft">Subtitles</div><div class="setright"><a href="javascript:;">Off <span class="arw"></span></a></div></li><li class="clearfix vdoQuality" style="display:none;"><div class="setleft">Quality</div><div class="setright"><a href="javascript:;" class="setquality">Auto <span class="arw"></span></a></div></li></ul></div></div><div class="captionbox" style="height: auto;"><a class="captionback" href="javascript:;"><span class="arw-lft"></span> Caption</a><ul class="captionList"></ul></div><div class="qualitybox"><a href="javascript:;" class="qualiback"><span class="arw-lft"></span> Quality</a><ul class="qualityList"> <li> <div> <input type="radio" id="auto" name="radio"/> <label for="auto"><span></span>Auto</label> </div></li></ul></</li><li class="resizebar"><a href="javascript:void(0);" class="playerControlbtn jw_resize"><i class="btnResize icon-ic_fullscreen-52"></i></a> </li></ul></div></div><a href="javascript:void(0);" class="jw-cast-icon icon-ic_cast"></a></div>';
    element.html(skinHtml);
    getPlayType();
    if (isApple) {
        element.find('.bg_logo').hide();
        element.find('#videoPlayerObj').attr("controls", true);
    }
    element.find('.jw-cast-icon').hide();
    checkDomain(id, element);

    videoPlayerObj = document.getElementById('videoPlayerObj');
    
    videoPlayerObj.addEventListener("loadedmetadata", function() {
        var captionTxt = "";
        element.find("video track").remove();
        if (config.vd.tracks.length > 0) {
            if (config.vd.tracks[0].file.length > 0) {
                $("#hun_vp").find("video").attr("crossOrigin", "anonymous");
                $("#hun_vp").find("video").attr("preload", "metadata");
                element.find('.jw_settings').css("display", "inline-block");
                console.log("Player: subtiles src " + config.vd.tracks[0].file);
                element.find('.jw_subtitle').show();
                element.find('.captionbox .captionList').html(captionTxt);
                captionTxt += '<li data-index="-1"> <div> <input type="radio" name="radio" id="Off"> <label for="Off"><span></span>Off</label></div></li>';
                for (var i = 0; i < config.vd.tracks.length; i++) {
                    track = document.createElement("track");
                    track.label = config.vd.tracks[i].label;
                    track.kind = config.vd.tracks[i].kind;
                    track.srclang = "en";
                    track.src = config.vd.tracks[i].file;
                    if (config.vd.tracks[i].default) {
                        track.default = true;
                        element.find('.jw_subtitle .setright a').html(config.vd.tracks[i].label + '<span class="arw"></span>');
                    }
                    track.addEventListener("load", function() {
                        this.mode = "showing";
                        videoPlayerObj.textTracks[0].mode = "showing"; // thanks Firefox
                    });
                    this.appendChild(track);
                    captionTxt += '<li data-index="' + i + '"> <div> <input type="radio" name="radio" id="' + config.vd.tracks[i].label + '"> <label for="' + config.vd.tracks[i].label + '"><span></span>' + config.vd.tracks[i].label + '</label></div></li>';
                }
                element.find('.captionbox .captionList').html(captionTxt);
                element.find('.captionbox .captionList li').click(function() {
                    var captionIndex = $(this).attr("data-index");
                    var captionTxt = $(this).find('input').attr("id") + '<span class="arw"></span>';
                    if (captionIndex == -1) {
                        for (var i = 0; i < videoPlayerObj.textTracks.length; i++) {
                            videoPlayerObj.textTracks[i].mode = "hidden";
                        }
                    } else {
                        videoPlayerObj.textTracks[captionIndex].mode = "showing";
                    }
                    element.find('.settingbox').removeClass('setshow');
                    element.find('.captionbox').removeClass('setqual');
                    element.find('.jw_subtitle .setright a').html(captionTxt);
                });
            }
        }
    });

    function thumbnail_preview() {
        spd = config.vd.spd;
        var spd_extra = config.spd_extra;
        if (spd.sprite_image_path[0].path.length > 0 && dev==false) {
            element.find(".playerProgressbar").hover(
                function(e) {
                    element.find(".thumb").css("display", "block");
                    element.find(".thumb").css("width", spd_extra.thumb_width);
                    element.find(".thumb").css("height", spd_extra.thumb_height);
                    $(this).on("mousemove", function(e) {
                        e.stopPropagation();
                        var width = $(this).width();
                        var offset = $(this).offset();
                        var value = Math.round(((e.pageX - offset.left) / width) * (100 - 0)) + 0;
                        var sec = ((getDuration() * value) / 100);
                        var e3 = Math.floor(sec / (spd_extra.thumbs_in_one_sprite * spd_extra.gap_in_secs));
                        var btm = element.find(".vp_skin").height() + 5;
                        element.find(".thumb").css("bottom", btm + "px");
                        var thunbHalfWidth = (element.find(".thumb").width() / 2);
                        var xPosOfMainDiv = element.find("#hun_vp").offset().left;
                        var left = e.pageX - thunbHalfWidth - xPosOfMainDiv;
                        var lastX = (element.find("#hun_vp").width() - (thunbHalfWidth * 2)) - 6;
                        if (left < 6) {
                            left = 6;
                        }
                        if (left > lastX) {
                            left = lastX;
                        }
                        element.find(".thumb").css("left", left + "px");
                        element.find(".thumb").css("background-image", "url(" + spd.sprite_image_path[e3].path + ")");
                        var d0 = Math.floor(sec / spd_extra.thumbs_in_one_sprite);
                        var d1 = Math.floor((sec - (d0 * spd_extra.thumbs_in_one_sprite)));
                        var d2 = Math.floor(d1 / spd_extra.gap_in_secs);
                        var cur_x = d2 * parseInt(spd_extra.thumb_width);
                        var e1 = Math.floor(sec / (spd_extra.gap_in_secs * spd_extra.thumb_col_count));
                        var e2 = e1 % spd_extra.thumb_row_count;
                        var cur_y = e2 * parseInt(spd_extra.thumb_height);
                        element.find(".thumb").css('background-position', '-' + cur_x + 'px -' + cur_y + 'px');
                    });
                },
                function(e) {
                    element.find(".thumb").css("display", "none");
                }
            );
        }
    }

    element.find('.jw_subtitle').click(function() {
        element.find('.settingbox').removeClass('setshow');
        element.find('.captionbox').addClass('setqual');
    });
    $('.captionback').on("click", function(e) {
        e.preventDefault();
        element.find('.settingbox').addClass('setshow');
        element.find('.captionbox').removeClass('setqual');
    });
    /*--------------------------AD CODE--------------*/
    element.find("#adContainer").hide();
    var adContent = document.getElementById("adContainer");
    var adsManager;
    var adDisplayContainer;
    var isAdRunning=false;
    var adt_adTagPresent=false;
    var adt_adImpre=false;
    var adt_adStart=false;
    var adt_adError=false;
    var contentInitialized = false;
    var adsLoaded = false;
    var adDisplayContainer = new google.ima.AdDisplayContainer(adContent, videoPlayerObj);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsRequest = new google.ima.AdsRequest();

    var contentEndedListener = function() {
        adsLoader.contentComplete();
    };

    function startAds() {
        console.log("Player: startAds");
        //alert("Player: startAds");
        if (typeof jw_adPlaying == 'function') {
            jw_adPlaying();
        }
        try {
            
            adsManager.init(vplayerWidth, vplayerHeight, google.ima.ViewMode.NORMAL);
            adsManager.start();
        } catch (adError) {
            //videoPlayerObj.play();
            // An error may be thrown if there was a problem with the VAST response.
        }
    }
    videoPlayerObj.addEventListener('loadedmetadata',function() {
        console.log("Player: loadedmetadata called");
        contentInitialized = true;
        if (adsLoaded) {
            console.log("Player: calling startAds");
            startAds();
        }
    });
          
    function pauseAd() {
        adsManager.pause();
        console.log("Player: Ad Pause Called");
        if (typeof jw_adPaused == 'function') {
            jw_adPaused();
        }
    }

    function requestAds() {
        adt_adTagPresent=true;
        if (!adplayed && !firstAd && isApple) {
            console.log("Player: requestAds apple");
            
            //alert("Player: requestAds");
            showPreloader();
            
            adplayed = true;
            adDisplayContainer.initialize();
            
            adsRequest.adTagUrl = vd.ad_setup.tag;
            videoPlayerObj.onended = contentEndedListener;
            adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
            adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
            adsRequest.linearAdSlotWidth = vplayerWidth;
            adsRequest.linearAdSlotHeight = vplayerHeight;
            adsRequest.nonLinearAdSlotWidth = vplayerWidth;
            adsRequest.nonLinearAdSlotHeight = 150;
            if (adsRequest.adTagUrl.length > 0) {
                adsLoader.requestAds(adsRequest);
            }
        }else if(!adplayed && !isApple){
            console.log("Player: requestAds android");
            //alert("Player: requestAds");
            showPreloader();
           
            adplayed = true;
            adDisplayContainer.initialize();
            
            adsRequest.adTagUrl = vd.ad_setup.tag;
            videoPlayerObj.onended = contentEndedListener;
            adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
            adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
            adsRequest.linearAdSlotWidth = vplayerWidth;
            adsRequest.linearAdSlotHeight = vplayerHeight;
            adsRequest.nonLinearAdSlotWidth = vplayerWidth;
            adsRequest.nonLinearAdSlotHeight = 150;
            if (adsRequest.adTagUrl.length > 0) {
                adsLoader.requestAds(adsRequest);
            }
        }else{
            firstAd=false;
            //alert("Player: else requestAds");
            if (vd.type == "hls") {
                console.log("Player: hls type");
                hls.destroy();
                hls = new Hls(hlsconfig);
                addHlsEvents();
                playHlsMedia();
            } else if (vd.type == "dash") {
                console.log("Player: dash type");
                setUpDash();
            }else {
                console.log("Player: mp4 type");
                videoPlayerObj.src = vd.file;
                videoPlayerObj.play();
            }
        }
    }

    function onAdError(adErrorEvent) {
        adt_adError=true;
        isAdRunning=false;
        adPlay = 0;
        console.log("Player: onAdError");
        destroyAds();
        if (adErrorCount < adErrorCountMax) {
            console.log("Player: onAdError");
            adplayed = false;
            if (typeof jw_adError == 'function') {
                jw_adError();
            }
            adErrorCount++;
        }
    }
    function destroyAdAndVideo() {
        isAdRunning=false;
        if (adsManager) {
            clearInterval(adTimeInterval);
            adTimeInterval=null;
            adsManager.destroy();
            //$("#adContainer").hide();
            //$("#adContainer").html('');
        }
        if (vd.type == "hls") {
            hls.destroy();
        } else if (vd.type == "dash") {
            dashplayer.reset();
        } else {
            videoPlayerObj.removeAttribute("src");
        }
        console.log("Player: destroyed Ad and video.");
    }

    function destroyAds() {
        isAdRunning=false;
        console.log("Player: destroyAds");
        if (adsManager) {
            adsManager.destroy();
            //adsManager=null;
        }
        clearInterval(adTimeInterval);
        adTimeInterval = null;
        adRemainingTime = 0;
        //$("#adContainer").hide();
        //$("#adContainer").html('');
        showPreloader();
        if (vd.type == "hls") {
            hls.destroy();
            hls = new Hls(hlsconfig);
            addHlsEvents();
            playHlsMedia();
        } else if (vd.type == "dash") {
            setUpDash();
        }else if (vd.type == "mp4") {
            if(isApple){        
                videoPlayerObj.src = vd.file;
            }
            videoPlayerObj.play();
        }
        videoPlayerObj.currentTime = 0;
        var forcePlay = setInterval(function() {
            if (videoPlayerObj.paused) {
                videoPlayerObj.play();
                adplayed = true;
            } else {
                clearInterval(forcePlay);
            }
        }, 250);
    }

    function onAdComplete(adCompleteEvent) {
        isAdRunning=false;
        console.log("Player: onAdComplete");
        destroyAds();
        if (typeof jw_adComplete == 'function') {
            jw_adComplete();
        }
    }

    function onAdSkipped(adSkippedEvent) {
        isAdRunning=false;
        console.log("Player: onAdSkipped");
        destroyAds();
        if (typeof jw_adSkipped == 'function') {
            jw_adSkipped();
        }
    }

    function onAdImpression() {
        adt_adImpre=true;
        console.log("Player: onAdImpression");
        //alert("Player: onAdImpression");
        showPreloader();
        videoPlayerObj.removeEventListener('ended', contentEndedListener);
        if(isApple==false){
            videoPlayerObj.pause();
        }
        element.find(".jw-playBtn").hide();
        adPlay = 1;
        if (typeof jw_adStart == 'function') {
            jw_adStart();
        }
    }
    var adTimeInterval = null;
    var adRemainingTime = 0;

    function onAdStarted() {
        adt_adStart=true;
        console.log("Player: onAdStarted");
        isAdRunning=true;
        //alert("Player: onAdStarted");
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			//console.log("here notfullscreen");
			resizePlayer(element.find(".videoPlayer").width());
        }else{
            console.log("here fullscreen");
			resizePlayer($(window).width());
        }
        if(isApple==false){
            element.find('#loadingVideo').hide();
            $("#adContainer").show();
            adTimeInterval = setInterval(function() {
                if(adsManager.getRemainingTime()>0){
                    $("#adContainer").find('#adRem').remove();
                    $("#adContainer").append("<p id='adRem' style='background:rgba(33,33,33,.8);color:#fff; position:absolute; bottom:10px; right:0px; left:0px; padding: 0.5em; font-size:12px; font-family: Arial,Helvetica,sans-serif; font-size: .75em;font-style: normal;font-weight: 400;color: #fff;font-variant: normal;font-stretch: normal;'>This ad will end in " + Math.round(adsManager.getRemainingTime()) + " seconds.</p>");
                    $("#adContainer").show();
                    //console.log("Player: adTimeInterval adContainer show");
                }else if(vd.ad_setup.client=="googima"){
                    $("#adContainer").find('#adRem').remove();
                    clearInterval(adTimeInterval);
                    adTimeInterval=null;
                    $("#adContainer").show();
                }else{
                    clearInterval(adTimeInterval);
                    adTimeInterval=null;
                    $("#adContainer").hide();
                    console.log("Player: adTimeInterval adContainer hide");
                }
            }, 900);
        }
    }

    function onAdsManagerLoaded(adsManagerLoadedEvent) {
        console.log("Player: onAdsManagerLoaded");
        adsLoaded=true;
        adsManager = adsManagerLoadedEvent.getAdsManager(videoPlayerObj);
        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
        adsManager.addEventListener(google.ima.AdEvent.Type.IMPRESSION, onAdImpression, false);
        adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete, false);
        adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdSkipped, false);
        adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStarted, false);
        if (contentInitialized) {
            if (!videoPlayerObj.autoplay) {
                videoPlayerObj.play();
            }
            videoPlayerObj.pause();
            console.log("Player: calling startAds");
            startAds();
          }
    }
    /*--------------------------AD CODE ENDS--------------*/
    element.find("#playerProgressbar").slider({
        range: "min",
        min: 0,
        max: 100,
        step: 0.1,
        value: 2,
        stop: function(event, ui) {
            var perc = ((videoPlayerObj.duration * ui.value) / 100);
            videoPlayerObj.currentTime = perc;
            videoPlayerObj.play();
            config.seeked = true;
            config.seekCount++;
            element.find(".jw_play").addClass('btnPause');
            element.find(".jw_play").removeClass('btnPlay');
            element.find(".jw-playBtn").hide();
            if (typeof jw_seeked == 'function') {
                jw_seeked('video', vd.mediaid, seekstart, videoPlayerObj.currentTime);
            }
        },
        start: function(event, ui) {
            seekstart = videoPlayerObj.currentTime;
            if (typeof jw_seek == 'function') {
                jw_seek('video', vd.mediaid, seekstart);
            }
        },
        slide: function(event, ui) {
            var perc = ((videoPlayerObj.duration * ui.value) / 100);
            videoPlayerObj.currentTime = perc;
            videoPlayerObj.play();
            config.seeked = true;
        }
    });
    element.find("#soundControlbar").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: preserve.volume,
        slide: function(event, ui) {
            element.find(".volumePercent").text(ui.value);
            preserve.volume = ui.value;
            videoPlayerObj.volume = (ui.value / 100);
            if (ui.value < 1) {
                $(".btnVolume").addClass("icon-ic_mute_1-38");
            } else {
                $(".btnVolume").removeClass("icon-ic_mute_1-38");
            }
        }
    });
    $(document).on("click", '.onoffswitch-label', function() {
        if ($("#autoPlaySwitch").is(':checked')) {
            autoplay_bol = true;
        } else {
            autoplay_bol = false;
        }
        if (typeof jw_vid_autoplay_changed == 'function') {
            jw_vid_autoplay_changed(autoplay_bol);
        }
    });
    $("#autoPlaySwitch").on("change", function(e) {
        if ($(this).is(':checked')) {
            autoplay_bol = true;
        } else {
            autoplay_bol = false;
        }
        if (typeof jw_vid_autoplay_changed == 'function') {
            jw_vid_autoplay_changed(autoplay_bol);
        }
    });
    if (dev) {
        element.find(".volumebar").hide();
    }
    $(".liveRibbon").hide();
    getPlayType();
    if (config.mute) {
        videoPlayerObj.volume = 0;
        $(".btnVolume").addClass("icon-ic_mute_1-38");
        element.find("#soundControlbar").slider("value", preserve.volume);
    }
    videoPlayerObj.autoplay = config.autoStart;
    if (videoPlayerObj.autoplay && !dev) {
        if (vd.ad_setup.tag != "") {
            requestAds();
        }
    }

    function addHlsEvents() {
        if (Hls.isSupported()) {
            console.log("Player: hls supported");
            hls.on(Hls.Events.ERROR, function(event, data) {
                var errorType = data.type;
                var errorDetails = data.details;
                var errorFatal = data.fatal;
                console.log("Player: Error Occured");
                console.log("Player: Error Details: "+errorDetails);
                switch(data.details) {
                    /*****************NETWORK ERRORS********************/
                    case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_MANIFEST_LOAD_ERROR");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_MANIFEST_LOAD_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_MANIFEST_LOAD_TIMEOUT ");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_MANIFEST_LOAD_TIMEOUT");
                        }
                    break;
                    case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_MANIFEST_PARSING_ERROR ");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_MANIFEST_PARSING_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_LEVEL_LOAD_ERROR ");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_LEVEL_LOAD_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_LEVEL_LOAD_TIMEOUT");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_LEVEL_LOAD_TIMEOUT");
                        }
                    break;
                    case Hls.ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_AUDIO_TRACK_LOAD_ERROR");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_AUDIO_TRACK_LOAD_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_AUDIO_TRACK_LOAD_TIMEOUT");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_AUDIO_TRACK_LOAD_TIMEOUT");
                        }
                    break;
                    case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_FRAG_LOAD_ERROR");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_FRAG_LOAD_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_FRAG_LOAD_TIMEOUT");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_FRAG_LOAD_TIMEOUT");
                        }
                    break;
                    case Hls.ErrorDetails.KEY_LOAD_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_KEY_LOAD_ERROR");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_KEY_LOAD_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "NW_ER_KEY_LOAD_TIMEOUT");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "NW_ER_KEY_LOAD_TIMEOUT");
                        }
                    break;
                    /*****************MEDIA ERRORS********************/
                    case Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_MANIFEST_INCOMPATIBLE_CODECS_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_FRAG_LOOP_LOADING_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_FRAG_DECRYPT_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_FRAG_PARSING_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_ADD_CODEC_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_APPEND_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_APPENDING_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_STALLED_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_FULL_ERROR:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_FULL_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_SEEK_OVER_HOLE:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_SEEK_OVER_HOLE");
                        }
                    break;
                    case Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL:
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MD_ER_BUFFER_NUDGE_ON_STALL");
                        }
                    break;
                    /*****************MUX ERRORS********************/
                    case Hls.ErrorDetails.REMUX_ALLOC_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "MX_ER_REMUX_ALLOC_ERROR ");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "MX_ER_REMUX_ALLOC_ERROR");
                        }
                    break;
                    /*****************OTHER ERRORS********************/
                    case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "OTHER_ER_LEVEL_SWITCH_ERROR");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "OTHER_ER_LEVEL_SWITCH_ERROR");
                        }
                    break;
                    case Hls.ErrorDetails.INTERNAL_EXCEPTION:
                        if (typeof jw_mediaError == 'function') {
                            jw_mediaError('video', "OTHER_ER_INTERNAL_EXCEPTION");
                        }
                        if (typeof jw_mediaError_tracking == 'function') {
                            jw_mediaError_tracking('video', "OTHER_ER_INTERNAL_EXCEPTION");
                        }
                    break;
                }
                /*
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("Player: fatal network error encountered, try to recover, destroying current stream and sending a call for backup stream");
                            if (typeof jw_mediaError == 'function') {
                                jw_mediaError('video', "network error");
                            }
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            //console.log("fatal media error encountered, try to recover");
                            //hls.recoverMediaError();
                            break;
                        default:
                            console.log("Player: fatal media error encountered, destroying current stream and sending a call for backup stream");
                            hls.destroy();
                            if (typeof jw_mediaError == 'function') {
                                jw_mediaError('video', "other error");
                            }
                            break;
                    }
                }
                */
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                element.find('.setquality').html("Auto" + " <span class='arw'></span>");
                element.find(".qualityList").html("");
                element.find('.vdoQuality').hide();
                element.find('.jw_settings').hide();
                if (hls.levels.length > 0) {
                    if (typeof jw_level_fetched == 'function') {
                        jw_level_fetched(hls.levels);
                    }
                    var qArr = [];
                    var unique = [];
                    var qnArr = [];
                    var refQArr = ["144", "240", "360", "480", "720", "1080", "1440", "2160"];
                    //144p,240p,360p,480p,720p,1080p,1440p,2160p
                    element.find('.jw_settings').css("display", "inline-block");
                    element.find('.vdoQuality').show();
                    var lvl = hls.levels;
                    lvl.sort(function(a, b) {
                        return parseFloat(a.bitrate) - parseFloat(b.bitrate);
                    });
                    var resp = "";
                    var i = 0;
                    var arr_len = lvl.length;
                    if (arr_len == 1) {
                        element.find('.vdoQuality').hide();
                        resp += '<li data-index=' + lvl[0].index + '> <div> <input checked type="radio" id="' + lvl[0].height + 'p" name="radio"/> <label for="' + lvl[0].height + '"><span></span>' + lvl[0].height + 'p</label></div></li>';
                    } else if (arr_len > 1) {
                        element.find('.jw_settings').css("display", "inline-block");
                        element.find('.vdoQuality').show();

                        if (lvl[0].height == undefined || lvl[0].height == "undefined") {
                            console.log("Player: resolution not present, bitrate logic applied");
                            if (config.vd.contenttype == "movies") {
                                for (i = 0; i < arr_len; i++) {
                                    var bitrate = lvl[i].bitrate / 1000;
                                    console.log("Player: movie" + i + " bitrate: " + bitrate);
                                    if (bitrate >= 100 && bitrate < 400) {
                                        qArr.push(0);
                                    } else if (bitrate >= 400 && bitrate < 750) {
                                        qArr.push(1);
                                    } else if (bitrate >= 750 && bitrate < 1000) {
                                        qArr.push(2);
                                    } else if (bitrate >= 1000 && bitrate < 1600) {
                                        qArr.push(3);
                                    } else if (bitrate >= 1600 && bitrate < 3000) {
                                        qArr.push(4);
                                    } else if (bitrate >= 3000) {
                                        qArr.push(5);
                                    }
                                }
                            } else if (config.vd.contenttype == "videos") {
                                for (i = 0; i < arr_len; i++) {
                                    var bitrate = lvl[i].bitrate / 1000;
                                    console.log("Player: video" + i + " bitrate: " + bitrate);
                                    if (bitrate >= 144 && bitrate < 240) {
                                        qArr.push(0);
                                    } else if (bitrate >= 240 && bitrate < 360) {
                                        qArr.push(1);
                                    } else if (bitrate >= 360 && bitrate < 480) {
                                        qArr.push(2);
                                    } else if (bitrate >= 480 && bitrate < 576) {
                                        qArr.push(3);
                                    } else if (bitrate >= 576 && bitrate < 720) {
                                        qArr.push(4);
                                    } else if (bitrate >= 720 && bitrate < 1080) {
                                        qArr.push(5);
                                    } else if (bitrate >= 1080) {
                                        qArr.push(6);
                                    }
                                }
                            }
                            console.log("Player: before sorting");
                            console.log(qArr);
                            qArr.sort(function(a, b) {
                                return a - b
                            });
                            console.log("Player: sorted");
                            console.log(qArr);
                            unique = qArr.filter(function(elem, index, self) {
                                return index == self.indexOf(elem);
                            });
                            console.log("Player: after removing duplicates");
                            console.log(unique);
                            qnArr = [];
                            for (i = 0; i < unique.length; i++) {
                                qnArr.push(qArr.lastIndexOf(unique[i]));
                            }
                            qArr = qnArr;
                            console.log("Player: after stablilizing qualities");
                            console.log(qArr);
                            arr_len = qArr.length;
                            for (i = (arr_len - 1); i >= 0; i--) {
                                resp += '<li data-index=' + qArr[i] + '> <div> <input type="radio" id="' + refQArr[unique[i]] + 'p" name="radio"/> <label for="' + refQArr[unique[i]] + '"><span></span>' + refQArr[unique[i]] + 'p</label></div></li>'
                            }
                            console.dir(lvl);
                        } else {
                            qArr = [];
                            var ap = 16 / 9;
                            var vp = lvl[(arr_len - 1)].width / lvl[(arr_len - 1)].height;
                            var index = -1;
                            if (vp <= ap) {
                                for (i = 0; i < arr_len; i++) {
                                    console.log("Player:" + i + " height: " + lvl[i].height);
                                    if (lvl[i].height <= 144) {
                                        qArr.push(0);
                                    } else if (lvl[i].height > 144 && lvl[i].height <= 240) {
                                        qArr.push(1);
                                    } else if (lvl[i].height > 240 && lvl[i].height <= 360) {
                                        qArr.push(2);
                                    } else if (lvl[i].height > 360 && lvl[i].height <= 480) {
                                        qArr.push(3);
                                    } else if (lvl[i].height > 480 && lvl[i].height <= 720) {
                                        qArr.push(4);
                                    } else if (lvl[i].height > 720 && lvl[i].height <= 1080) {
                                        qArr.push(5);
                                    } else {
                                        qArr.push(6);
                                    }
                                }
                            } else {
                                for (i = 0; i < arr_len; i++) {
                                    console.log("Player:" + i + " width: " + lvl[i].width);
                                    if (lvl[i].width <= 256) {
                                        qArr.push(0);
                                    } else if (lvl[i].width > 256 && lvl[i].width <= 426) {
                                        qArr.push(1);
                                    } else if (lvl[i].width > 426 && lvl[i].width <= 640) {
                                        qArr.push(2);
                                    } else if (lvl[i].width > 640 && lvl[i].width <= 854) {
                                        qArr.push(3);
                                    } else if (lvl[i].width > 854 && lvl[i].width <= 1280) {
                                        qArr.push(4);
                                    } else if (lvl[i].width > 1280 && lvl[i].width <= 2560) {
                                        qArr.push(5);
                                    } else if (lvl[i].width > 2560 && lvl[i].width <= 3840) {
                                        qArr.push(6);
                                    }
                                }
                            }

                            console.log("Player: before sorting");
                            console.log(qArr);
                            qArr.sort(function(a, b) {
                                return a - b
                            });
                            console.log("Player: sorted");
                            console.log(qArr);
                            unique = qArr.filter(function(elem, index, self) {
                                return index == self.indexOf(elem);
                            });
                            console.log("Player: after removing duplicates");
                            console.log(unique);
                            qnArr = [];
                            for (i = 0; i < unique.length; i++) {
                                qnArr.push(qArr.lastIndexOf(unique[i]));
                            }
                            qArr = qnArr;
                            console.log("Player: after stablilizing qualities");
                            console.log(qArr);
                            arr_len = qArr.length;
                            for (i = (arr_len - 1); i >= 0; i--) {
                                resp += '<li data-index=' + qArr[i] + '> <div> <input type="radio" id="' + refQArr[unique[i]] + 'p" name="radio"/> <label for="' + refQArr[unique[i]] + '"><span></span>' + refQArr[unique[i]] + 'p</label></div></li>'
                            }
                        }
                        resp += '<li data-index="-1"> <div> <input checked type="radio" id="Auto" name="radio"/> <label for="auto"><span></span>Auto</label></div></li>';
                    }
                    element.find(".qualityList").html(resp);
                    element.find(".qualitybox").height("auto");
                    element.find(".qualityList li").click(function(e) {
                        hls.currentLevel = parseInt($(this).attr("data-index"));
                        var qualityTxt = $(this).find('input').attr("id");
                        $(this).find("input").attr("checked",true);
                        element.find('.setquality').html(qualityTxt + " <span class='arw'></span>");
                        element.find(".qualitybox").removeClass("setqual");
                        element.find('.icon-ic_settings_1-09').removeClass('actcol');
                    });
                    element.find('.settingbox').height("auto");
                }
                element.find('.jw-cast-icon').hide();
                element.find("#playerProgressbar").slider("value", 0);
            });
            hls.on(Hls.Events.FRAG_LOAD_PROGRESS, function(event, data) {
                var percb = ((data.frag.start / videoPlayerObj.duration) * 100);
                element.find(".bufferBar").css({
                    "width": percb + "%"
                });
            });
            hls.on(Hls.Events.LEVEL_SWITCHING, function(event, data) {
                QUALITY_SWITCHING_STATE = "INPROGRESS";
                playerState = "BUFFERING";
                console.log("Player: LEVEL_SWITCHING");
                //element.find('#loadingVideo').show();
            });
            hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data) {
                QUALITY_SWITCHING_STATE = "SWITCHED";
                console.log("Player: LEVEL_SWITCHED");
                console.log("Player: current level: " + hls.currentLevel);
                //element.find('#loadingVideo').hide();
            });
        }
    }
    if (isApple) {
        element.find(".vp_skin").hide();
        element.find(".jw-playBtn").hide();
        element.find("#loadingVideo").hide();
    }
    if (vd.type == "hls") {
        addHlsEvents();
        hls.loadSource(vd.file);
        hls.attachMedia(videoPlayerObj);
    } else if (vd.type == "dash") {
        setUpDash();
    }else if (vd.type == "mp4") {
        videoPlayerObj.src = vd.file;
        videoPlayerObj.load();
    }

    element.find('.jw_settings').click(function() {
        //element.find('.jw_subtitle').hide();
        element.find('.jw_autoplay_li').hide();
        //$(this).parent('li').find('.settingbox').toggleClass('setshow');
        
        if (element.find(".settingbox").hasClass("setshow")) {
            element.find(".settingbox").removeClass("setshow");
        } else {
            element.find('.captionbox').removeClass('setqual');
            if(!element.find(".qualitybox").hasClass("setqual")){
                element.find(".settingbox").addClass("setshow");
            }
        }
    });
    element.find('.setquality').click(function() {
        if (element.find(".qualitybox").hasClass("setqual")) {
            element.find(".qualitybox").removeClass("setqual");
        } else {
            element.find(".settingbox").removeClass("setshow");
            element.find(".qualitybox").addClass("setqual");
        }
    });
    element.find("#videoPlayerObj").click(function(event) {
        if (!dev) {
            if (element.find(".jw_play").hasClass("btnPlay")) {
                play();
            } else {
                pause();
            }
        } else {
            element.find('.vp_skin').removeClass('mouseout');
            //showCastIcon();
            if (mobile_hide_ctrls_timer)
                clearTimeout(mobile_hide_ctrls_timer);
            mobile_hide_ctrls_timer = setTimeout(function() {
                element.find('.vp_skin').addClass('mouseout');
                element.find('.jw-cast-icon').hide();
                element.find('.soundControlbar').removeClass("show");
                element.find(".qualitybox").removeClass("setqual");
                element.find('.captionbox').removeClass('setqual');
                element.find(".settingbox").removeClass("setshow");
            }, 8000);
        }
    });
    element.find(".jw-playBtn").click(function(event) {
        element.find('.vp_skin').addClass('mouseout');
        play();
    });
    element.find(".jw_play").click(function(event) {
        if ($(this).hasClass("btnPlay")) {
            play();
        } else {
            pause();
        }
    });
    function setUpDash(){
        if(vd.dashprotection.key.length>0){
            if(vd.dashprotection.keytype=='widevine'){
                vd.dashprotection.keytype = 'com.widevine.alpha';
            }else if(vd.dashprotection.keytype=='playready'){
                vd.dashprotection.keytype = 'com.microsoft.playready';
            }
            protData[vd.dashprotection.keytype] = {
                serverURL: vd.dashprotection.key
            };
        }
        dashplayer = dashjs.MediaPlayer().create();
        dashplayer.getDebug().setLogToBrowserConsole(false);
        if(vd.dashprotection.key.length>0){
            dashplayer.setProtectionData(protData);
        }
        dashplayer.initialize(videoPlayerObj, vd.file, true);
        dashplayer.on(dashjs.MediaPlayer.events.ERROR, function (e) {
            console.log("dash error");
        });
        dashplayer.on(dashjs.MediaPlayer.events.PLAYBACK_PROGRESS, function (e) {
            var bufferedVideo = videoPlayerObj.currentTime+dashplayer.getBufferLength();
            
            var percb = ((bufferedVideo / videoPlayerObj.duration) * 100);
            element.find(".bufferBar").css({
                "width": percb + "%"
            });
        });
        dashplayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function (e) {
            var lvl = dashplayer.getBitrateInfoListFor("video");
            if(lvl.length>0){
                element.find('.setquality').html("Auto" + " <span class='arw'></span>");
                element.find(".qualityList").html("");
                element.find('.vdoQuality').hide();
                element.find('.jw_subtitle').hide();
                element.find('.jw_settings').hide();
                if (typeof jw_level_fetched == 'function') {
                    jw_level_fetched(lvl);
                }
                var qArr = [];
                var unique = [];
                var qnArr = [];
                var refQArr = ["144", "240", "360", "480", "720", "1080", "1440", "2160"];
                element.find('.jw_settings').css("display", "inline-block");
                element.find('.vdoQuality').show();
                var resp = "";
                var i = 0;
                var arr_len = lvl.length;
                if (arr_len == 1) {
                    element.find('.vdoQuality').hide();
                    resp += '<li data-index=' + lvl[0].index + '> <div> <input checked type="radio" id="' + lvl[0].height + 'p" name="radio"/> <label for="' + lvl[0].height + '"><span></span>' + lvl[0].height + 'p</label></div></li>';
                } else if (arr_len > 1) {
                    element.find('.jw_settings').css("display", "inline-block");
                    element.find('.vdoQuality').show();
                    qArr = [];
                    var ap = 16 / 9;
                    var vp = lvl[(arr_len - 1)].width / lvl[(arr_len - 1)].height;
                    var index = -1;
                    if (vp <= ap) {
                        for (i = 0; i < arr_len; i++) {
                            //console.log("Player:" + i + " height: " + lvl[i].height);
                            if (lvl[i].height <= 144) {
                                qArr.push(0);
                            } else if (lvl[i].height > 144 && lvl[i].height <= 240) {
                                qArr.push(1);
                            } else if (lvl[i].height > 240 && lvl[i].height <= 360) {
                                qArr.push(2);
                            } else if (lvl[i].height > 360 && lvl[i].height <= 480) {
                                qArr.push(3);
                            } else if (lvl[i].height > 480 && lvl[i].height <= 720) {
                                qArr.push(4);
                            } else if (lvl[i].height > 720 && lvl[i].height <= 1080) {
                                qArr.push(5);
                            } else {
                                qArr.push(6);
                            }
                        }
                    } else {
                        for (i = 0; i < arr_len; i++) {
                            //console.log("Player:" + i + " width: " + lvl[i].width);
                            if (lvl[i].width <= 256) {
                                qArr.push(0);
                            } else if (lvl[i].width > 256 && lvl[i].width <= 426) {
                                qArr.push(1);
                            } else if (lvl[i].width > 426 && lvl[i].width <= 640) {
                                qArr.push(2);
                            } else if (lvl[i].width > 640 && lvl[i].width <= 854) {
                                qArr.push(3);
                            } else if (lvl[i].width > 854 && lvl[i].width <= 1280) {
                                qArr.push(4);
                            } else if (lvl[i].width > 1280 && lvl[i].width <= 2560) {
                                qArr.push(5);
                            } else if (lvl[i].width > 2560 && lvl[i].width <= 3840) {
                                qArr.push(6);
                            }
                        }
                    }

                    //console.log("Player: before sorting");
                    //console.log(qArr);
                    qArr.sort(function(a, b) {
                        return a - b
                    });
                    //console.log("Player: sorted");
                    //console.log(qArr);
                    unique = qArr.filter(function(elem, index, self) {
                        return index == self.indexOf(elem);
                    });
                    //console.log("Player: after removing duplicates");
                    //console.log(unique);
                    qnArr = [];
                    for (i = 0; i < unique.length; i++) {
                        qnArr.push(qArr.lastIndexOf(unique[i]));
                    }
                    qArr = qnArr;
                    //console.log("Player: after stablilizing qualities");
                    //console.log(qArr);
                    arr_len = qArr.length;
                    for (i = (arr_len - 1); i >= 0; i--) {
                        resp += '<li data-index=' + qArr[i] + '> <div> <input type="radio" id="' + refQArr[unique[i]] + 'p" name="radio"/> <label for="' + refQArr[unique[i]] + '"><span></span>' + refQArr[unique[i]] + 'p</label></div></li>'
                    }
                }
                resp += '<li data-index="-1"> <div> <input checked type="radio" id="Auto" name="radio"/> <label for="auto"><span></span>Auto</label></div></li>';
                element.find(".qualityList").html(resp);
                element.find(".qualitybox").height("auto");
                element.find(".qualityList li").click(function(e) {
                    var seltd=parseInt($(this).attr("data-index"));
                    if(seltd==-1){
                        dashplayer.setAutoSwitchQuality(true);
                    }else{
                        dashplayer.setAutoSwitchQuality(false);
                    }
                    console.log("seltd: "+seltd);
                    dashplayer.setQualityFor('video',seltd);
                    var qualityTxt = $(this).find('input').attr("id");
                    $(this).find("input").attr("checked",true);
                    element.find('.setquality').html(qualityTxt + " <span class='arw'></span>");
                    element.find(".qualitybox").removeClass("setqual");
                    element.find('.icon-ic_settings_1-09').removeClass('actcol');
                });
                element.find('.settingbox').height("auto");
            }
        });
    }
    function play() {
        videoPlayerObj.play();
        if (!adplayed){
            requestAds();
        }
        element.find(".jw_play").addClass('btnPause');
        element.find(".jw_play").removeClass('btnPlay');
        element.find(".jw-playBtn").hide();

    }

    function pause() {
        videoPlayerObj.pause();
        element.find('.vp_skin').removeClass('mouseout');
        element.find(".jw_play").addClass('btnPlay');
        element.find(".jw_play").removeClass('btnPause');
        if (!isApple) {
            element.find(".jw-playBtn").show();
        }
    }
    element.find("#videoPlayerObj").hover(function() {}, hoverOut);
    element.find("#vp_skin").hover(function() {
        clearTimeout(playerControlTimeout);
        playerControlTimeout = 0;
        element.find('.vp_skin').removeClass('mouseout');
    }, hoverOut);
    element.find("#videoPlayerObj").mousemove(hoverOver);
    element.find(".vp_skin").mousemove(hoverOver);
    element.find(".btnNxt").on("click", function(e) {
        /*
        if (typeof jw_events == 'function') {
            var eventType = 'override';
            var obj = [];
            obj.item_details = config.vd
            obj.player_type = 'video';
            jw_events(eventType, obj);
        }
        */
        prepareParams(config, "video", downloaded);
        if (typeof jw_video_player_next_button_clicked == 'function') {
            jw_video_player_next_button_clicked(0);
        }
    });
    element.find(".btnPre").on("click", function(e) {
        /*
        if (typeof jw_events == 'function') {
            var eventType = 'override';
            var obj = [];
            obj.item_details = config.vd
            obj.player_type = 'video';
            jw_events(eventType, obj);
        }
        */
        prepareParams(config, "video", downloaded);
        if (typeof jw_video_player_previous_button_clicked == 'function') {
            jw_video_player_previous_button_clicked(0);
        }
    });
    element.find(".jw_favourite").on("click", function(e) {
        if (typeof jw_Video_favourite == 'function') {
            jw_Video_favourite(vd.mediaid, vd.title);
        }
    });
    element.find(".jw_download").on("click", function(e) {
        if (typeof jw_Video_download == 'function') {
            downloaded = true;
            jw_Video_download(vd.mediaid, vd.title);
        }
    });

    function inArray(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle) return true;
        }
        return false;
    }

    function hoverOver() {
        clearTimeout(playerControlTimeout);
        playerControlTimeout = 0;
        element.find('.vp_skin').removeClass('mouseout');
        hoverOut();
    }

    function hoverOut() {
        if (playerControlTimeout == 0) {
            playerControlTimeout = setTimeout(function() {
                if (!element.find('.vp_skin').hasClass("mouseout")) {
                    clearTimeout(playerControlTimeout);
                    playerControlTimeout = 0;
                    element.find('.vp_skin').addClass('mouseout');
                    element.find(".settingbox").removeClass("setshow");
                    element.find(".qualitybox").removeClass("setqual");
                    element.find('.captionbox').removeClass('setqual');
                }
            }, 10000);
        }
    }

    function showPlay() {
        if (!isApple) {
            element.find(".jw-playBtn").show();
        }
    }

    function showPreloader() {
        element.find(".jw-playBtn").hide();
        if (!isApple) {
            element.find('#loadingVideo').show();
        }
    }

    function secondsToHms(d) {
        if (isNaN(d) == false) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
        }
    }
    element.find(".jw_resize").click(function(e) {
        fs();
    });

    function fs() {
        var elem = document.getElementById("hun_vp");
        var elem1 = document.getElementById("videoPlayerObj");
        $(this).find(".btnResize").toggleClass("icon-ic_fullscreen_exit-53");
        $(".jw_favourite, .jw_download").toggle();
        toggleFullScreen(elem);
    }
    
    function toggleFullScreen(elem) {
        if (isApple) {
            displayFullscreen("Safari", elem); // Safari browser
        } else {
            displayFullscreen("other", elem);
        }
        //setTimeout(function(){$(window).trigger('resize');},500);
        element.find('.vp_skin').addClass('mouseout');
        element.find('.jw-cast-icon').hide();
    }
    
    $(window).on('backbutton', function() {
        console.log("player: back pressed");
    });
    $(window).on("orientationchange", function() {
        console.log("player: orientationchange event tiggered");
        if($("#hun_vp").hasClass("playerFullScreen")){
            setTimeout(function(){alignVideo();},500);
        }
       
        if (isApple) {
            if (element.find(".videoPlayer").hasClass("jw_fullscreen")) {
                setTimeout(function() {
                    $("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").css("width", $(window).width() + "px");
                    $("#hun_vp").parent().css("width", $(window).width() + "px");
                    $("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").css("height", $(window).height() + "px");
                    $("#hun_vp").parent().css("height", $(window).height() + "px");
                    setTimeout(function() {
                        videoPlayerObj.play(true);
                    }, 500);
                }, 500);
            }
        }else{
			setTimeout(function(){resizePlayer();},500);
		}
    });

    function displayFullscreen(browserType, elem) {
        if (browserType == "Safari") {
            if (element.find(".videoPlayer").hasClass("jw_fullscreen")) {
                if (typeof jw_videoExitFS == 'function') {
                    jw_videoExitFS();
                }
                element.find(".videoPlayer").removeClass("jw_fullscreen");
                element.find(".videoPlayer").unwrap();
                $('body').removeClass("applefixed").remove('.appleOverlay');
                element.find(".videoPlayer").width(ow + "px");
                element.find(".videoPlayer").height(oh + "px");
                setTimeout(function() {
                    videoPlayerObj.play(true);
                    $(window).trigger("resize");
                }, 500);
                //videoPlayerObj.resize(ow, oh);
            } else {
                if (typeof jw_videoEnterFS == 'function') {
                    jw_videoEnterFS();
                }
                ow = element.find(".videoPlayer").width();
                oh = element.find(".videoPlayer").height();
                $('body').addClass("applefixed");
                element.find(".videoPlayer").addClass("jw_fullscreen").wrap("<div class='appleFullscreen'></div>");
                $("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").css("width", $(window).width() + "px");
                $("#hun_vp").parent().css("width", $(window).width() + "px");
                $("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").css("height", $(window).height() + "px");
                $("#hun_vp").parent().css("height", $(window).height() + "px");
                setTimeout(function() {
                    videoPlayerObj.play(true);
                }, 500);
				
                //videoPlayerObj.resize($(window).width(), $(window).height());
            }
        } else { // other than safari browser
            if ($("#hun_vp").hasClass("playerFullScreen")) {
               console.log("videoplayer: exit from full screen");
               element.find("#hun_vp").removeClass("playerFullScreen");
               if (typeof jw_operaExitFS == 'function') {
                    jw_operaExitFS();
               }
               if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }               
            }else{               
               console.log("videoplayer: get ready to enter fullscreen");
                $("body").addClass("fixed");
               ow = element.find(".videoPlayer").width();
               oh = element.find(".videoPlayer").height();
               if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
               element.find("#hun_vp").addClass("playerFullScreen");
			   resizePlayer($(window).width());
               setTimeout(function(){alignVideo()},500);
			   element.find(".btnResize").addClass("icon-ic_fullscreen_exit-53");
            }
        }
    }
    if (document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', exitHandler, false);
        document.addEventListener('mozfullscreenchange', exitHandler, false);
        document.addEventListener('fullscreenchange', exitHandler, false);
        document.addEventListener('MSFullscreenChange', exitHandler, false);
    }
    function alignVideo(){
        console.log("Player: window height:"+$(window).height() + " / player height: "+ $("#hun_vp #videoPlayerObj").height());
        var playerTopPos = ($(window).height() - element.find("#hun_vp #videoPlayerObj").height())/2;
        element.find("#hun_vp #videoPlayerObj, #hun_vp #adContainer").animate({"top":playerTopPos+"px"},100);
    }
    function exitFullscreenFormality(){
		console.log("exitFullscreenFormality");
        element.find("#hun_vp").removeClass("playerFullScreen");
		element.find("#hun_vp #adContainer").css("top","0");
		$("body").removeClass("fixed"); 
        if (typeof jw_videoExitFS == 'function') {
            jw_videoExitFS();
        }
        element.find(".btnResize").removeClass("icon-ic_fullscreen_exit-53");
        resizePlayer(ow);
    }
    function exitHandler() {
        var fs = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        if (!fs) {
            exitFullscreenFormality();
        }
    }

    function getPlayType() {
        if (config.playertype == "live") {
            $("#hun_vp").find("#jw_autoplay_li").hide();
            $("#hun_vp").find(".timeBar, .playerProgressbar, #jw_autoplay_li").hide();
            $("#hun_vp").addClass("playlive");
            $("#hun_vp").removeClass('playmovie playvideo');
            $(".liveRibbon").show();
        } else if (config.playertype == "video") {
            $("#hun_vp").find(".timeBar, .playerProgressbar, #jw_autoplay_li").show();
            $("#hun_vp").find("#jw_autoplay_li").show();
            $("#hun_vp").addClass("playvideo");
            $("#hun_vp").removeClass('playmovie playlive');
            $(".liveRibbon").hide();
        } else {
            $("#hun_vp").find(".timeBar, .playerProgressbar, #jw_autoplay_li").show();
            $("#hun_vp").find("#jw_autoplay_li").hide();
            $("#hun_vp").removeClass("playvideo playlive");
            $("#hun_vp").addClass('playmovie');
            $(".liveRibbon").hide();
        }
    }
    element.keyup(function(e) {
        if (e.keyCode == 27) {
            element.find(".videoPlayer").width(ow + "px");
            element.find(".videoPlayer").height(oh + "px");
            element.find(".btnResize").removeClass("icon-ic_fullscreen_exit-53");
            //videoPlayerObj.resize(ow, oh);

        }
    });

    $(window).resize(function() {
        if ($('body').hasClass("applefixed")) {
            element.find(".videoPlayer").width($(window).width() + "px");
            element.find(".videoPlayer").height($(window).height() + "px");
        }
        vplayerWidth = element.width();
        vplayerHeight = (vplayerWidth / 16) * 9;
        //element.find(".videoPlayer").css("width",vplayerWidth + "px")
        element.find(".videoPlayer").width(vplayerWidth + "px");
        element.find(".videoPlayer").height(vplayerHeight + "px");
        element.find("#videoPlayerObj").width(vplayerWidth + "px");
        element.find("#videoPlayerObj").height(vplayerHeight + "px");
		//setTimeout(function(){
		//	element.find("#adContainer, #adContainer video").width(vplayerWidth + "px");
		//	element.find("#adContainer, #adContainer video").height(vplayerHeight + "px");
		//},300);
        //videoPlayerObj.resize($(window).width(), $(window).height());

    });

    element.find('.btnVolume').click(function() {
        if ($(this).hasClass('icon-ic_mute_1-38')) {
            element.find("#soundControlbar").slider("value", preserve.volume);
            $(this).removeClass('icon-ic_mute_1-38');
            videoPlayerObj.volume = (parseInt(preserve.volume) / 100);
        } else {
            element.find("#soundControlbar").slider("value", 0);
            videoPlayerObj.volume = (parseInt(0));
            $(this).addClass('icon-ic_mute_1-38');
        }
    });
    element.find(".btnPre_30").click(function(e) {
        var minus_thirty = videoPlayerObj.currentTime - 30;
        if (minus_thirty < 0) {
            minus_thirty = 0;
        }
        videoPlayerObj.currentTime = (minus_thirty);
        videoPlayerObj.play();
    });
    element.find(".btnNxt_30").click(function(e) {
        var plus_thirty = videoPlayerObj.currentTime + 30;
        if (plus_thirty > videoPlayerObj.duration) {
            plus_thirty = videoPlayerObj.duration;
            videoPlayerObj.currentTime = (plus_thirty-1);
            pause();
            setTimeout(function(){if (!isApple) {$(".jw-playBtn").show();}},300);
        }else{
            videoPlayerObj.currentTime = (plus_thirty);
            play();
        }
    });
    element.find('.jw_volume').parent("li").mouseenter(function() {
        element.find(".soundControlbar").addClass("show animate fadeIn");

        $(".settingbox").removeClass('setshow');
        $(".qualitybox").removeClass('setqual');
        element.find(".btnVolume").addClass("actcol");
        element.find(".icon-ic_settings_1-09").removeClass("actcol");
    }).mouseleave(function() {
        element.find(".soundControlbar").removeClass("show animate fadeIn");
        element.find(".btnVolume").removeClass("actcol");
    });

    videoPlayerObj.addEventListener("seeking", function() {
        clearInterval(config.playTimeInterval);
        config.playTimeInterval = 0;
        config.pauseTimeInterval = setInterval(function() {
            config.pauseTime++;
        }, 1000);
    });
    videoPlayerObj.addEventListener("seeked", function() {
        clearInterval(config.pauseTimeInterval);
    });
    videoPlayerObj.addEventListener("pause", function() {
        console.log("Player: pause event");
        config.pauseCount++;
        clearInterval(config.playTimeInterval);
        config.playTimeInterval = 0;
        config.pauseTimeInterval = setInterval(function() {
            config.pauseTime++;
        }, 1000);
        if (Math.ceil(videoPlayerObj.currentTime) != Math.ceil(videoPlayerObj.duration)) {
            if (typeof jw_pause_evt == 'function') {
                jw_pause_evt('video', config.vd.mediaid);
            }
        }
        /*
        if (typeof jw_events == 'function') {
            var eventType = 'pause';
            var obj = [];
            obj.item_details = config.vd;
            obj.player_type = 'video';
            jw_events(eventType, obj);
        }
        */
        playerState = "PAUSE";
    });

    videoPlayerObj.addEventListener("play", function() {
        console.log("Player: play event");
        
        clearInterval(config.pauseTimeInterval);
        element.find('#loadingVideo').hide();
        if (config.playertype == "live" && isLiveTest == false) {
            console.log("live player");
            isLiveTest = true;
            /*
            setTimeout(function() {
                console.log("Player: live player");
                seek(0);
            }, 5000);
            */
        }

        /*
        if (typeof jw_events == 'function') {
            var eventType = videoPlayerObj.currentTime > 0 ? "resume" : "play";
            var obj = [];
            obj.item_details = config.vd
            obj.player_type = 'video';
            jw_events(eventType, obj);
        }
        */
        
        if (typeof jw_playing == 'function') {
            jw_playing('video', config.vd.mediaid);
        }
        playerState = "PLAY";
        element.find(".vp_skin").removeClass('mouseout');
    });
    videoPlayerObj.addEventListener("timeupdate", function(e) {
        playerState = "PLAYING";
        if (config.playTimeInterval == 0) {
            config.playTimeInterval = setInterval(function() {
                config.playTime++;
            }, 1000);
        }
        element.find('#loadingVideo').hide();
        if(!isAdRunning){
            element.find("#adContainer").hide();
        }else{
            element.find("#adContainer").show();
        }
        //console.log("Player: timeupdate");
        clearInterval(config.bufferTimeInterval);
        element.find('.bg_logo').hide();
        //element.find(".jw-playBtn").hide();
        var len = 1;
        switch (videoPlayerObj.paused) {
            case false:
                if (!element.find(".jw_play").hasClass('btnPause')) {
                    element.find(".jw_play").addClass('btnPause');
                    element.find(".jw_play").removeClass('btnPlay');
                    element.find(".jw-playBtn").hide();
                }
                break;
            case true:
                //showPlay();
                break;
        }
        var perc = ((videoPlayerObj.currentTime / videoPlayerObj.duration) * 100);
        /*
        if(videoConfigObj.playertype=="live"){
        perc=100;
        element.find(".jw_duration").hide();
        }
         */
        element.find(".jw-playBtn").hide();
        if (videoPlayerObj.currentTime >= 1) {
            element.find(".jw_position").text(secondsToHms(videoPlayerObj.currentTime));
            element.find(".jw_duration").text(secondsToHms(videoPlayerObj.duration));
        }

        element.find("#playerProgressbar").slider("value", perc);
        var viewingTime = config.extraParam.viewingTime
        rentPri = config.extraParam.rentPrice;

        if (Math.floor(videoPlayerObj.currentTime / 60) >= viewingTime && viewingTime != -1) {
            if (!videoPlayerObj.paused) {
                videoPlayerObj.pause();
                videoPlayerObj.poster = "";
                prepareParams(config, "video", downloaded);

                element.find('.vp_skin').addClass('mouseout');
                element.find('.jw-cast-icon').hide();
                element.find('.soundControlbar').removeClass('show');
                element.find(".jw-playBtn").hide();

                if (typeof showNotificationPopup == 'function') {
                    showNotificationPopup();
                }
            }
        }
        if (videoPlayerObj.currentTime > (videoPlayerObj.duration - 10) && apn_received == false && $("#autoPlaySwitch").is(':checked')) {
            if (typeof showApnPopup == 'function' && config.vd.mediaid != 1) {
                showApnPopup();
                apn_received = true;
            }
        }
    });
    videoPlayerObj.addEventListener("waiting", function() {
        if (config.autoStart == true) {
            showPreloader();
        } else {
            if (!isApple) {
                //element.find(".jw-playBtn").show();
            }
            element.find('#loadingVideo').hide();
        }
        if (typeof jw_video_buffering == 'function') {
            jw_video_buffering();
        }
        config.bufferTimeInterval = setInterval(function() {
            config.bufferTime++;
        }, 1000);
    });
    function video_complete(){
        console.log("Player: jw_VideoComplete called");
        if (typeof jw_VideoComplete == 'function') {
            jw_VideoComplete('video', config.vd.mediaid);
        }
        isLiveTest = false;
        playerState = "COMPLETE";
        prepareParams(config, "video", downloaded);
        element.find('.vp_skin').removeClass('mouseout');
        element.find(".jw_play").addClass('btnPlay');
        element.find(".jw_play").removeClass('btnPause');
        if (!isApple) {
            element.find(".jw-playBtn").show();
        }
        element.find("#autoplayNotification").remove();
        /*
        if (typeof jw_events == 'function') {
            var eventType = 'song_complete';
            jw_events(eventType, config.vd);
        }
        if (typeof jw_events == 'function') {
            var eventType = 'song_complete';
            var obj = [];
            obj.item_details = config.vd;
            obj.player_type = 'video';
            obj.duration = config.playTime;
            jw_events(eventType, obj);
        }
        */
        clearIntervals(config);
        clearStatsData(config);
    }
    videoPlayerObj.addEventListener("ended", function() {
        video_complete();
    });
    videoPlayerObj.addEventListener("canplay", function() {
        element.find('.jw-cast-icon').hide();
        element.find("#playerProgressbar").slider("value", 0);
        var row_count = Math.ceil(Math.floor(videoPlayerObj.duration / 10) / config.spd_extra.thumb_col_count);
        var total_thumbs = (row_count * config.spd_extra.thumb_col_count).toString();
        config.spd_extra.thumbs_in_one_sprite = total_thumbs;
        config.spd_extra.thumb_row_count = row_count.toString();
		element.find(".jw_position").text(secondsToHms(0));
        element.find(".jw_duration").text(secondsToHms(0));
        thumbnail_preview();
        if (videoPlayerObj.canPlayType('application/vnd.apple.mpegurl') === "probably" || videoPlayerObj.canPlayType('application/vnd.apple.mpegurl') === "maybe") {
            console.log("player: hls is playable");
            videoPlayerObj.type = "application/vnd.apple.mpegurl";
        } else {
            //console.log("player: hls isn't playable");
            videoPlayerObj.type = "";
        }
        if (typeof jw_videoStarted == 'function') {
            jw_videoStarted('video', config.vd.mediaid);
        }
    });
    videoPlayerObj.addEventListener("error", function() {
        if(vd.type!="dash"){
            console.log("Player: error mp4");
            if (typeof jw_mediaError == 'function') {
                jw_mediaError('video', "media error");
            }
            if (config.extraParam.backup != "") {
                loadNewPlaylist(config.extraParam.backup);
            }
        }
    });
    videoPlayerObj.addEventListener("loadstart", function() {
        element.find("#playerProgressbar").slider("value", 0);
        element.find('.setquality').html("Auto" + " <span class='arw'></span>");
        element.find(".qualityList").html("");
        element.find('.vdoQuality').hide();
        element.find('.jw_settings').hide();
        if (config.autoStart == true) {
            showPreloader();
        } else {
            if (!isApple) {
                element.find(".jw-playBtn").show();
            }
            element.find('#loadingVideo').hide();
        }
    });
    if (typeof jw_player_ready == 'function') {
        setTimeout(function() {
            jw_player_ready();
        }, 4000);
    }
    //---------CONFIG CODE--------------
    player_config_object = new Object();
    window.onbeforeunload = doBeforeUnload;

    function doBeforeUnload() {
        prepareParams(config, "video", downloaded);
    }

    function resizePlayer(w) {
		//console.log("resize");
		var w =  $("#hun_vp").width();
        //console.log("w: " + w);
        var h = Math.round((w / 16) * 9);
        $("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").animate({"width": w + "px"},100);
        $("#adContainer>div,#adContainer iframe").animate({"width": w + "px"},100);
		$("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").animate({"height": h + "px"},100);
		$("#adContainer>div,#adContainer iframe").animate({"height": h + "px"},100);
        //$("#adContainer>div,#adContainer iframe").css("width", w + "px");
       //$("#hun_vp, #hun_vp #adContainer,#videoPlayerObj").css("height", h + "px");
        //$("#adContainer>div,#adContainer iframe").css("height", h + "px");
        
        console.log("Player: resize triggered");
    }

    function clearStatsData(player_config) {
        player_config.playTime = 0;
        player_config.pauseTime = 0;
        player_config.bufferTime = 0;
        player_config.idleTime = 0;
        player_config.pauseCount = 0;
        player_config.seekCount = 0;
        player_config.loadTime = 0;
        player_config.seeked = false;
    }

    function clearIntervals(player_config) {
        clearInterval(player_config.playTimeInterval);
        player_config.playTimeInterval = 0;
        clearInterval(player_config.pauseTimeInterval);
        player_config.pauseTimeInterval = 0;
        clearInterval(player_config.idleTimeInterval);
        player_config.idleTimeInterval = 0;
        clearInterval(player_config.bufferTimeInterval);
        player_config.bufferTimeInterval = 0;
    }
    var adPlay = 0;

    function load(external_vd) {
        destroyAdAndVideo();
        isLiveTest = false;
        element.find(".jw_position").text(secondsToHms(0));
        element.find(".jw_duration").text(secondsToHms(0));
        element.find("#autoplayNotification").remove();
        element.find(".bufferBar").css("width","0");
        element.find("#playerProgressbar").slider("value", 0);
        $("#hun_vp").find("video").removeAttr("crossOrigin");
        $("#hun_vp").find("video").attr("src","");
        $("#hun_vp").find("video").removeAttr("preload", "metadata");
        prepareParams(config, "video", downloaded);
        config.vd.tracks[0].file = "";
        adplayed = false;
        apn_received = false;
        $.extend(true, vd, external_vd);
        config.vd = vd;
        adErrorCount = 0;
        element.find('.jw_subtitle').hide();
        element.find('.vp_skin').addClass('mouseout');
        element.find(".jw_play").addClass('btnPause');
        element.find(".jw_play").removeClass('btnPlay');
        element.find(".jw-playBtn").hide();
        getPlayType();
        clearIntervals(config);
        if (typeof jw_song_changed == 'function') {
            jw_song_changed('video', config.vd.mediaid);
        }
        if (config.autoStart == true) {
            showPreloader();
        } else {
            if (!isApple) {
                element.find(".jw-playBtn").show();
            }
            element.find('#loadingVideo').hide();
        }
        if (vd.ad_setup.tag != "") {
            console.log("Player: Ad tag present");
            adt_adTagPresent=true;
            $("#adContainer").show();
            if (vd.type == "hls") {
                console.log("Player: hls type");
                hls.destroy();
                hls = new Hls(hlsconfig);
                addHlsEvents();
                playHlsMedia();
            } else if (vd.type == "dash") {
                console.log("Player: dash type");
                setUpDash();
            }else {
                console.log("Player: mp4 type");
                videoPlayerObj.src = vd.file;
                if (config.autoStart == true) {
                    videoPlayerObj.play();
                }
            }
            if (config.autoStart == true) {
                requestAds();
            }
        } else {
             console.log("Player: no Ad tag");
            if (vd.type == "hls") {
                console.log("Player: hls type");
                hls.destroy();
                hls = new Hls(hlsconfig);
                addHlsEvents();
                playHlsMedia();
            } else if (vd.type == "dash") {
                console.log("Player: dash type");
                setUpDash();
            }else {
                console.log("Player: mp4 type");
                videoPlayerObj.src = vd.file;
                if (config.autoStart == true) {
                    videoPlayerObj.play();
                }
            }
        }

    }

    function playHlsMedia() {
        hls.loadSource(vd.file);
        hls.attachMedia(videoPlayerObj);
        videoPlayerObj.play();
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return "";
    }

    function get_date() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '/' + mm + '/' + yyyy;
    }

    function prepareParams(config_object, type, downloaded) {
        if (config_object.loginStatus) {
            var contentviewing = "full";
        } else {
            var contentviewing = "preview";
        }
        var defalut_response = "";
        var contentid,
            title,
            ctype,
            subcategory,
            vendor,
            genre,
            singer,
            name,
            language,
            userid,
            property,
            albumid;
        if (type == "video") {
            subcategory = "videos";
            contentid = config_object.vd.mediaid;
            title = config_object.vd.title;
            ctype = config_object.vd.contenttype;
            albumid = defalut_response;
            vendor = config_object.vd.vendor;
            genre = config_object.vd.genre;
            singer = config_object.vd.singer;
            name = defalut_response;
            language = config_object.vd.language;
        }
        var plytime = config_object.playTime;
        if (downloaded) {
            plytime = "";
        }
        var d = new Date();
        var params = {
            url: locationProtocol + "//" + window.location.hostname + window.location.pathname,
            content_title: title ? title : defalut_response,
            content_id: contentid ? contentid.toString() : defalut_response,
            content_type: ctype ? ctype : defalut_response,
            content_viewing: contentviewing ? contentviewing : defalut_response,
            app: config_object.platform ? config_object.platform : "WEB",
            property: config_object.property ? config_object.property : "HUNGAMA",
            playtime: plytime.toString() ? plytime.toString() : defalut_response,
            buffer: config_object.bufferTime ? config_object.bufferTime.toString() : defalut_response,
            seekcount: config_object.seekCount ? config_object.seekCount.toString() : defalut_response,
            _huid: getCookie("_huid") ? getCookie("_huid") : defalut_response,
            type: type,
            pause: config_object.pauseTime ? config_object.pauseTime.toString() : defalut_response,
            pausecount: config_object.pauseCount ? config_object.pauseCount.toString() : defalut_response,
            s: config_object.subscribeStatus ? config_object.subscribeStatus : defalut_response,
            sp: config_object.subscriptionPrice ? config_object.subscriptionPrice.toString() : defalut_response,
            ltime: config_object.loadTime ? config_object.loadTime.toString() : defalut_response,
            errormessage: config_object.errorMessage ? config_object.errorMessage : defalut_response,
            subcategory: subcategory,
            event: downloaded ? "downloaded" : "not_downloaded",
            category: ctype ? ctype : defalut_response,
            id: albumid ? albumid.toString() : defalut_response, //album id for audio
            email: config_object.email ? config_object.email : defalut_response, // "act_user_2@mailinator.com",
            userid: config_object.userid ? config_object.userid : defalut_response, //"99166700",
            vendor: vendor ? vendor : defalut_response,
            genere: genre ? genre : defalut_response, // for audio
            singer: singer ? singer : defalut_response,
            name: name ? name : defalut_response, // album name
            language: language ? language : defalut_response,
        };


        if (params.content_id != "1") {
            $.ajax({
                type: 'GET',
                url: tracking_url + "?query=" + JSON.stringify(params),
                contentType: 'text/plain',
                xhrFields: {
                    withCredentials: false
                },
                success: function() {
                    //clearStatsData(config_object);
                    //clearIntervals(config_object);
                },
                error: function() {
                    //clearStatsData(config_object);
                    //clearIntervals(config_object);
                }
            });
        }
        var new_params = {
            ver: encodeURI(ver_check),
            aff_id: config_object.aff_id ? config_object.aff_id : 0,
            dos: config_object.dos ? config_object.dos : "",
            ctitle: title ? encodeURI(title) : defalut_response,
            cid: contentid ? contentid.toString() : defalut_response,
            ctype: ctype ? ctype : defalut_response,
            uevent: "full",
            platform: "WEB",
            property: "WEB",
            dur: plytime.toString() ? plytime.toString() : defalut_response,
            buff: config_object.bufferTime ? config_object.bufferTime.toString() : defalut_response,
            uid: config_object.userid ? config_object.userid : getCookie("_huid"),
            ctype: ctype ? ctype : defalut_response,
            alb_id: albumid ? albumid.toString() : defalut_response, //album id 
            cgenre: genre ? genre : defalut_response, // for audio
            artist: singer ? encodeURI(singer) : defalut_response,
            alb_title: name ? encodeURI(name) : defalut_response, // album name
            clang: language ? language : defalut_response,
            stype: "stream",
            era: config_object.vd.year,
            url: encodeURI(locationProtocol + "//" + window.location.hostname + window.location.pathname),
            ad_play: adPlay

        };
        console.log("Player: New param data");
        var com_d = Math.floor(videoPlayerObj.duration);
        var com_p = Math.floor(new_params.dur);
        if (new_params.cid != "1") {
            if(com_d==com_p||com_p>=(com_d-5)){
                console.log("Player: Total Duration: "+com_d+" | Total played: "+com_p);
                //video_complete();
            }
        }
        //console.dir(new_params);
        if (new_params.cid != "1") {
            $.ajax({
                type: 'GET',
                url: new_tracking_url + "?" + $.param(new_params),
                contentType: 'text/plain',
                xhrFields: {
                    withCredentials: false
                },
                success: function() {
                    clearStatsData(config_object);
                    clearIntervals(config_object);
                },
                error: function() {
                    clearStatsData(config_object);
                    clearIntervals(config_object);
                }
            });
        }
        if(location.hostname=="play.hungama.com"){
            var device_name="";
            var os_name="";
            var browser_name="";
            if (typeof get_device_info == 'function') {
                device_name = get_device_info().device_model;
                os_name = get_device_info().os_name;
                browser_name = get_device_info().browser;
            }
            if(adt_adImpre){
                adt_adTagPresent=true;
            }
            var for_playhungama = {
                platform:"WEB",
                property:"PLAYHUNGAMA",
                device_name:device_name,
                os_name:os_name,
                browser_name:browser_name,
                adt_adTagPresent:adt_adTagPresent,
                adt_adImpre:adt_adImpre,
                adt_adStart:adt_adStart,
                adt_adError:adt_adError
            }
            console.log("Player: playhungama_tracking: "+for_playhungama);
            $.ajax({
                type: 'GET',
                url: playhungama_tracking_url + "?" + $.param(for_playhungama),
                contentType: 'text/plain',
                xhrFields: {
                    withCredentials: false
                },
                success: function() {
                    console.log("Player: playhungama_tracking_url success");
                    adt_adTagPresent=false;
                    adt_adImpre=false;
                    adt_adStart=false;
                    adt_adError=false;
                },
                error: function() {
                    console.log("Player: playhungama_tracking_url failed");
                    adt_adTagPresent=false;
                    adt_adImpre=false;
                    adt_adStart=false;
                    adt_adError=false;
                }
            });
        }
    }


    function checkDomain(id, element) {
        var c = false;
        $.ajax({
            url: "http://player.hungama.com/player/js/jwplayer/whitelist.json",
            dataType: 'jsonp',
            jsonpCallback: 'test',
            success: function(data) {
                var lh = location.host;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].url.toLowerCase().indexOf(lh) >= 0) {
                        c = true;
                        break;
                    }
                }
                if (!c) {
                    element.html("");
                }
            },
            error: function(xhr, status, error) {}
        });
    }



    function stop() {
        element.find(".jw_position").text(secondsToHms(0));
        element.find(".jw_duration").text(secondsToHms(0));
        videoPlayerObj.currentTime = 0;
        videoPlayerObj.pause();
        videoPlayerObj.removeAttribute("src");
        element.find('.vp_skin').removeClass('mouseout');
        element.find(".jw_play").addClass('btnPlay');
        element.find(".jw_play").removeClass('btnPause');
        if (!isApple) {
            element.find(".jw-playBtn").show();
        }
        setTimeout(function() {
            playerState = "IDLE";
        }, 500);
    }



    function seek(sec) {
        videoPlayerObj.currentTime = sec;
        videoPlayerObj.play();
    }

    function getPlaylist() {
        return vd;
    }

    function getPosition() {
        return videoPlayerObj.currentTime;
    }

    function getDuration() {
        return videoPlayerObj.duration;
    }

    function playAd(adTagUrl) {
        adplayed = false;
        vd.ad_setup.tag = adTagUrl;
        if (vd.ad_setup.tag != "") {
            requestAds();
        }
    }

    function resetPlayer() {}

    function getState() {
        return playerState;
    }

    function playDefault() {
        var vd = {
            "file": "http://www.hungama.com/assets/includes/silence-1sec.mp3",
            "mediaid": "1",
            "title": "Uff Yeh Noor",
            "albumname": "Noor",
            "type": "mp3",
            "image": "",
            "imagethumb": "",
            "genre": "Soundtrack",
            "lang": "Hindi",
            "year": "2017",
            "contenttype": "video",
            "ad_setup": {
                "client": "googima",
                "tag": ""
            },
            "tracks": [{
                "file": "",
                "label": "English",
                "kind": "captions",
                "default": true
            }]
        };
        load(vd);
    }

   
    return {
        load: load,
        hls: hls,
        videoPlayerObj: videoPlayerObj,
        config: config,
        play: play,
        pause: pause,
        seek: seek,
        stop: stop,
        getPlaylist: getPlaylist,
        getPosition: getPosition,
        getDuration: getDuration,
        playAd: playAd,
        getState: getState,
        resizePlayer: resizePlayer,
        resetPlayer: resetPlayer,
        playDefault: playDefault,
        destroyAdAndVideo: destroyAdAndVideo,
        pauseAd: pauseAd,
        fs: fs,
        exitFullscreenFormality:exitFullscreenFormality,
        dashplayer:dashplayer,
        startAds:startAds,
        adsManager:adsManager
    };
}