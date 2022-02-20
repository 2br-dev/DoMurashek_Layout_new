"use strict";

var p, heroes, authors, members, possibilities;
var observer;
var authorsTop, authorsBottom;
var membersTop, membersBottom;
var parallax;
var parallaxTrigger;
var parallaxAnimating;
var observer;
var parallaxObserver;
var activeSlideNum;
var heroSlider;
var mobileBakstageSlider;
var currentIndex;
var gallerySlides = [];
$(function () {
  $(window).on('scroll', enableParticles);
  $(window).scrollEnd(function () {
    if (p && isVisible(document.querySelector('#canvas-wrapper'))) p.start();
  });
  init();
  $('body').on('click', '#send', sendMessage);

  if ($('#luchiki').length) {
    // Setup events
    $('body').on('click', '.slide', makeActive);
    $('body').on('click', '.slider-navi-dot', makeActiveByDot);
    $('body').on('click', '.circular-arrow.prev', next);
    $('body').on('click', '.circular-arrow.next', prev);
    $('body').on('click', '.card-wrapper', flipCard);
    $('body').on('click', '.backstage-prev', backstagePrev);
    $('body').on('click', '.backstage-next', backstageNext);
    $(window).on('scroll', animateBackgrounds);
  }
});

function backstagePrev(e) {
  e.preventDefault();
  mobileBakstageSlider.slidePrev();
}

function backstageNext(e) {
  e.preventDefault();
  mobileBakstageSlider.slideNext();
}

function sendMessage() {
  var form = $(this).parents('form');
  var formData = $(form).serialize();
  var modal = M.Modal.getInstance(form);
  $.ajax({
    url: '/ajax.php',
    type: "POST",
    dataType: 'JSON',
    data: formData,
    success: function success(res) {
      console.log(res);

      if (res.success) {
        M.toast({
          html: "Сообщение успешно отправлено!"
        });
        modal.close();
      } else {
        if (res.error === 'name') {
          M.toast({
            html: "Заполните поле ИМЯ"
          });
        }

        if (res.error === 'phone') {
          M.toast({
            html: "Заполните поля ТЕЛЕФОН"
          });
        }

        if (res.error === 'comment') {
          M.toast({
            html: "Заполните поле СООБЩЕНИЕ"
          });
        }
      }
    },
    error: function error(err) {
      M.toast({
        html: "Произошла ошибка. Попробуйет еще раз"
      });
      console.error(err);
    }
  }); // if(formData){
  // 	M.toast({html: "Сообщение успешно отправлено!"});
  // 	modal.close();
  // }
}

function init() {
  if ($('.hyphen').length) {
    $('.hyphen').hyphenate();
  }

  initParticles();
  enableParticles();
  $('.lazy').lazy();
  $('.sidenav').sidenav();
  $('.modal').modal();

  if ($('main#luchiki').length) {
    var slide = $('.slide-container.active').data('slide') || 1;
    $('.backstage-slide-text[data-slide="' + slide + '"]').addClass('active');
    $('.slide-container[data-slide="' + slide + '"]').addClass('active');
    updateScales($('.slide-container.active').find('.slide'), updateSlideText);
    $('.sidenav').sidenav();
    $(window).enllax({
      disableWidth: 800,
      resizeEvt: resizeEnllax
    });
    $('.gallery-images .lazy').each(function (index, el) {
      var image = $(el).data('src');
      gallerySlides.push(image);
    });
    var videoGallery = ["yn0kOJNPEts", "DElJw-BzBGY", "nngNYjerJf8", "9NjduUh3UXU", "TiHV8VGRV14"]; // let maraphoneSlider = new ZoomSlider('.image-block .lazy', gallerySlides);

    var videoSlider = new ZoomSlider('.video-slide', videoGallery, "video");
    $('.lazy').lazy();
    heroSlider = new Swiper(document.querySelector('#heroes-slider'), {
      slidesPerView: 3,
      speed: 1000,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      loop: true,
      breakpoints: {
        1800: {
          slidesPerView: 4
        },
        1400: {
          slidesPerView: 3
        },
        600: {
          slidesPerView: 2
        },
        460: {
          slidesPerView: 1
        },
        200: {
          slidesPerView: 1
        }
      }
    });
    mobileBakstageSlider = new Swiper(document.querySelector('#backstage-mobile'));
  }

  if ($('#gallery').length) {
    initPhotoSwipeFromDOM('.my-gallery');
  }
}

