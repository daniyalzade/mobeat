function Toppages(host, apikey, domObj){  
  this._host = host;
  this._apikey = apikey;
  this._dom = domObj;
}

Toppages.prototype.getFields = function() {
  return 'read,write,idle';
}

Toppages.prototype.onData = function(data) {
  this._dom.empty();
  var that = this;
  var listview = $('<ul data-role="listview" data-theme="b"></ul>');
  var data = data['data']['top'];
  $.each(data, function(i, v) {
    listview.append("<li><a href='page.html' data-transition='flip'>%visitors - %title</a></li>".
        replace(/%title/, v['title']).
        replace(/%visitors/, v['val']));
  });
  that._dom.append(listview);
  if (this.init()) {
    listview.listview();
  }
}

Toppages.prototype.init = function() {
  return true;
}

Toppages.prototype.refresh = function() {
  var url = 'http://192.168.116.43:2512/top/';
  data = {
    'apikey': this._apikey,
    'host': this._host,
    'fields': this.getFields(),
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

EngagedPages.prototype.init = function() {
  return false;
}

SocialPages.prototype = new Toppages();
function SocialPages(host, apikey, domObj){
    Toppages.call(this, host, apikey, domObj);
}
SocialPages.prototype.getFields = function() {
  return 'social';
}

SocialPages.prototype.init = function() {
  return false;
}
