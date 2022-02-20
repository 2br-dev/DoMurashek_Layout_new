class ZoomSlider{

    currentIndex;
    collection;
    type;
    gallerySlies = [];
    selector;

    constructor( selector, collection, type ){
        this.selector = selector;
        this.collection = collection;
        this.type = type || "image";
        $('body').on('click', this.selector, this.zoom.bind(this));
        $(window).on('scroll', this.close);
    }

    zoom(e){

        let parent = $(e.target).parents('.slide-container');

        if( parent.length && !parent.hasClass( 'active' ) ){
            return null;
        }

        let IMAGE_DOM = `
        <div class="viewer-wrapper">
            <img class="image-holder">
            <a class="viewer-prev"><i class="mdi mdi-chevron-left"></i></a>
            <a class="viewer-next"><i class="mdi mdi-chevron-right"></i></a>
            <a class="viewer-close"><i class="mdi mdi-close"></i></a>
        </div>`;

        let VIDEO_DOM=`
        <div class="viewer-wrapper">
            <div class="video-wrapper">
                <iframe id="video" width="560" id="video2" height="315" src="" title="YouTube video player" frameborder="0"></iframe>
            </div>
            <a class="viewer-prev"><i class="mdi mdi-chevron-left"></i></a>
            <a class="viewer-next"><i class="mdi mdi-chevron-right"></i></a>
            <a class="viewer-close"><i class="mdi mdi-close"></i></a>
        </div>`;  
        
        if(this.type=="image"){

            let rule = $(e.target).css('background-image');
            let image = rule.substring(5, rule.length - 2).replace(window.location.origin, "");
            this.currentIndex = this.collection.indexOf(image);

            $('body').append(IMAGE_DOM);
            
            $('.image-holder').attr({
                src: image
            });
        }else{

            let srcId = e.currentTarget.dataset['src'];
            let src="//www.youtube.com/embed/" + srcId + "?autoplay=1";

            this.currentIndex = this.collection.indexOf(srcId);

            $('body').append(VIDEO_DOM);
            $('#video').attr('src', src);

        }
    
    
        setTimeout(() => {
            $('.viewer-wrapper').addClass('opened');
    
            $('body').on('click', '.viewer-next', this.next.bind(this));
            $('body').on('click', '.viewer-prev', this.prev.bind(this));
            $('body').on('click', '.viewer-close', this.close.bind(this));
            $('body').on('click', '.viewer-wrapper', this.close1.bind(this));
        }, 80);
    }

    next(){

        this.currentIndex++;

        if ( this.currentIndex >= this.collection.length ){
            this.currentIndex = 0;
        }
        this.changeSlide();
    }

    prev(){
        this.currentIndex--;

        if ( this.currentIndex < 0  ){
            this.currentIndex = this.collection.length;
        }
        this.changeSlide();
    }

    changeSlide(){
        let nextSlide = this.collection[this.currentIndex];
        if(this.type == "image"){
            $('.image-holder').attr('src', nextSlide);
        }else{
            let src="//www.youtube.com/embed/" + nextSlide + "?autoplay=1";
            $('#video').attr('src', src);
        }
    }

    close(){
        $('body').off('click', '.viewer-next', this.next);
        $('body').off('click', '.viewer-prev', this.prev);
        $('body').off('click', '.viewer-close', this.close);
        $('body').off('click', '.viewer-wrapper', this.close1);
    
        $('.viewer-wrapper').removeClass('opened').animate({
            opacity: 0
        }, 400, () => {
            $('.viewer-wrapper').remove();
        });
    }

    close1(e){
        if(e.target == document.querySelector('.viewer-wrapper')){
            this.close();
        }
    }
}