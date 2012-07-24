Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}

var PAGE_SELECTOR = '[data-role=page]';
function createNav() {
  /* Add Headers */ 
  $(PAGE_SELECTOR).each(function(index, v) {
    $(v).append('<div data-role="header" data-position="fixed" data-id="header"><h1>Mobeat</h1></div>');
  });

  $(PAGE_SELECTOR).each(function(i, v) {
    var footer = $('<div data-role="footer" data-position="fixed" data-id="footer"></div>')
    $(v).append(footer);
    $(PAGE_SELECTOR).each(function(index, value) {
      footer.append('<span class="dot"></span>')
    });
  });
  /* Add Footers */ 
}

function changePage(left) {
  var curPage = $.mobile.activePage.attr('id');
  var allPages = $(PAGE_SELECTOR).map(function(i, v) { return $(v).attr('id'); });
  var curIdx = $.makeArray(allPages).indexOf(curPage);
  var nextIdx = curIdx + (left ? -1 : 1);
  nextIdx = (nextIdx > 0) ? nextIdx : -1 * nextIdx;
  nextIdx = nextIdx % (allPages.length);
  var nextPage = allPages[nextIdx];
  /*
  var footer = $('#footer');
  footer.detach();
  $('#' + nextPage).append(footer);
  */
  $.mobile.changePage('#' + nextPage, "slide");
}

function attachNavEvents() {
  $(document).swiperight(function() { changePage(false) });
  $(document).swipeleft(function() { changePage(true) });
}

createNav();
$(function() {
  attachNavEvents();
});
