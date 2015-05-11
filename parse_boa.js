boa_converter = { 
  parse_line: function(buf){
    var depth = 0;
    var state = 0;
    var var_name = "";
    var keys = [];
    var temp_key = "";
    var temp_value = "";
    for (var j=0;j<buf.length;j++){
      current_char = buf[j];
      if (current_char == "[")
        depth++;
      else if(current_char=="]")
        depth--;

      if (depth<0) return { success: false, reason: "Mismatching square brackets (depth < 0)" };

      if (state==0){
        if (current_char == "[" )
          state = 1;
        else
          var_name += current_char;
      }
      else if(state==1){
        if (depth == 0 && current_char == "]")
        {
          keys.push(temp_key);
          temp_key = "";
        }
        else if (depth == 0 && current_char == "=" ){
          state = 2; 
        }
        else if (depth > 1 || (depth == 1 && current_char != "[")) {
          temp_key += current_char;
        }
      }
      else if (state == 2){
        temp_value += current_char;
      }
    }
    if (depth != 0) 
      return { success: false, reason: "Mismatching square brackets", input: buf };
    else
      return { success: true, "var_name": var_name.trim(), "keys": keys, "value": temp_value.trim() };
  },
  csv_escape: function(value){
    return '"' + value.replace('"', '""') + '"';
  }
};

if (typeof module !== 'undefined'){
  module.exports = {
    parse_line: function(buf) { return boa_converter.parse_line( buf ); },
    csv_escape: function(value) { return boa_converter.csv_escape( value ); }
  };
}
