$(document).ready(function(){
    const slides = $('.image-slider-item');
    let currentIndex = 0;
    const captionList = $('.caption');
    const indicatorList = $('.slider-indicator');
    const imageIndicators =$('.slider-image-indicator img ');
    const speed = 250;
    const pauseButton = $('.pause-unpause-button img');
    let animationPlaying = false;
    let loop;
    function enableLoop(){
      loop = setInterval(function(){moveSlide(currentIndex+1,'100%','-100%');},4000);
    }
    enableLoop();
    function moveSlide(n, nextMove, prevMove) {
        if (animationPlaying) {return;}
         if (n > currentIndex) {
            if ( n > slides.length - 1) {n = 0; } 
            $(slides[n]).css({
                display:'block',
                left:nextMove
            });
            $(captionList[n]).css('display','none');
            /* for indicator button */
            $(indicatorList[currentIndex]).css('opacity','0.5');
            $(indicatorList[n]).css('opacity','1');
            /* for image indicator */
            $(imageIndicators[currentIndex]).css('opacity','0.6');
            $(imageIndicators[n]).css('opacity','1');
            animationPlaying = true;
            $(slides[n]).animate({left:'0'},speed,function(){
                $(captionList[n]).css('display','block');
            });
            $(slides[currentIndex]).animate({left:'-100%'},speed, function(){animationPlaying = false;});
            currentIndex = n;
        }
        else if (n < currentIndex) {
            if (animationPlaying) {return;}
            if ( n < 0) {n = slides.length - 1; }
            $(slides[n]).css({
                display:'block',
                left:prevMove
            });
            $(captionList[n]).css('display','none');
            /* for indicator button */
            $(indicatorList[currentIndex]).css('opacity','0.5');
            $(indicatorList[n]).css('opacity','1');
            /* for image indicator */
            $(imageIndicators[currentIndex]).css('opacity','0.6');
            $(imageIndicators[n]).css('opacity','1');
            animationPlaying = true;
            $(slides[n]).animate({left:'0'},speed,function(){
                 $(captionList[n]).css('display','block');
            });
            $(slides[currentIndex]).animate({left:'100%'},speed,function(){animationPlaying=false;});
            currentIndex = n;
        }
    };
   $('#nextButton').click(function(){
      moveSlide(currentIndex +1, '100%','-100%'); 
   });
   $('#prevButton').click(function(){
       moveSlide(currentIndex -1,'100%','-100%');
   });
   $(indicatorList).each(function(index){
       $(this).click(function(){moveSlide(index,'100%','-100%');});
   });
   $(imageIndicators).each(function(index){
       $(this).click(function(){moveSlide(index,'100%','-100%');});
   });
   /* swip function */
   let startingPoint, next, prev;
   $(slides).on({
       touchstart: function(e){
           clearInterval(loop);
           $(pauseButton).attr('src','img/unpause.png');
          startingPoint = e.touches[0].clientX;
       },
       touchmove: function(e) {
           if(animationPlaying) {return;}
           let currentTouch = e.touches[0];
           next = currentIndex+1;
           prev = currentIndex - 1;
           let change = currentTouch.clientX - startingPoint;
           let getWidth = $(slides[currentIndex]).width();
           if (next > slides.length - 1) {next = 0;};
           if ( prev < 0) {prev = slides.length - 1;}
           if (change < 0) { 
               $(slides[prev]).css({
                   display:'none',
                   left:'-100%;'
               });
               $(slides[next]).css({
                   display:'block',
                   left: getWidth + change + 'px'
               });
               $(slides[currentIndex]).css('left', change + 'px');
           }
           else if (change > 0) {
               $(slides[next]).css({
                   display:'none',
                   left:'100%;'
               });
               $(slides[prev]).css({
                   display:'block',
                   left: -(getWidth - change) + 'px'
               });
               $(slides[currentIndex]).css('left',change  + 'px');
           }
           e.preventDefault();
       }, 
       touchend: function(e){
           if(animationPlaying) {return;}
           let change = e.changedTouches[0].clientX - startingPoint;
           let getWidth = $(slides[currentIndex]).width();
           let threshold = getWidth/3;
           if ( Math.abs(change) > threshold) {
               if (change < 0) {
                   moveSlide(currentIndex + 1, getWidth + change + 'px','-100%');
               }
               if ( change > 0){
                   moveSlide(currentIndex - 1,'100%',-getWidth + change + 'px');
               }
           }
          else {
             if (change < 0) {
                $(slides[currentIndex]).animate({left:'0'},speed);
                $(slides[next]).animate({left:'100%'},speed); 
             }
             else if ( change > 0) {
                $(slides[currentIndex]).animate({left:'0'},speed);
                $(slides[prev]).animate({left:'-100%'},speed); 
             }
          }
        enableLoop();
        $(pauseButton).attr('src','img/pause.png');
       }
   });
   $(pauseButton).click(function(){
       $(this).attr('src', ($(this).attr('src') == 'img/pause.png' ? 'img/unpause.png' : 'img/pause.png'));
       $(this).attr('src') == 'img/pause.png' ? enableLoop() : clearInterval(loop);
   });
});
