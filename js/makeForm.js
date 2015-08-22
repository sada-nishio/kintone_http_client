(function() {
    'use strict';

    var countParmBox = 0;
    var countHeaderBox = 0;

    function createParmBox() {
        var id = 'parm-box' + countParmBox;
        countParmBox++;
        var $keyValueSet = $('<p />')
            .attr('id', id)
            .addClass('parm-box');
        var $keyBox = $('<input />')
            .attr('type', 'text')
            .attr('size', '30')
            .attr('placeholder', 'key')
            .addClass('parm-key');
        var $splitEl = $('<span />')
            .text(':')
            .addClass('split-el');
        var $valueBox = $('<input />')
            .attr('type', 'text')
            .attr('size', '30')
            .attr('placeholder', 'value')
            .addClass('parm-value');
        var $addButton = $('<img />')
            .attr('src', 'https://js-workspace-sada-nishio.c9.io/test/img/add-button.png')
            .addClass('add-row')
            .click(createParmBox);
        var $delButton = $('<img />')
            .attr('src', 'https://js-workspace-sada-nishio.c9.io/test/img/delete-button.png')
            .attr('title', id)
            .addClass('delete-row')
            .click(deleteBox);
        $keyValueSet.append($keyBox);
        $keyValueSet.append($splitEl);
        $keyValueSet.append($valueBox);
        $keyValueSet.append($addButton);
        if ($('.parm-box').length === 0) {
                $delButton.css('visibility','hidden');
        }
        $keyValueSet.append($delButton);
        $('#req-urlparms').append($keyValueSet);
    }

    function createHeaderBox() {
        var id = 'heder-box' + countHeaderBox;
        countHeaderBox++;
        var $keyValueSet = $('<p />')
            .attr('id', id)
            .addClass('header-box');
        var $keyBox = $('<input />')
            .attr('type', 'text')
            .attr('size', '30')
            .attr('placeholder', 'key')
            .attr('autocomplete', 'on')
            .attr('list', 'head-key')
            .addClass('header-key');
        var $splitEl = $('<span />')
            .text(':')
            .addClass('split-el');
        var $valueBox = $('<input />')
            .attr('type', 'text')
            .attr('size', '30')
            .attr('placeholder', 'value')
            .attr('autocomplete', 'on')
            .attr('list', 'head-value')
            .addClass('header-value');
        var $addButton = $('<img />')
            .attr('src', 'https://js-workspace-sada-nishio.c9.io/test/img/add-button.png')
            .addClass('add-row')
            .click(createHeaderBox);
        var $delButton = $('<img />')
            .attr('src', 'https://js-workspace-sada-nishio.c9.io/test/img/delete-button.png')
            .attr('title', id)
            .addClass('delete-row')
            .click(deleteBox);
        $keyValueSet.append($keyBox);
        $keyValueSet.append($splitEl);
        $keyValueSet.append($valueBox);
        $keyValueSet.append($addButton);
        if ($('.header-box').length === 0) {
                $delButton.css('visibility','hidden');
        }
        $keyValueSet.append($delButton);
        $('#req-headers').append($keyValueSet);
    }

    function deleteBox() {
        $('#' + this.title).remove();
    }

    function displayResponse(data){
        var respObj = JSON.parse(data);
        //var respObj = JSON.parse(data.replace(/\s+/g, ""));
        $('#resp-status').val(respObj.httpStatus);

        if (typeof(respObj.responseHeader) === 'object') {
            $('#resp-headers').val(JSON.stringify(respObj.responseHeader,'','\t'));
        } else {
            $('#resp-headers').val(respObj.responseHeader);
        }

        try {
            var str = '{"respBody":' + respObj.responseBody + '}';
            var respBodyObj = JSON.parse(str);
            $('#resp-body').val(JSON.stringify(respBodyObj.respBody,'','\t'));
        } catch(e) {
            console.log(e);
            //$('#resp-body').val(format_xml(respObj.responseBody));
            $('#resp-body').val(respObj.responseBody);
        }
    }

    function sendRequest() {
        //URLパラメータをアドレスバーに追加
        addUrlParm();

        var reqUrl = 'api/request.php';
        var dataType = '';

        //Parameters
        var params = {};
        //url
        if ($('#req-url').val() === '') {
            alert('URLは必須です');
            return false;
        }
        params['url'] = encodeURI($('#req-url').val());
        //method
        params['method'] = $('#req-method').val();
        //headers
        var headers = {};
        $('.header-box').each(function() {
            var key = $(this)[0].children[0].value;
            var val = $(this)[0].children[2].value;
            headers[key] = val;
        })
        params['headers'] = headers;
        //body
        //params['body'] = JSON.parse($('#req-body-txt').val());
        params['body'] = $('#req-body-txt').val();

        //レスポンス結果を空にする
        $('#resp-status').val('');
        $('#resp-headers').val('');
        $('#resp-body').val('');

        $.ajax({
            url: reqUrl,
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            data: JSON.stringify(params),
            success: displayResponse
        });
    }

    function clearInput() {
        /*
        $('#req-url').val('');
        $('#req-method').val('GET');
        $('.header-box').each(function() {
            $(this)[0].children[0].value = '';
            $(this)[0].children[2].value = '';
        })
        $('#req-body-txt').val('');
        $('#response').val('');
        */
        location.reload();
    }

    function setSubmit() {
        $('#submit').click(sendRequest);
    }

    function setCancel() {
        $('#cancel').click(clearInput);
    }

    //リクエストを送信した時、アドレスバーのURLを変更する
    function addUrlParm() {
        //default url
        var url = location.pathname;
        if (url.indexOf('index.html') === -1) {
            url += 'index.html?';
        } else {
            url += '?';
        }

        //add url Parm
        url += "url=" + encodeURIComponent($('#req-url').val());

        //add method Parm
        url += "&method=" + encodeURIComponent($('#req-method').val());

        //header Parm
        var count = 0;
        $('.header-box').each(function() {
            var key = $(this)[0].children[0].value;
            var val = $(this)[0].children[2].value;
            if (key !== '' || val !== '') {
                //url += '&header[' + count + ']=' + encodeURIComponent(key + ':' + val);  --> パスワードがURLに表示されるのはまずい気がする
                url += '&header[' + count + ']=' + encodeURIComponent(key + ':');
                count++;
            }
        });

        //add body Parm
        if ($('#req-body-txt').val() !== '') {
            url += '&body=' + encodeURIComponent($('#req-body-txt').val().replace(/\s+/g, ""));
        }
        history.pushState('','',url);
    }

    function getQueryString() {
        var result = {};
        if(window.location.search.length > 1) {
            // 最初の1文字 (?記号) を除いた文字列を取得する
            var query = window.location.search.substring(1);
            // クエリの区切り記号 (&) で文字列を配列に分割する
            var parameters = query.split( '&' );
            for(var i = 0; i < parameters.length; i++) {
                // パラメータ名とパラメータ値に分割する
                var element = parameters[i].split('=');
                var paramName = decodeURIComponent(element[0]);
                var paramValue = decodeURIComponent(element[1]);
                // パラメータ名をキーとして連想配列に追加する
                result[paramName] = paramValue;
            }
            return result;
        } else {
            return null;
        }
    }

    function setQueryParm(parm) {
        var headerLength = 0;
        for (var key in parm) {
            //console.log(key);
            switch (key) {
                case 'url':
                    $('#req-url').val(decodeURIComponent(parm.url));
                    break;
                case 'method':
                    $('#req-method').val(decodeURIComponent(parm.method));
                    break;
                //case /header\[[0-9]\]/.test(key):
                case 'body':
                    try {
                        var bodyObj = JSON.parse(decodeURIComponent(parm.body));
                        var jsonStr = JSON.stringify(bodyObj,'','\t');
                        $('#req-body-txt').val(jsonStr);
                        break;
                    } catch(e) {
                        var str = decodeURIComponent(parm.body);
                        $('#req-body-txt').val(str);
                        break;
                    }

                    var bodyStr = JSON.stringify(bodyObj,'','\t');
                    $('#req-body-txt').val(bodyStr);
                    break;
                default:
                    if (key.match(/header\[[0-9]+\]/)) {
                        var headerArray = decodeURIComponent(parm[key]).split(':');
                        var headerKey = headerArray[0];
                        var headerVal = headerArray[1];

                        if (headerLength !== 0) {
                            createHeaderBox();
                        }

                        $('.header-box').each(function() {
                            var keyBox = $(this)[0].children[0].value;
                            if (keyBox === '') {
                                $(this)[0].children[0].value = headerKey;
                                $(this)[0].children[2].value = headerVal;
                            }
                        });
                        headerLength++;
                    }
            }
        }
    }

    //initialization
    function init() {
        //createParmBox();
        createHeaderBox();
        var queryParm = getQueryString();
        if (queryParm) {
            setQueryParm(queryParm);
        }
        setSubmit();
        setCancel();
    }

    window.onload = init;
})();