function enableParticles() {
  if (p) p.stop(); // Heroes

  var heroes = document.querySelector('#heroes');

  if (heroes) {
    heroes.setAttribute('class', 'grid-wrapper ' + (isVisible(heroes) ? 'visible' : 'invisible'));
  } // Authors


  var authors = document.querySelectorAll('.author');

  if (authors.length) {
    authors.forEach(function (author) {
      setTimeout(function () {
        author.setAttribute('class', 'author ' + (isVisible(author) ? 'visible' : 'invisible'));
      }, 300);
    });
  } // Possibilities


  var possibilities = document.querySelectorAll('.possibility');

  if (possibilities.length) {
    possibilities.forEach(function (possibility) {
      setTimeout(function () {
        possibility.setAttribute('class', 'possibility row flex ' + (isVisible(possibility) ? 'visible' : 'invisible'));
      }, 300);
    });
  } // Parallax


  var parallax = document.querySelector('.parallax');

  if (parallax) {
    // if(isVisible(parallax))
    $('.parallax').parallax();
  } // Facts lazy


  var lazy = document.querySelectorAll('#facts .col .lazy');

  if (lazy.length) {
    lazy.forEach(function (image) {
      var className = "";

      if (isInViewport(image)) {
        className = 'lazy visible';
      }

      if (!isVisible(image)) {
        className = 'lazy invisible';
      }

      image.setAttribute('class', 'lazy ' + className);
    });
  }
}

function initParticles() {
  var colorTop = Math2.rgbToHex('rgb(0,0,0)');
  var topImageMouseData = new ParticleData("/img/LogoDoMurashek_top.png", 5, .2, 0, colorTop, 2, .2, false);
  var topImageWaveData1 = new ParticleData("/img/LogoDoMurashek_top.png", 5, .2, 0, colorTop, 2, .2, false);
  var topImageWaveData2 = new ParticleData("/img/LogoDoMurashek_top.png", 5, .2, 0, colorTop, 2, .2, true);

  if ($('#canvas-wrapper').length) {
    p = new ParticlesApp(1750, 330, 'canvas', '#canvas-wrapper', [topImageWaveData1, topImageWaveData2, topImageMouseData], null, null, 100, 10);
    setTimeout(function () {
      p.start();
    }, 200);
  }
}

$.fn.scrollEnd = function (callback, timeout) {
  $(this).on('scroll', function () {
    var $this = $(this);

    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }

    $this.data('scrollTimeout', setTimeout(callback, timeout));
  });
};

$.fn.parallax = function () {
  return $(this).each(function () {
    var current = $(this).offset().top - $(window).scrollTop();
    var min = 0;
    var max = window.innerHeight - this.parentElement.offsetHeight;
    var percent = (current - max) / (min - max);
    var speed = 20;
    var ratio = window.innerWidth / window.innerHeight;
    var position = percent * speed - (ratio - .5) * 10;
    $(this).css("transform", "translateY( calc(" + position + "% - 60px))");
  });
};

var isInViewport = function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  return bounding.top >= 0 && bounding.left >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
};

function isVisible(ele) {
  var _ele$getBoundingClien = ele.getBoundingClientRect(),
      top = _ele$getBoundingClien.top,
      bottom = _ele$getBoundingClien.bottom;

  var vHeight = window.innerHeight || document.documentElement.clientHeight;
  return (top > 0 || bottom > 0) && top < vHeight;
}

