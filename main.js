Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}

var PAGE_SELECTOR = '[data-role=page]';

function highlightCurPage(pageIdx) {
  $(PAGE_SELECTOR).each(function(i, v) {
    $(v).find('.dot').each(function(index, value) {
      if (index == pageIdx) {
        $(value).addClass('active')
      }
      else {
        $(value).removeClass('active')
      }
    });
  });
}

function onSelectChange(e) {
  var val = $(this).val();
  $('.lookbackSelect').each(function(i, v) {
    $(v).find($("option")).filter(function() {
        return $(this).val() == val; 
    }).attr('selected', true);
  });
}

function createNav() {
  /* Add Headers */ 
  $(PAGE_SELECTOR).each(function(index, v) {
    $(v).append(
      "<div class='ui-grid-a' data-role='header' data-position='fixed' data-id='header'> \
      <div class='logo ui-block-a'></div> \
      <div class='lookback ui-block-b'></div> \
      </div>");
  });

  var select = $("<select class='lookbackSelect'> \
		<option value='1'>1 hour</option> \
		<option value='2'>2 hours</option> \
		<option value='12'>12 hours</option> \
		<option value='24'>24 hours</option> \
        </select>");
  $('.lookback').append(select);
  select.change(onSelectChange);
  $('.logo').append('<img src="chartbeat-on-black-small.png">')
  /* Add Footers */ 
  $(PAGE_SELECTOR).each(function(i, v) {
    var footer = $('<div data-role="footer" data-position="fixed" data-id="footer"></div>')
    var footerContainer = $('<div class="footerContainer"></div>');
    $(v).append(footer);
    footer.append(footerContainer);
    $(PAGE_SELECTOR).each(function(index, value) {
      footerContainer.append('<span class="dot"></span>')
    });
  });
}

function getCurPageIdx() {
  var curPage = ''
  if (!!$.mobile.activePage) {
    curPage = $.mobile.activePage.attr('id');
  } else {
    var hash = window.location.hash;
    if (!hash) {
      return 0
    }
    curPage = hash.replace('#', '');
  }
  var allPages = $(PAGE_SELECTOR).map(function(i, v) { return $(v).attr('id'); });
  var curIdx = $.makeArray(allPages).indexOf(curPage);
  return curIdx;
}

function changePage(left) {
  var curIdx = getCurPageIdx();
  var nextIdx = curIdx + (left ? 1 : -1);
  var allPages = $(PAGE_SELECTOR).map(function(i, v) { return $(v).attr('id'); });
  nextIdx = (nextIdx > 0) ? nextIdx : -1 * nextIdx;
  nextIdx = nextIdx % (allPages.length);
  var nextPage = allPages[nextIdx];
  highlightCurPage(nextIdx);
  $.mobile.changePage('#' + nextPage, "slide");
}

function attachNavEvents() {
  $(document).swiperight(function() { changePage(false) });
  $(document).swipeleft(function() { changePage(true) });
}

/*
function instanceGetter(fields) {
  return function(domain, apikey, content) {
    return new Toppages
  }
}
*/
pages = {
  'toppages': Toppages,
  'engagement': EngagedPages,
}

function initPages() {
  $(PAGE_SELECTOR).each(function(i, v) { 
    var pageId = $(v).attr('id');
    var pageClass = pages[pageId];
    if (pageClass) {
      console.log($(v));
      var content = $($(v).find('[data-role=content]')[0]);
      console.log(content);
      var page = new pageClass('nytimes.com', '', content); 
      page.refresh();
    }
  });
}
$(function() {
  createNav();
  highlightCurPage(getCurPageIdx());
  attachNavEvents();
  initPages();
});
