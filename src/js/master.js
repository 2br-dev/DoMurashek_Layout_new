var p, heroes, authors, members, possibilities;
var observer;
var authorsTop, authorsBottom;
var membersTop, membersBottom;
var parallax;
var parallaxTrigger;
var parallaxAnimating;
var observer;
var parallaxObserver;

let activeSlideNum;
let heroSlider;
let mobileBakstageSlider;

let currentIndex;

let gallerySlides = [];


$(() => {
	$(window).on('scroll', enableParticles);
	$(window).scrollEnd(() => { 
		if(p && isVisible(document.querySelector('#canvas-wrapper')))
			p.start(); 
	});
	init();
	$('body').on('click', '#send', sendMessage);

	if($('#luchiki').length){

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

function backstagePrev(e){
    e.preventDefault();
    mobileBakstageSlider.slidePrev();
}

function backstageNext(e){
    e.preventDefault();
    mobileBakstageSlider.slideNext();
}

function sendMessage(){

	let form = $(this).parents('form');
	let formData = $(form).serialize();
	let modal = M.Modal.getInstance(form);
	$.ajax({
        url: '/ajax.php',
        type: "POST",
        dataType: 'JSON',
        data: formData,
        success: function (res) {
            console.log(res);
            if(res.success){
                M.toast({html: "Сообщение успешно отправлено!"});
                modal.close();
            }else{
                if(res.error === 'name'){
                    M.toast({html: "Заполните поле ИМЯ"});
                }
                if(res.error === 'phone'){
                    M.toast({html: "Заполните поля ТЕЛЕФОН"});
                }
                if(res.error === 'comment'){
                    M.toast({html: "Заполните поле СООБЩЕНИЕ"});
                }
            }
        },
        error: function (err) {
            M.toast({html: "Произошла ошибка. Попробуйет еще раз"});
            console.error(err);
        }
    });
	// if(formData){
	// 	M.toast({html: "Сообщение успешно отправлено!"});
	// 	modal.close();
	// }
}

function init(){

	if($('.hyphen').length){
		$('.hyphen').hyphenate();
	}
	initParticles();
	enableParticles();
	$('.lazy').lazy();
	$('.sidenav').sidenav();
	$('.modal').modal();


	if( $('main#luchiki').length ){

        let slide = $('.slide-container.active').data('slide') || 1;
        $('.backstage-slide-text[data-slide="'+slide+'"]').addClass('active');
        $('.slide-container[data-slide="'+slide+'"]').addClass('active');

        updateScales($('.slide-container.active').find('.slide'), updateSlideText);
    
        $('.sidenav').sidenav();
        $(window).enllax({
            disableWidth: 800,
            resizeEvt: resizeEnllax
        });
        
        $('.gallery-images .lazy').each((index, el) => {
            let image = $(el).data('src');
            gallerySlides.push(image);
        });
    
        let videoGallery = [
            "yn0kOJNPEts",
            "DElJw-BzBGY",
            "nngNYjerJf8",
            "9NjduUh3UXU",
            "TiHV8VGRV14",
        ];
    
        // let maraphoneSlider = new ZoomSlider('.image-block .lazy', gallerySlides);
        let videoSlider = new ZoomSlider('.video-slide', videoGallery, "video");
    
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

    if( $('#gallery').length ){
        initPhotoSwipeFromDOM('.my-gallery');
    }
}

function enableParticles(){
	if(p)
		p.stop();

	// Heroes
	let heroes = document.querySelector('#heroes');
	if(heroes){
		heroes.setAttribute('class', 'grid-wrapper ' + (isVisible(heroes) ? 'visible' : 'invisible'));
	}

	// Authors
	let authors = document.querySelectorAll('.author');
	if(authors.length){
		authors.forEach(author => {
			setTimeout(() => {
				author.setAttribute('class', 'author ' + (isVisible(author) ? 'visible' : 'invisible'));
			}, 300);
		});
	}

	// Possibilities
	let possibilities = document.querySelectorAll('.possibility');
	if(possibilities.length){
		possibilities.forEach(possibility => {
			setTimeout(() => {
				possibility.setAttribute('class', 'possibility row flex ' + (isVisible(possibility) ? 'visible' : 'invisible'));
			}, 300);
		});
	}

	// Parallax
	let parallax = document.querySelector('.parallax');
	if(parallax){
		// if(isVisible(parallax))
			$('.parallax').parallax();
	}

	// Facts lazy
	let lazy = document.querySelectorAll('#facts .col .lazy');
	if(lazy.length){
		lazy.forEach(image => {
			let className = "";

			if(isInViewport(image)){
				className = 'lazy visible';
			}

			if(!isVisible(image)){
				className = 'lazy invisible'
			}

			image.setAttribute('class', 'lazy ' + className);
		})
	}
}

function initParticles(){
	
	var colorTop = Math2.rgbToHex('rgb(0,0,0)');

	var topImageMouseData = new ParticleData("/img/LogoDoMurashek_top.png", 5, .2, 0, colorTop, 2, .2, false);
	var topImageWaveData1 = new ParticleData("/img/LogoDoMurashek_top.png", 5, .2, 0, colorTop, 2, .2, false);
	var topImageWaveData2 = new ParticleData("/img/LogoDoMurashek_top.png", 5, .2, 0, colorTop, 2, .2, true);

	if($('#canvas-wrapper').length){

		p = new ParticlesApp(
			1750,
			330,
			'canvas', 
			'#canvas-wrapper',
			[topImageWaveData1, topImageWaveData2, topImageMouseData],
			null,
			null,
			100,
			10
		);

		setTimeout(() => {
			p.start();
		}, 200);
	}
}

$.fn.scrollEnd = function(callback, timeout) {          
	$(this).on('scroll', function(){
	  var $this = $(this);
	  if ($this.data('scrollTimeout')) {
		clearTimeout($this.data('scrollTimeout'));
	  }
	  $this.data('scrollTimeout', setTimeout(callback,timeout));
	});
};

$.fn.parallax=function(){
	return $(this).each(
		function(){

			let current = $(this).offset().top - $(window).scrollTop();
			let min = 0;
			let max = window.innerHeight - this.parentElement.offsetHeight;
			let percent = (current - max) / (min - max);
			let speed = 20;
			let ratio = window.innerWidth / window.innerHeight;
			let position = ((percent) * speed) - ((ratio - .5) * 10);

			$(this).css("transform","translateY( calc("+ position + "% - 60px))");
		}
	)
};

var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

function isVisible (ele) {
	const { top, bottom } = ele.getBoundingClientRect();
	const vHeight = (window.innerHeight || document.documentElement.clientHeight);
  
	return (
	  (top > 0 || bottom > 0) &&
	  top < vHeight
	);
}

function resizeEnllax(){

    let st = $('html, body').scrollTop();

    $('html, body').scrollTop(0);

    setTimeout(() => {

        $(window).enllax({
            disableWidth: 800,
            resizeEvt: resizeEnllax
        });

        $('html, body').scrollTop( st );

    }, 15 );

}

function animateBackgrounds(){

    // Logo animation

    let logoTop = $('.logo-top').offset().top - $('nav').outerHeight();
    let logoBottom = $('.logo-bottom').offset().top;
    let scrollTop = window.scrollTop = $('html, body').scrollTop();

    let percentVal = (scrollTop - logoBottom) / (logoTop - logoBottom);

    if(percentVal < 0.02) percentVal = 0;
    if(percentVal > 1) percentVal = 1;

    let percent = 100 - (percentVal * 100);

    $('.logo-final').css({
        backgroundPosition: percent+"% center"
    });


    // Top info block transparency
    let min = $('.text-bottom').offset().top - $('nav').outerHeight();
    let max = min + $('.top-info-block').innerHeight();
    let cur = (scrollTop - min) / (max - min);

    let opacity = 1 - cur;

    if( opacity > 1 ) opacity = 1;
    if( opacity < 0.01) opacity = 0;

    $('.top-info-block').css({
        opacity: opacity
    });

    // Billboard persons animation
    let leftMin = $('.billboard').offset().top + window.innerHeight / 6;
    let leftMax = leftMin - window.innerHeight / 6;
    let rightMax = leftMin - window.innerHeight / 3;

    let leftPos = (scrollTop - leftMin) / (leftMax - leftMin) * -100;
    let rightPos = (scrollTop - leftMin) / (rightMax - leftMin) * -100;

    if(leftPos > 0) leftPos = 0;
    if(rightPos > 0) rightPos = 0;

    $('.person-left').css({
        backgroundPosition: 'bottom ' + leftPos + '% center'
    });

    $('.person-right').css({
        backgroundPosition: 'bottom ' + rightPos + '% center'
    });
}

function flipCard(){
    let already = $(this).hasClass('flipped');
    let newClass = already ? '' : ' flipped';
    $(this).parents('#heroes-slider').find('.card-wrapper').removeClass('flipped');
    $(this).attr('class', 'card-wrapper' + newClass);
}

function prev(e){

    e.preventDefault();

    let currentSlideNum = $('.slide-container.active').data('slide');
    let nextSlideNum = currentSlideNum - 1;

    if(nextSlideNum < 1){
        nextSlideNum = $('.slides .slide-container').length;
    }

    let slide = document.querySelector('.slide-container[data-slide="'+nextSlideNum+'"] .slide');
    updateScales(slide, updateSlideText);
}

function next(e){
    e.preventDefault();

    let currentSlideNum = $('.slide-container.active').data('slide');
    let nextSlideNum = currentSlideNum + 1;

    if(nextSlideNum > $('.slides .slide-container').length){
        nextSlideNum = 1;
    }

    let slide = document.querySelector('.slide-container[data-slide="'+nextSlideNum+'"] .slide');
    updateScales(slide, updateSlideText);
}

function makeActive(e){
    updateScales(this, updateSlideText);
}

function makeActiveByDot(){
    let slideNum = $(this).data('slide');
    let slide = document.querySelector('.slide-container[data-slide="'+slideNum+'"] .slide');
    updateScales(slide, updateSlideText);
}

function updateScales(activeSlide, callback){

    let wrapper = $(activeSlide).parents('.slides'); 
    let parent = $(activeSlide).parents('.slide-container');
    let slideNum = parseInt($(parent).data("slide"));


    if(slideNum == activeSlideNum) return;

    let className = "active" + slideNum;
    wrapper.attr('class', 'slides').addClass(className);

    $('.slider-container').css({
        pointerEvents: 'none'
    });

    // Setup active items
    $('.slide-container').removeClass('active');
    $(parent).addClass('active');

    // Dots
    $('.slider-navi-dot').removeClass('active');
    $('.slider-navi-dot[data-slide="'+ slideNum +'"]').addClass('active');

    let slides = $(wrapper).find('.slide');
    let minScale = .5;
    let activeScale = 2;
    let count = slides.length;
    let step = (count - minScale) / count;

    let direction = slideNum > activeSlideNum ? "forward" : "backward";

    $(activeSlide).css({
        transform: 'scale('+activeScale+')'
    });

    for( let f=0; f<slideNum-1; f++ ){
        let s = slideNum - f - 1;

        let scale = activeScale - (step * s);
        if( scale < 0 ) scale=0;

        $(slides[f]).css({
            transform: 'scale('+scale+')'
        });
    }

    let start = slideNum+1;

    for ( let f=start; f<=count; f++ ){

        let scale = activeScale - (step * (f - slideNum));
        if( scale < 0 ) scale=0;

        let index = f-1;

        $(slides[index]).css({
            transform: 'scale('+scale+')'
        });
    }

    activeSlideNum = slideNum;

    setTimeout(() => {
        $('.slider-container').css({
            pointerEvents: 'all'
        });
    }, 600);

    if ( callback ) callback( slideNum, direction );
}

function updateSlideText( slideNum, direction ){

    let currentActive = $('.backstage-slide-text.active');
    let newActive = $('.backstage-slide-text[data-slide="'+slideNum+'"]');

    let currentActivePos = direction == 'forward' ? 'dn' : 'up';
    let newActivePos = direction == 'forward' ? 'up' : 'dn';

    newActive.addClass(newActivePos);

    setTimeout(() => {

        newActive.css({
            transition: 'transform .6s, opacity .6s'
        });
    
        currentActive.css({
            transition: 'transform .6s, opacity .6s'
        });
    
        newActive.removeClass(newActivePos).addClass('active');
        currentActive.removeClass('active').addClass(currentActivePos);
    
        setTimeout(() => {
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
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            shareEl: false,

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
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
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};