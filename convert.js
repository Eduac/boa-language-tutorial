if ( process.argv.length < 3 ){
  console.log("usage: node convert.js <filename>");
}
else {
  var filename = process.argv[2];
  var fs = require('fs');
  var parse_boa = require('./parse_boa');

  fs.readFile(filename, function(err, data) {
    var buffer_string = data.toString();
    var buffer_string_splitted = buffer_string.split('\n');

    var tmp = [];
    var max_key_count = 0;
    var foundError = false;
    for (var i=0;i<buffer_string_splitted.length;i++){
      var line_buffer = buffer_string_splitted[i].trim();
      if ( line_buffer.length > 0 ){
        var result = parse_boa.parse_line( line_buffer );
        tmp.push(result);
        if ( result.success ){
          if ( max_key_count < result.keys.length )
            max_key_count = result.keys.length;
        }
        else{
          foundError = true;
          console.log(result);
          process.exit(1); // failure
        }
      }
    }

    if(foundError==false){
      var header = ["var_name"];
      for ( var i=0;i<max_key_count;i++){
        header.push("key_" + i);
      }
      header.push("value");
      var header_str = header.join(",");
      console.log(header_str);
      for ( var i=0;i<tmp.length;i++){
        var data_row = [ tmp[i].var_name ];
        for ( var j=0;j<tmp[i].keys.length;j++)
          data_row.push(tmp[i].keys[j]);
        for ( var j=tmp[i].keys.length;j<max_key_count;j++)
          data_row.push("");
        data_row.push(tmp[i].value);
        console.log(data_row.map(parse_boa.csv_escape).join(","));
      }
    }
  });
}
