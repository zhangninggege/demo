 function ajax(url,callback){
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject();
    }
    xhr.open('get',url,false);
    xhr.onreadytatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var data = JSON.parse(xhr.responseText);
            callback && callback(data)
        }
    }
    xhr.send()
}