function resizeEnllax() {
  var st = $('html, body').scrollTop();
  $('html, body').scrollTop(0);
  setTimeout(function () {
    $(window).enllax({
      disableWidth: 800,
      resizeEvt: resizeEnllax
    });
    $('html, body').scrollTop(st);
  }, 15);
}

function animateBackgrounds() {
  // Logo animation
  var logoTop = $('.logo-top').offset().top - $('nav').outerHeight();
  var logoBottom = $('.logo-bottom').offset().top;
  var scrollTop = window.scrollTop = $('html, body').scrollTop();
  var percentVal = (scrollTop - logoBottom) / (logoTop - logoBottom);
  if (percentVal < 0.02) percentVal = 0;
  if (percentVal > 1) percentVal = 1;
  var percent = 100 - percentVal * 100;
  $('.logo-final').css({
    backgroundPosition: percent + "% center"
  }); // Top info block transparency

  var min = $('.text-bottom').offset().top - $('nav').outerHeight();
  var max = min + $('.top-info-block').innerHeight();
  var cur = (scrollTop - min) / (max - min);
  var opacity = 1 - cur;
  if (opacity > 1) opacity = 1;
  if (opacity < 0.01) opacity = 0;
  $('.top-info-block').css({
    opacity: opacity
  }); // Billboard persons animation

  var leftMin = $('.billboard').offset().top + window.innerHeight / 6;
  var leftMax = leftMin - window.innerHeight / 6;
  var rightMax = leftMin - window.innerHeight / 3;
  var leftPos = (scrollTop - leftMin) / (leftMax - leftMin) * -100;
  var rightPos = (scrollTop - leftMin) / (rightMax - leftMin) * -100;
  if (leftPos > 0) leftPos = 0;
  if (rightPos > 0) rightPos = 0;
  $('.person-left').css({
    backgroundPosition: 'bottom ' + leftPos + '% center'
  });
  $('.person-right').css({
    backgroundPosition: 'bottom ' + rightPos + '% center'
  });
}

function flipCard() {
  var already = $(this).hasClass('flipped');
  var newClass = already ? '' : ' flipped';
  $(this).parents('#heroes-slider').find('.card-wrapper').removeClass('flipped');
  $(this).attr('class', 'card-wrapper' + newClass);
}

function prev(e) {
  e.preventDefault();
  var currentSlideNum = $('.slide-container.active').data('slide');
  var nextSlideNum = currentSlideNum - 1;

  if (nextSlideNum < 1) {
    nextSlideNum = $('.slides .slide-container').length;
  }

  var slide = document.querySelector('.slide-container[data-slide="' + nextSlideNum + '"] .slide');
  updateScales(slide, updateSlideText);
}

function next(e) {
  e.preventDefault();
  var currentSlideNum = $('.slide-container.active').data('slide');
  var nextSlideNum = currentSlideNum + 1;

  if (nextSlideNum > $('.slides .slide-container').length) {
    nextSlideNum = 1;
  }

  var slide = document.querySelector('.slide-container[data-slide="' + nextSlideNum + '"] .slide');
  updateScales(slide, updateSlideText);
}

function makeActive(e) {
  updateScales(this, updateSlideText);
}

function makeActiveByDot() {
  var slideNum = $(this).data('slide');
  var slide = document.querySelector('.slide-container[data-slide="' + slideNum + '"] .slide');
  updateScales(slide, updateSlideText);
}

