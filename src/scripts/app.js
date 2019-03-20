import 'babel-polyfill';
import 'normalize.scss/normalize.scss';
import './../styles/styles.scss';

import $ from 'jquery';
import { TweenLite, TimelineMax } from 'gsap';

let tlClicked = new TimelineMax();
let tlStatic = new TimelineMax();
const btn = document.querySelector('.j-view-toggle');

const textAnimation = tlStatic
    .staggerFromTo(
        $('.j-text'),
        0.9,
        {y: -60},
        {y: 0, delay: 1.8, ease:Power2.easeOut}
    )
    .staggerFromTo(
        $('.j-link'),
        0.9,
        {opacity: 0},
        {opacity: 1, delay: 0.3, ease:Power2.easeOut}
    );

const leftWidthAnimation = TweenLite.to(
    $('.j-left-block'),
    1,
    {width:"60%",  ease:Power2.easeOut}
).reversed(true);

const rightWidthAnimation = TweenLite.to(
    $('.j-right-block'),
    1,
    {width:"40%",  ease:Power2.easeOut}
).reversed(true);

const imagePositionAnimation = TweenLite.to(
    $('.slider-img'),
    1,
    {x:"-80",  ease:Power2.easeOut}
).reversed(true);

const likedAnimation = tlClicked
    .staggerFromTo(
        $('.j-liked-icon'),
        0.2,
        {scale: 1.3, opacity: 0},
        {scale: 1, opacity: 1, delay: 0.5, }
    )
    .staggerFromTo(
        $('.j-liked-item'),
        0.3,
        {y:-20,opacity: 0},
        {y: 0,opacity: 1, stagger:0.09}
    )
    .reversed(true);

const toggleDirection = () => {
    leftWidthAnimation.reversed( !leftWidthAnimation.reversed() );
    rightWidthAnimation.reversed( !rightWidthAnimation.reversed() );
    likedAnimation.reversed( !likedAnimation.reversed() );
    imagePositionAnimation.reversed( !imagePositionAnimation.reversed() );
};

textAnimation;

btn.addEventListener('click', () => {
    toggleDirection();
});

/**
 * анимация слайдера
 */
const imageContainer = $(".slider-slice-imageContainer");
const    delay       = 0.1;
let imageActive      = $(".image-active");
let    delays        = [];

function positionImages(){
    const image          = $(".slider-slice img");
    let vw          = $(window).width();
    let vh          = $(window).height();
    let imageW  = image.width();
    let imageH  = image.height();
    let ratioImg = imageW / imageH;
    let ratioW   = vw / vh;

    if (ratioImg > ratioW) {
        image.css({"width": "auto", "height" : vh, "top": 0});
    } else {
        image.css({"width": vw, "height" : "auto"});
    }
}
positionImages();
$(window).on("resize", positionImages);

TweenMax.set(imageContainer, {yPercent: "100"});
TweenMax.set(imageActive, {yPercent: "0"});

for (let i = 0; i < 3; i++) {
    delays.push(i * delay);
};

const tlOpening = new TimelineMax();
let delayOpening = 0.05;

tlOpening
    .fromTo(($(".slider-slice-imageContainer.image-active").eq(0)), 1, {yPercent: -100}, {yPercent:0, ease: Power2.easeInOut}, 1 * delayOpening)
    .fromTo(($(".slider-slice-imageContainer.image-active").eq(1)), 1, {yPercent: -100}, {yPercent:0, ease: Power2.easeInOut}, 2 * delayOpening)
    .fromTo(($(".slider-slice-imageContainer.image-active").eq(2)), 1, {yPercent: -100}, {yPercent:0, ease: Power2.easeInOut}, 3 * delayOpening)
    .fromTo(($(".slider-slice-imageContainer.image-active").eq(3)), 1, {yPercent: -100}, {yPercent:0, ease: Power2.easeInOut}, 4 * delayOpening);

let durationSlide = 0.8;
let isMoving      = false;

function slideBackground(fromTop){
    const tlSlideBackground   = new TimelineMax({onComplete: function(){ isMoving = false}});
    let from;
    let to;
    let k = 0;
    let nextSlice;
    isMoving = true;
    imageActive       = $(".image-active");

    if(fromTop === true){
        from = 105;
        to = -100;
    }else{
        from = -105;
        to = 100;
    }

    imageActive.each(function(i,el){
        const parent = $(el).closest(".slider-slice");

        if (fromTop === true){
            nextSlice = $(el).next();
        }else{
            nextSlice = $(el).prev();
        }
        if (nextSlice.is(':last-child') || nextSlice.is(':first-child')) {
            parent.find(".slider-slice-imageContainer").eq(0).appendTo(parent);
        }
        if (nextSlice.index() == -1){
            parent.find(".slider-slice-imageContainer").eq(0).appendTo(parent);
            nextSlice = $(el).prev();
        }

        tlSlideBackground
            .to(el, (durationSlide * 1.1), {yPercent: to, ease: Power2.easeInOut}, delays[k])
            .fromTo(nextSlice, durationSlide, {yPercent: from}, {yPercent:0, ease: Power2.easeInOut}, delays[k]);
        $(el).removeClass("image-active");
        nextSlice.addClass("image-active");
        k++;
        if(k === 4){
            k=0;
        }
    });
}

/**
 * смена слайдов
 */
$(".navigation-next").click(function(){
    var fromTop = false;
    if(!(isMoving)){
        slideBackground(fromTop);
    }
});

$(".navigation-prev").click(function(){
    var fromTop = true;
    if(!(isMoving)){
        slideBackground(fromTop);
    }
});
