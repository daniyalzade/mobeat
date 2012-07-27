function Toppages(host, apikey, domObj){  
  this._host = host;
  this._apikey = apikey;
  this._dom = domObj;
  this._lookback = 1;
  this._pageshown = false;
}

Toppages.prototype.setHost = function(host) {
  this._host = host;
}

Toppages.prototype.setLookback = function(lookback) {
  this._lookback = lookback;
}

Toppages.prototype.getFields = function() {
  return 'read,write,idle';
}

Toppages.prototype.onData = function(data) {
  this._loading = false;
  this._dom.empty();
  var that = this;
  var listview = $('<ul data-role="listview" data-theme="b"></ul>');
  var data = data['data']['top'];
  $.each(data, function(i, v) {
    var val = (v['val'] * 100).toFixed(1) + '%';
    listview.append("<li><a href='page.html' data-transition='flip'>%visitors - %title</a></li>".
        replace(/%title/, v['title']).
        replace(/%visitors/, val));
  });
  that._dom.append(listview);
  $.mobile.hidePageLoadingMsg()
  console.log('data loaded')
  if (this._pageshown) {
    listview.listview();
  }
}

Toppages.prototype.onPageShow = function() {
  this._pageshown = true;
  $('.title').text($(this._dom).parent().attr('id'));
  if (this._loading) {
    $.mobile.showPageLoadingMsg()
  }
}

Toppages.prototype.refresh = function() {
  this._loading = true;
  $('#' + $(this._dom).parent().attr('id')).live( 'pageshow', $.proxy(this.onPageShow, this));
  var url = 'http://192.168.116.43:2512/top/';
  data = {
    'apikey': this._apikey,
    'host': this._host,
    'fields': this.getFields(),
    'start': this._lookback + 'h',
  };
  $.ajax({
    url: url,
    data: data,
    dataType: 'jsonp',
    jsonp: 'jsonp',
    success: $.proxy(this.onData, this),
  });
}

EngagedPages.prototype = new Toppages();
function EngagedPages(host, apikey, domObj){
    Toppages.call(this, host, apikey, domObj);
}
EngagedPages.prototype.getFields = function() {
  return 'read,write';
}

SocialPages.prototype = new Toppages();
function SocialPages(host, apikey, domObj){
    Toppages.call(this, host, apikey, domObj);
}
SocialPages.prototype.getFields = function() {
  return 'social';
}