function updateScales(activeSlide, callback) {
  var wrapper = $(activeSlide).parents('.slides');
  var parent = $(activeSlide).parents('.slide-container');
  var slideNum = parseInt($(parent).data("slide"));
  if (slideNum == activeSlideNum) return;
  var className = "active" + slideNum;
  wrapper.attr('class', 'slides').addClass(className);
  $('.slider-container').css({
    pointerEvents: 'none'
  }); // Setup active items

  $('.slide-container').removeClass('active');
  $(parent).addClass('active'); // Dots

  $('.slider-navi-dot').removeClass('active');
  $('.slider-navi-dot[data-slide="' + slideNum + '"]').addClass('active');
  var slides = $(wrapper).find('.slide');
  var minScale = .5;
  var activeScale = 2;
  var count = slides.length;
  var step = (count - minScale) / count;
  var direction = slideNum > activeSlideNum ? "forward" : "backward";
  $(activeSlide).css({
    transform: 'scale(' + activeScale + ')'
  });

  for (var f = 0; f < slideNum - 1; f++) {
    var s = slideNum - f - 1;
    var scale = activeScale - step * s;
    if (scale < 0) scale = 0;
    $(slides[f]).css({
      transform: 'scale(' + scale + ')'
    });
  }

  var start = slideNum + 1;

  for (var _f = start; _f <= count; _f++) {
    var _scale = activeScale - step * (_f - slideNum);

    if (_scale < 0) _scale = 0;
    var index = _f - 1;
    $(slides[index]).css({
      transform: 'scale(' + _scale + ')'
    });
  }

  activeSlideNum = slideNum;
  setTimeout(function () {
    $('.slider-container').css({
      pointerEvents: 'all'
    });
  }, 600);
  if (callback) callback(slideNum, direction);
}

function updateSlideText(slideNum, direction) {
  var currentActive = $('.backstage-slide-text.active');
  var newActive = $('.backstage-slide-text[data-slide="' + slideNum + '"]');
  var currentActivePos = direction == 'forward' ? 'dn' : 'up';
  var newActivePos = direction == 'forward' ? 'up' : 'dn';
  newActive.addClass(newActivePos);
  setTimeout(function () {
    newActive.css({
      transition: 'transform .6s, opacity .6s'
    });
    currentActive.css({
      transition: 'transform .6s, opacity .6s'
    });
    newActive.removeClass(newActivePos).addClass('active');
    currentActive.removeClass('active').addClass(currentActivePos);
    setTimeout(function () {
      $('.backstage-slide-text').css({
        transition: 'none'
      }).attr('class', 'backstage-slide-text');
      newActive.attr('class', 'backstage-slide-text active');
    }, 600);
  }, 0);
}

function initPhotoSwipeFromDOM(gallerySelector) {
  // parse slide data (url, title, size ...) from DOM elements 
  // (children of gallerySelector)
  var parseThumbnailElements = function parseThumbnailElements(el) {
    var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;

    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i]; // <figure> element
      // include only element nodes 

      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element

      size = linkEl.getAttribute('data-size').split('x'); // create slide object

      item = {
        src: linkEl.getAttribute('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };

      if (figureEl.children.length > 1) {
        // <figcaption> content
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute('src');
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn

      items.push(item);
    }

    return items;
  }; // find nearest parent element


  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  }; // triggers when user clicks on thumbnail


  var onThumbnailsClick = function onThumbnailsClick(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    var eTarget = e.target || e.srcElement; // find root element of slide

    var clickedListItem = closest(eTarget, function (el) {
      return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
    });

    if (!clickedListItem) {
      return;
    } // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute


    var clickedGallery = clickedListItem.parentNode,
        childNodes = clickedListItem.parentNode.childNodes,
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }

      nodeIndex++;
    }

    if (index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe(index, clickedGallery);
    }

    return false;
  }; // parse picture index and gallery index from URL (#&pid=1&gid=2)


  var photoswipeParseHash = function photoswipeParseHash() {
    var hash = window.location.hash.substring(1),
        params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');

    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }

      var pair = vars[i].split('=');

      if (pair.length < 2) {
        continue;
      }

      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;
    items = parseThumbnailElements(galleryElement); // define options (if needed)

    options = {
      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),
      shareEl: false,
      getThumbBoundsFn: function getThumbBoundsFn(index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = items[index].el.getElementsByTagName('img')[0],
            // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width
        };
      }
    }; // PhotoSwipe opened from URL

    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used 
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    } // exit if index not found


    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    } // Pass data to PhotoSwipe and initialize it


    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }; // loop through all gallery elements and bind events


  var galleryElements = document.querySelectorAll(gallerySelector);

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  } // Parse URL and open gallery if it contains #&pid=3&gid=1


  var hashData = photoswipeParseHash();

  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
}

