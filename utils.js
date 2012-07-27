function getDotted(data, field, def, delimeter) {
  delimeter = delimeter || '.';
  if (field.indexOf(delimeter) < 0) {
    return data[field] || def;
  }
  var components = field.split(delimeter);
  components = components.reverse();
  while (!!components.length && (typeof(data) == 'object')) {
    data = data[components.pop()]
  }
  // If there are components left, the final dest wasn't reached.
  if ((!!components.length) || (!data)) {
    return def
  }
  return data
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function stripTrailing(str, c) {
  if(str.substr(-1) == c) {
    return str.substr(0, str.length - 1);
  }
  return str;
}
