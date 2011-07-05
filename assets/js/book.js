var bookScroll;
var bookSlug;

function bookCreate() {
  
  /*Set genaral variables*/
  var doc = document,
      isIPhone = (/iphone/gi).test(navigator.appVersion),
      isIPad = (/ipad/gi).test(navigator.appVersion),
      density = window.devicePixelRatio,
      orientation = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait',
      standalone = ( ("standalone" in window.navigator) && window.navigator.standalone );
  
  /*Set genaral elements*/
  var wrapper = doc.getElementById('wrapper'),
      scroller = wrapper.children[0],
      bookMain = scroller.children[0], /* doc.getElementById('book0') */
      bookFooter = doc.getElementById('bookfooter'),
      totPages = doc.getElementById('totpages'),
      pagenumber = doc.getElementById('page'),
      bookmark = doc.getElementById('bookmark'),
      indicator = doc.getElementById('indicator'),
      loading = doc.getElementById('loading');
  
  loading.style.display = "block";
  
  [].slice.apply(scroller.querySelectorAll('.added')).forEach(function(element){
    element.parentNode.removeChild(element)
  });

  if (typeof store.get(bookSlug + '-style') !== 'undefined') setStyle(store.get(bookSlug + '-style'));
  
  if (typeof store.get(bookSlug + '-size') !== 'undefined') {
    bookMain.style.fontSize = store.get(bookSlug + '-size') + "%";
  }
  
  /*Set genaral elements*/
  var screenHeight = ( orientation === 'portrait' ) ? 510 : 300,
      barsHeight = 0;
  
  if(isIPhone) {
    barsHeight = standalone ? 10 : 50;
    screenHeight = ( orientation === 'portrait' ) ? 480 : 340;
  }
  
  if(isIPad) {
    barsHeight = standalone ? 25 : 70;
    screenHeight = ( orientation === 'portrait' ) ? 1024 : 768;
  }
  
  var screenWidth = wrapper.offsetWidth,
      headerHeight = doc.getElementById('header').offsetHeight,
      footerHeight = doc.getElementById('footer').offsetHeight,
      
      lineHeight = doc.defaultView.getComputedStyle(bookMain,null).getPropertyValue('line-height').replace(/px$/, '') | 0,
      bookHeight = bookMain.scrollHeight, // offsetHeight
      
      spaceHeight = Math.floor( (screenHeight - headerHeight - footerHeight - barsHeight) / lineHeight ) * lineHeight,
      numPages = Math.ceil( bookHeight / spaceHeight ),
      bookFooterHeight = spaceHeight * numPages - bookHeight + lineHeight,
      
      debug = false;

  // wrapper.style.width = screenWidth + "px";
  bookMain.style.width = screenWidth + "px";
  bookMain.style.height = spaceHeight + "px";
  bookFooter.style.height = bookFooterHeight + "px";
  scroller.style.height = spaceHeight + "px";
  scroller.style.width = screenWidth * numPages + "px";
  totPages.innerHTML = numPages,
  indicatorStep = (doc.defaultView.getComputedStyle(indicator,null).getPropertyValue('width').replace(/px$/, '') | 0) / numPages;
  
  if (typeof bookScroll === 'object') {
    bookScroll.refresh();
  }
  else {
    var bookScroll = new iScroll('wrapper', {
      snap: true,
      momentum: false,
      hScrollbar: false,
      vScrollbar: false,
      //onScrollStart: function () { //pagenumber.innerHTML = this.dirX; },
      //onBeforeScrollMove: function() { //totPages.innerHTML = this.dirX; },
      onScrollEnd: function () {
        pagenumber.innerHTML = this.currPageX + 1;
        store.set(bookSlug + '-page', this.currPageX);
        indicator.children[0].style.left = Math.floor(indicatorStep * this.currPageX) + "px";
        window.currPage = this.currPageX;
      
        if (store.get(bookSlug + '-bookmark') === this.currPageX) {
          bookmark.setAttribute("class", "active");
        }
        else {
          bookmark.setAttribute("class", "");
        }
      }
    });
  }
  
  for (i = 1; i < numPages; i++) {
    var clone = bookMain.cloneNode(true);
    var page = bookMain.parentNode.appendChild(clone);
    page.id = "book"+i;
    page.className = "pages added";
    page.style.height = spaceHeight + "px";
    page.style.width = screenWidth + "px";
    page.scrollTop = spaceHeight * i;
  }
  
  if (store.get(bookSlug + '-page')) {
    bookScroll.scrollToPage( store.get(bookSlug + '-page') , 0, 1);
  }
  else {
    bookScroll.scrollToPage(0, 0, 1);
  }
  
  setTimeout( function() { window.scrollTo(0,1); }, 200 );
  
  setTimeout( function() { loading.style.display = "none"; }, 500 );
  
  setTimeout( function() { window.scrollTo(0,1); }, 1000 );
  
  if (debug) {
    var errorOutput = document.createElement('div');
    errorOutput.id = "errorOutput";
    errorOutput.style.display = "block";
    document.getElementById('book').appendChild(errorOutput);
    
    log.error('lineHeight: ' + lineHeight);

    log.error('screen.height: ' + screen.height);
    log.error('screen.width: ' + screen.width);
    
    log.error('window.outerHeight: ' + window.outerHeight);
    log.error('window.innerHeight: ' + window.innerHeight);

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
return true;
};

window.onload = function() {
  var title = document.getElementById('title');
  document.title = title.innerHTML;
  bookSlug = slugify( title.innerHTML );
  
  var bookmark = document.getElementById('bookmark'),
      style = document.getElementById('style'),
      aa = document.getElementById('aa'),
      styles = document.getElementById('styles');
  
  if ((/android/gi).test(navigator.appVersion)) {
    style.style.display = "none";
    aa.style.display = "none";
  }
  
  setBook();
  
  bookmark.addEventListener('touchstart', function (e){
    e.preventDefault();
    var bookmarkclass = bookmark.getAttribute("class");
    if (bookmarkclass === 'active') {
      store.set(bookSlug + '-bookmark', '');
      bookmark.setAttribute("class", "");
    }
    else {
      store.set(bookSlug+'-bookmark', window.currPage);
      bookmark.setAttribute("class", "active");
    }
    return false;
  }, false);
  
  aa.addEventListener('touchstart', function (e){
    e.preventDefault();
    document.getElementById('loading').style.display = "block";
    
    if (typeof store.get(bookSlug + '-size') !== 'undefined') {
      var fontsize = ( store.get(bookSlug + '-size') == 100 ) ? 130 : 100;
      store.set(bookSlug + '-size', fontsize)
    }
    else {
      store.set(bookSlug + '-size', 100);
    }
    
    bookCreate();
  }, false);
  
  style.addEventListener('touchstart', function (e){
    e.preventDefault();
    var styleclass = document.defaultView.getComputedStyle(styles, null).getPropertyValue('display');
    if (styleclass === 'block') {
      styles.style.display = "none";
    }
    else {
      styles.style.display = "block";
    }
    return false;
  }, false);
  
  document.getElementById('stylesDefault').addEventListener('touchstart', function (e){
    e.preventDefault();
    setStyle('default');
    bookCreate();
    styles.style.display = "none";
  }, false);
  
  document.getElementById('stylesOld').addEventListener('touchstart', function (e){
    e.preventDefault();
    setStyle('old');
    bookCreate();
    styles.style.display = "none";
  }, false);
  
  document.getElementById('stylesFashion').addEventListener('touchstart', function (e){
    e.preventDefault();
    setStyle('fashion');
    bookCreate();
    styles.style.display = "none";
  }, false);
  
  document.getElementById('stylesAntiqua').addEventListener('touchstart', function (e){
    e.preventDefault();
    setStyle('antiqua');
    bookCreate();
    styles.style.display = "none";
  }, false);

};

window.addEventListener('orientationchange', bookCreate, false);
// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

//document.addEventListener('DOMContentLoaded', book, false);