;
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var p; // Необходимые математические функции

var Math2 = {
  random: function random(t, n) {
    return Math.random() * (n - t) + t;
  },
  map: function map(t, n, r, a, o) {
    return (o - a) * ((t - n) / (r - n)) + a;
  },
  randomPlusMinus: function randomPlusMinus(t) {
    return t = t ? t : .5, Math.random() > t ? -1 : 1;
  },
  randomInt: function randomInt(t, n) {
    return n += 1, Math.floor(Math.random() * (n - t) + t);
  },
  randomBool: function randomBool(t) {
    return t = t ? t : .5, Math.random() < t ? !0 : !1;
  },
  degToRad: function degToRad(t) {
    return rad = t * Math.PI / 180, rad;
  },
  radToDeg: function radToDeg(t) {
    return rad = t * Math.PI / 180, rad;
  },
  rgbToHex: function rgbToHex(t) {
    function n(t) {
      return ("0" + parseInt(t).toString(16)).slice(-2);
    }

    t = t.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var r = n(t[1]) + n(t[2]) + n(t[3]);
    return parseInt('0X' + r.toUpperCase());
  },
  distance: function distance(t, n, r, a) {
    return Math.sqrt((r - t) * (r - t) + (a - n) * (a - n));
  }
};

var ParticlesApp = /*#__PURE__*/function () {
  // Параметры, задаваемые настройками
  //Ширина холста
  //Высота холста
  //Контейнер
  //Прозрачность сцены
  //Цвет сцены (если не прозрачная)
  //Данные картинок (массив экземпляров класса ParticleData)
  //Радиус взаимодействия (px)
  // Умножитель скорости волны
  // Внутренние переменные
  //HTMLCanvasElement
  //PIXIRenderer
  //PIXIStage
  // Позиция "волны"
  // Расположение курсора
  // Масштаб

  /**
   * 
   * @param {*} canvasWidth Ширина холста
   * @param {*} canvasHeight Высота холста
   * @param {*} canvasID ID холста
   * @param {*} container селектор контейнера холста
   * @param {*} stageColor цвет сцены
   * @param {*} stageTransparent прозрачность сцены
   * @param {*} particleData данные картинок
   */
  function ParticlesApp(canvasWidth, canvasHeight, canvasID, container, _particleData) {
    var _this = this;

    var stageColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var stageTransparent = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var interactionRadius = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 120;
    var waveSpeedMultiplier = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 5;

    _classCallCheck(this, ParticlesApp);

    _defineProperty(this, "canvasWidth", void 0);

    _defineProperty(this, "canvasHeight", void 0);

    _defineProperty(this, "container", void 0);

    _defineProperty(this, "stageTransparent", true);

    _defineProperty(this, "stageColor", 0XCCCCCC);

    _defineProperty(this, "particleData", []);

    _defineProperty(this, "interactionRadius", 120);

    _defineProperty(this, "waveSpeedMultiplier", void 0);

    _defineProperty(this, "canvasEl", void 0);

    _defineProperty(this, "renderer", void 0);

    _defineProperty(this, "stage", void 0);

    _defineProperty(this, "waveX", -400);

    _defineProperty(this, "mousePos", {
      x: 0,
      y: 0
    });

    _defineProperty(this, "scale", 1);

    _defineProperty(this, "isplaying", true);

    _defineProperty(this, "canvas_init", function () {
      _this.canvasEl = document.createElement('canvas'), {
        width: _this.canvasWidth,
        height: _this.canvasHeight
      };
      _this.renderer = new PIXI.autoDetectRenderer(_this.canvasWidth, _this.canvasHeight, {
        transparent: true
      });
      _this.container.appendChild(_this.renderer.view).id = _this.canvasID;
      _this.stage = new PIXI.Stage(_this.stageColor);
    });

    _defineProperty(this, "updateCursor", function (e) {
      e = e || window.event;
      var canvas = document.querySelector('#' + _this.canvasID);
      var rect = canvas.getBoundingClientRect();
      var percentX = e.pageX / (window.innerWidth - rect.left / 2);
      var percentY = e.pageY / (window.innerHeight - rect.top / 2);
      _this.mousePos = {
        x: _this.canvasWidth * percentX,
        y: _this.canvasHeight * percentY
      };
    });

    _defineProperty(this, "placeParticles", function (particleData) {
      var imageObj = new Image(); // Корректировка с учётом масштаба;

      var canvas = document.querySelector('#' + _this.canvasID);

      imageObj.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.base.canvasWidth;
        canvas.height = this.base.canvasHeight;
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height); // Отрисовка изображения

        context.drawImage(this.image, 0, 0, canvas.width, canvas.height); // Считывание данных холста

        var imageData = context.getImageData(0, 0, canvas.width, canvas.width);
        var data = imageData.data; // Цикл по точкам

        for (var i = 0; i < imageData.height; i += this.particleInfo.particleDensity) {
          for (var j = 0; j < imageData.width; j += this.particleInfo.particleDensity) {
            // Получение цвета пикселя
            var color = data[j * (imageData.width * 4) + i * 4 - 1];

            if (color === 255) {
              var p = this.base.particle(this.particleInfo.particleColor, this.particleInfo.particleAlphaAmplitude, this.particleInfo.particleRadiusAmplitude, this.particleInfo.movementRadius, this.particleInfo.movementSpeed);
              p.setPosition(i, j);
              this.particleInfo.particles.push(p);
              this.base.stage.addChild(p);
            }
          }
        }
      }.bind({
        base: _this,
        image: imageObj,
        particleInfo: particleData
      });

      imageObj.src = particleData.imageUrl;
    });

    _defineProperty(this, "particle", function (particleColor, particleAlphaAmplitude, particleRadiusAmplitude, movementRadius, movementSpeed) {
      var $this = new PIXI.Graphics();
      $this.beginFill(particleColor);
      var radius;
      $this.radius = radius = Math.random() * 3;
      $this.drawCircle(0, 0, radius);
      $this.size = radius;
      $this.movementRadius = movementRadius;
      $this.movementSpeed = movementSpeed;
      $this.x = -$this.width;
      $this.y = -$this.height;
      $this.free = false;
      $this.timer = Math2.randomInt(0, 100);
      $this.v = Math2.random(particleRadiusAmplitude, 1) * Math2.randomPlusMinus();
      $this.hovered = false;
      $this.alpha = Math2.randomInt(particleAlphaAmplitude, 100) / 100;

      $this.setPosition = function (x, y) {
        $this.x = x;
        $this.y = y;
      };

      return $this;
    });

    _defineProperty(this, "update", function () {
      if (!_this.isplaying) {
        return;
      }

      _this.renderer.render(_this.stage);

      _this.waveX += _this.waveSpeedMultiplier;

      if (_this.waveX >= 5000) {
        _this.waveX = -400;
      }

      _this.particleData.forEach(function (data) {
        data.particles.forEach(function (p) {
          var m = _this.mousePos;
          var ir = _this.interactionRadius;
          var coords;
          var fixedPos = {
            x: _this.waveX,
            y: _this.canvasHeight / 2
          };

          if (data.isInteractive) {
            coords = m;
          } else {
            coords = fixedPos;
          }

          p.scale.x = p.scale.y = Math.max(Math.min(4 - Math2.distance(p.x, p.y, coords.x, coords.y) / ir, ir), 1);
          p.x += Math.sin(p.timer * (1 * p.movementSpeed)) * (p.movementRadius * p.movementSpeed);
          p.y += Math.cos(p.timer * (1 * p.movementSpeed)) * (p.movementRadius * p.movementSpeed);
          p.timer += p.v;
        });
      });

      window.requestAnimationFrame(_this.update);
    });

    // Инициализация свойств
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvasID = canvasID;
    this.container = document.querySelector(container);
    this.stageTransparent = !stageTransparent ? this.stageTransparent : stageTransparent;
    this.stageColor = !stageColor ? this.stageColor : stageColor;
    this.particleData = !_particleData ? this.particleData : _particleData;
    this.interactionRadius = !interactionRadius ? this.interactionRadius : interactionRadius;
    this.waveSpeedMultiplier = waveSpeedMultiplier; // Запуск инициализации холста

    this.canvas_init();
    var canvasElement = document.querySelector('#' + this.canvasID);
    this.scale = canvasElement.clientWidth / this.canvasWidth;
    window.onmousemove = this.updateCursor;

    window.onresize = function () {
      _this.particleData.forEach(function (data) {
        while (_this.stage.children[0]) {
          _this.stage.removeChild(_this.stage.children[0]);
        }

        data.particles = [];
        var canvasElement = document.querySelector('#' + _this.canvasID);
        _this.scale = canvasElement.clientWidth / _this.canvasWidth;

        _this.placeParticles(data);
      });
    }; // Размещение изображения и частиц на нём


    this.particleData.forEach(function (data) {
      _this.placeParticles(data);
    });
    this.update();
  } // Инициализация холста


  _createClass(ParticlesApp, [{
    key: "stop",
    value: function stop() {
      this.isplaying = false;
    }
  }, {
    key: "start",
    value: function start() {
      this.isplaying = true;
      this.update();
    }
  }]);

  return ParticlesApp;
}();

