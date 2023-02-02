var list = {};
var gens = {};

function search(word){
    let searchVal = word;
    let results = [];
    let res = document.getElementById('results');
    res.innerHTML = '';
    res.style.visibility = 'hidden';
    for (var i=0 ; i < Object.keys(list).length ; i++){
        if (Object.keys(list)[i].toLowerCase().includes(searchVal)){
            let div;
            div = document.createElement('div');
            div.classList.add('result-line')
            div.id = list[Object.keys(list)[i]];
            div.onclick = function(){
                zoomNode(Number(this.id));
                document.getElementById('results').innerHTML = '';
                document.getElementById('results').style.visibility = 'hidden';
            };
            res.appendChild(div);
            
            if(gens[list[Object.keys(list)[i]]] != undefined){
                let div2;
                div2 = document.createElement('div');
                div2.classList.add('circle');
                div2.innerHTML = gens[list[Object.keys(list)[i]]];
                div.appendChild(div2);
            }

            let txt;
            txt = document.createElement('p');
            txt.innerHTML = Object.keys(list)[i];
            txt.style.paddingLeft = '10px';
            txt.style.paddingRight = '5px';
            div.appendChild(txt);

            results.push({id: list[Object.keys(list)[i]], name: Object.keys(list)[i]});
        }
    }
    if(results.length == 0){
        document.getElementById('results').innerHTML = '';
        document.getElementById('results').style.visibility = 'hidden';
    } else document.getElementById('results').style.visibility = 'visible';
    return results;
}

function zoomNode(id){
    tree.zoomToNode(id, zoom = 2, duration = 1000)
}

function cancelSearch(){
    document.getElementById('results').innerHTML = '';
    document.getElementById('results').style.visibility = 'hidden';
    document.getElementById('search').value = '';
}

document.getElementById('search').addEventListener('input', function(e){
    if(e.target.value != '') search(e.target.value);
    else {
        document.getElementById('results').innerHTML = '';
        document.getElementById('results').style.visibility = 'hidden';
    }
});

document.getElementById('search').addEventListener('click', function(e){
    if(e.target.value != '') search(e.target.value);
    else {
        document.getElementById('results').innerHTML = '';
        document.getElementById('results').style.visibility = 'hidden';
    }
});