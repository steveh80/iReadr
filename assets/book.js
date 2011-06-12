var bookScroll;

function book (){
  var doc = document,
      sH = screen.height,
      sW = screen.width,
      barsHeight = ( ("standalone" in window.navigator) && window.navigator.standalone ) ? 0 : 50,
      hH = doc.getElementById('header').offsetHeight,
      fH = doc.getElementById('footer').offsetHeight,
      pagenumber = doc.getElementById('page'),
      book = doc.getElementById('book0'),
      bookfooter = doc.getElementById('bookfooter'),
      totpages = doc.getElementById('totpages'),
      scroller = doc.getElementById('scroller'),
      lineHeight = doc.defaultView.getComputedStyle(book,null).getPropertyValue('line-height').replace(/px$/, '') | 0,
      bookHeight = book.offsetHeight, //scrollHeight
      spaceHeight = Math.floor( (sH - hH - fH - barsHeight) / lineHeight ) * lineHeight,
      numPages = Math.ceil( bookHeight / spaceHeight ),
      bookFooterHeight = spaceHeight * numPages - bookHeight + lineHeight,
      debug = false;

  book.style.width = sW + "px";
  book.style.height = spaceHeight + "px";
  bookfooter.style.height = bookFooterHeight + "px";
  totpages.innerHTML = numPages;
  scroller.style.height = spaceHeight + "px";
  scroller.style.width = sW * numPages + "px";
  
  var indicator = doc.getElementById('indicator'),
      indicatorimg = doc.getElementById('indicatorimg'),
      iW = doc.defaultView.getComputedStyle(indicator,null).getPropertyValue('width').replace(/px$/, '') | 0,
      indicatorstep = iW / numPages;
  
  bookScroll = new iScroll('wrapper', {
    snap: true,
    momentum: false,
    hScrollbar: false,
    vScrollbar: false,
    onScrollStart: function () {
      
    },
    onScrollEnd: function () {
      pagenumber.innerHTML = this.currPageX+1;
      store.set('page', this.currPageX);
      indicatorimg.style.left = (indicatorstep * this.currPageX) + "px";
    }
  });
  
  for (i = 1; i < numPages; i++) {
    var clone = book.cloneNode(true);
    var page = book.parentNode.appendChild(clone);
    page.id = "book"+i;
    page.style.height = spaceHeight + "px";
    page.style.width = sW + "px";
    page.scrollTop = i*spaceHeight;
  }
  
  if(store.get('page')) {
    bookScroll.scrollToPage( store.get('page') , 0, 1);
  }
  else {
    bookScroll.scrollToPage(0, 0, 1);
  }
  setTimeout(function(){window.scrollTo(0,1);}, 10);

  
  if(debug) {
    var errorOutput = document.createElement('div');
    errorOutput.id = "errorOutput";
    errorOutput.style.display = "block";
    document.getElementById('book').appendChild(errorOutput);
    
    log.error('lineHeight: ' + lineHeight);

    log.error('screen.height: ' + screen.height);
    log.error('screen.width: ' + screen.width);

    log.error('document.height: ' + document.height);
    log.error('document.width: ' + document.width);

    log.error('window.height: ' + window.height);
    log.error('window.width: ' + window.width);

    log.error('header offsetHeight: '+ document.getElementById('header').offsetHeight);
    log.error('footer offsetHeight: '+ document.getElementById('footer').offsetHeight);
    log.error('numPages: ' + numPages);
    log.error('spaceHeight: ' + spaceHeight);
    log.error('bookHeight: ' + bookHeight);
    log.error('bookHeight2: ' + book.offsetHeight);
    log.error('spaceHeight: ' + spaceHeight);
    log.error('scroller width: ' + document.getElementById('scroller').style.width);
    log.error('scroller height: ' + document.getElementById('scroller').style.height);
  }

};

var log = (function() {
  return {  error : function(msg) { document.getElementById('errorOutput').appendChild(document.createElement('div')).innerHTML = msg } }
})();

window.onload = function(){
  if((/iphone|android/gi).test(navigator.appVersion)) {
    setTimeout(book, 100);
  }
  else {
    //document.getElementById('footer').style.display = "none";
  }
  
  document.getElementById('prev').addEventListener('touchstart', function(){bookScroll.scrollToPage('prev', 0);return false;}, false);
  document.getElementById('next').addEventListener('touchstart', function(){bookScroll.scrollToPage('next', 0);return false;}, false);
  
  document.getElementById('bookmark').addEventListener('touchstart', function(){alert('fatto');}, false);
  
  /*
  new NoClickDelay(document.getElementById('header'));
  new NoClickDelay(document.getElementById('footer'));
  */
  
};


//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener('DOMContentLoaded', book, false);