var ParticleData = /*#__PURE__*/_createClass( // Амплитуда радиуса (0….5…1)
//Цвет частиц
//Амплитуда прозрачности частиц (0…50…100)

/**
 * 
 * @imageUrl URL картинки
 * @particleDensity плотность частиц
 * @particleRadiusAmplitude амплитуда радиуса частиц
 * @particleAlphaAmplitude амплитуда прозрачности частиц
 * @particleColor цвет частиц
 * @movementRadius радиус окружности по которой идёт движение частиц
 * @movementSpeed скорость движения частиц
 * @isInteractive Интерактивность системы частиц
 */
function ParticleData(imageUrl, particleDensity, particleRadiusAmplitude, particleAlphaAmplitude, particleColor, movementRadius, movementSpeed) {
  var isInteractive = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

  _classCallCheck(this, ParticleData);

  _defineProperty(this, "imageUrl", void 0);

  _defineProperty(this, "particleDensity", void 0);

  _defineProperty(this, "particleRadiusAmplitude", .5);

  _defineProperty(this, "particleColor", 0XFFFFFF);

  _defineProperty(this, "particleAlphaAmplitude", 0);

  _defineProperty(this, "imageData", void 0);

  _defineProperty(this, "particles", []);

  _defineProperty(this, "movementRadius", void 0);

  _defineProperty(this, "movementSpeed", void 0);

  _defineProperty(this, "isInteractive", void 0);

  this.imageUrl = imageUrl ? imageUrl : this.imageUrl;
  this.particleDensity = particleDensity ? particleDensity : this.particleDensity;
  this.particleRadiusAmplitude = particleRadiusAmplitude ? particleRadiusAmplitude : this.particleRadiusAmplitude;
  this.particleAlphaAmplitude = particleAlphaAmplitude ? particleAlphaAmplitude : this.particleAlphaAmplitude;
  this.particleColor = particleColor ? particleColor : this.particleColor;
  this.movementRadius = movementRadius ? movementRadius : this.movementRadius;
  this.movementSpeed = movementSpeed ? movementSpeed : this.movementSpeed;
  this.isInteractive = isInteractive;
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ZoomSlider = /*#__PURE__*/function () {
  function ZoomSlider(selector, collection, type) {
    _classCallCheck(this, ZoomSlider);

    _defineProperty(this, "currentIndex", void 0);

    _defineProperty(this, "collection", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "gallerySlies", []);

    _defineProperty(this, "selector", void 0);

    this.selector = selector;
    this.collection = collection;
    this.type = type || "image";
    $('body').on('click', this.selector, this.zoom.bind(this));
    $(window).on('scroll', this.close);
  }

  _createClass(ZoomSlider, [{
    key: "zoom",
    value: function zoom(e) {
      var _this = this;

      var parent = $(e.target).parents('.slide-container');

      if (parent.length && !parent.hasClass('active')) {
        return null;
      }

      var IMAGE_DOM = "\n        <div class=\"viewer-wrapper\">\n            <img class=\"image-holder\">\n            <a class=\"viewer-prev\"><i class=\"mdi mdi-chevron-left\"></i></a>\n            <a class=\"viewer-next\"><i class=\"mdi mdi-chevron-right\"></i></a>\n            <a class=\"viewer-close\"><i class=\"mdi mdi-close\"></i></a>\n        </div>";
      var VIDEO_DOM = "\n        <div class=\"viewer-wrapper\">\n            <div class=\"video-wrapper\">\n                <iframe id=\"video\" width=\"560\" id=\"video2\" height=\"315\" src=\"\" title=\"YouTube video player\" frameborder=\"0\"></iframe>\n            </div>\n            <a class=\"viewer-prev\"><i class=\"mdi mdi-chevron-left\"></i></a>\n            <a class=\"viewer-next\"><i class=\"mdi mdi-chevron-right\"></i></a>\n            <a class=\"viewer-close\"><i class=\"mdi mdi-close\"></i></a>\n        </div>";

      if (this.type == "image") {
        var rule = $(e.target).css('background-image');
        var image = rule.substring(5, rule.length - 2).replace(window.location.origin, "");
        this.currentIndex = this.collection.indexOf(image);
        $('body').append(IMAGE_DOM);
        $('.image-holder').attr({
          src: image
        });
      } else {
        var srcId = e.currentTarget.dataset['src'];
        var src = "//www.youtube.com/embed/" + srcId + "?autoplay=1";
        this.currentIndex = this.collection.indexOf(srcId);
        $('body').append(VIDEO_DOM);
        $('#video').attr('src', src);
      }

      setTimeout(function () {
        $('.viewer-wrapper').addClass('opened');
        $('body').on('click', '.viewer-next', _this.next.bind(_this));
        $('body').on('click', '.viewer-prev', _this.prev.bind(_this));
        $('body').on('click', '.viewer-close', _this.close.bind(_this));
        $('body').on('click', '.viewer-wrapper', _this.close1.bind(_this));
      }, 80);
    }
  }, {
    key: "next",
    value: function next() {
      this.currentIndex++;

      if (this.currentIndex >= this.collection.length) {
        this.currentIndex = 0;
      }

      this.changeSlide();
    }
  }, {
    key: "prev",
    value: function prev() {
      this.currentIndex--;

      if (this.currentIndex < 0) {
        this.currentIndex = this.collection.length;
      }

      this.changeSlide();
    }
  }, {
    key: "changeSlide",
    value: function changeSlide() {
      var nextSlide = this.collection[this.currentIndex];

      if (this.type == "image") {
        $('.image-holder').attr('src', nextSlide);
      } else {
        var src = "//www.youtube.com/embed/" + nextSlide + "?autoplay=1";
        $('#video').attr('src', src);
      }
    }
  }, {
    key: "close",
    value: function close() {
      $('body').off('click', '.viewer-next', this.next);
      $('body').off('click', '.viewer-prev', this.prev);
      $('body').off('click', '.viewer-close', this.close);
      $('body').off('click', '.viewer-wrapper', this.close1);
      $('.viewer-wrapper').removeClass('opened').animate({
        opacity: 0
      }, 400, function () {
        $('.viewer-wrapper').remove();
      });
    }
  }, {
    key: "close1",
    value: function close1(e) {
      if (e.target == document.querySelector('.viewer-wrapper')) {
        this.close();
      }
    }
  }]);

  return ZoomSlider;
}();