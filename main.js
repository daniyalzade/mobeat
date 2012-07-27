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
  var idx = 0;
  $('.'+ e.target.className).each(function(i, v) {
    $(v).find($("option")).attr('selected', false);
    $(v).find($("option")).filter(function() {
        return $(this).val() == val; 
    }).attr('selected', true);
  });
  try {
    $('.'+ e.target.className).selectmenu('refresh', true);
  } catch(e) {
    /* This call fails if the view has not been initialized */
  }
  var updateHost = (e.target.className == 'domainsSelect');
  $.each(pages, function(i, v) { 
    var inst = v['inst'];
    if (inst) {
      updateHost ? inst.setHost(val) : inst.setLookback(val);
    }
    inst.refresh();
  });
}

function createNav() {
  /* Add Headers */ 
  $(PAGE_SELECTOR).each(function(index, v) {
    $(v).append(
      "<div class='ui-grid-b' data-role='header' data-position='fixed' data-id='header'> \
      <div class='domains ui-block-a'></div> \
      <div class='ui-block-b'><div class='title centered'>Engagement</div></div> \
      <div class='lookback ui-block-c'></div> \
      </div>");
    });

var domainsSelect = $("<div class='domainsSelectContainer'><select data-icon='false' data-mini='true' class='domainsSelect'> \
          <option value='webrazzi.com'>webrazzi.com</option> \
          <option value='techcrunch.com'>techcrunch.com</option> \
          <option value='gizmodo.com'>gizmodo.com</option> \
          <option value='nytimes.com'>nytimes.com</option> \
          <option value='ted.com'>ted.com</option> \
          <option value='someecards.com'>someecards.com</option> \
</select></div>");
    var select = $("<div class='lookbackSelectContainer'><select data-icon='false' data-mini='true' class='lookbackSelect'> \
          <option value='1'>1 hour</option> \
          <option value='2'>2 hours</option> \
          <option value='12'>12 hours</option> \
          <option value='24'>24 hours</option> \
</select></div>");
    console.log('subscribe to change', select, domainsSelect);
    $('.domains').append(domainsSelect);
    $('.lookback').append(select);

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
    $('select').change(onSelectChange);
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

pages = {
  'toppages': {
    'class': Toppages,
    'inst': null
  },
  'engagement': {
    'class': EngagedPages,
    'inst': null
  },
  'social': {
    'class': SocialPages,
    'inst': null
  }
}

function initPages() {
  $(PAGE_SELECTOR).each(function(i, v) { 
    var pageId = $(v).attr('id');
    console.log(pageId, pages);
    if (pages[pageId]) {
      var pageClass = pages[pageId]['class'];
      if (pageClass) {
        var content = $($(v).find('[data-role=content]')[0]);
        var host = $('select.domainsSelect option:selected').val() 
        var lookback = $('select.lookbackSelect option:selected').val() 
        var page = new pageClass(host, '', content); 
        pages[pageId]['inst'] = page;
        page.refresh();
      }
    }
  });
}

function onDomains(domains) {
  var domains = domains['domains'];
  console.log(domains)
}

$(function() {
  createNav();
  highlightCurPage(getCurPageIdx());
  attachNavEvents();
  initPages();
});
