/**
 * 指定した数のスペースを返す
 * ※インデント用
 */ 
function spaces(len) {
  var s = '';
  var indent = len*4;
  for (var i=0;i<indent;i++) {s += " ";}
 
  return s;
}
 
/**
 * XMLフォーマットの文字列を渡すと
 * 整形した文字列を返す
 */
function format_xml(str) {
  var xml = '';
 
  // タグの区切りで改行コードを挿入
  str = str.replace(/(>)(<)(\/*)/g,"$1\n$2$3");
 
  // インデント周りの値
  var pad = 0;
  var indent;
  var node;
 
  // 改行コードで分割
  var strArr = str.split("\n");
 
  for (var i = 0; i < strArr.length; i++) {
    indent = 0;
    node = strArr[i];
 
    if(node.match(/.+<\/\w[^>]*>$/)) { //一行で完結しているタグはそのまま
      indent = 0;
    } else if(node.match(/^<\/\w/)) { // 閉じタグ時はインデントを減らす
      if (pad > 0){pad -= 1;}
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)){ // 開始タグはインデントを増やす
      indent = 1;
    } else {
      indent = 0;
    }
    xml += spaces(pad) + node + "\n";
    pad += indent;
  }
  return xml;
}