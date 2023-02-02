var list = {};
var gens = {};
var tree;
var treeData;

if(localStorage.getItem("dataUrlFileFamTree")){
    document.getElementById("browse").style.display = 'none';
    treeData = JSON.parse(localStorage.getItem("dataUrlFileFamTree"));
    process();
}

document.getElementById("picker").addEventListener('change', async function(e) {
    document.getElementById("browse").style.display = 'none';
    let selected = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener("loadend", () => {
        treeData = JSON.parse(reader.result);
        localStorage.setItem("dataUrlFileFamTree", reader.result);
        process();
    });
    reader.readAsText(selected);
});

function process(){
    tree = dTree.init(treeData,
        {
            target: "#graph",
            debug: true,
            hideMarriageNodes: true,
            marriageNodeSize: 5,
            height: 800,
            width: 1200,
            callbacks: {
                nodeClick: function(name, extra) {
                    alert('Click: ' + name);
                },
                nodeRightClick: function(name, extra) {
                    alert('Right-click: ' + name);
                },
                textRenderer: function(name, extra, textClass) {
                    if (extra && extra.nickname)
                        name = name + " (" + extra.nickname + ")";
                    if(extra && extra.Hebrewname){
                        if(extra.Hebrewname == 'null') hName = '';
                        else hName = "<br><p align='center' class='descibe'>" + extra.Hebrewname + "</p>";
                    } else hName = '';
                    if(extra && extra.Dates){
                        if(extra.Dates == 'null') Dates = '';
                        else Dates = "<br><p align='center' class='dates'>" + extra.Dates + "</p>";
                    } else Dates = '';
                    if(extra && extra.Gener) Gen = "<div style='display: flex; justify-content: center'><div class='circle'>" + extra.Gener + "</div></div>";
                    else Gen = '';
                    return Gen + "<br><p align='center' class='" + textClass + "'>" + name + "</p>" + hName + Dates;
                },
                nodeRenderer: function(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
                    list[name] = id;
                    gens[id] = extra.Gener;
                    let node = '';
                      node += '<div ';
                      node += 'style="height:100%;width:100%;" ';
                      node += 'class="' + nodeClass + '" ';
                      node += 'id="node' + id + '">\n';
                      node += textRenderer(name, extra, textClass);
                      node += '</div>';
                      return node;
                },
                marriageClick: function(extra, id) {
                    alert('Clicked marriage node' + id);
                },
                marriageRightClick: function(extra, id) {
                    alert('Right-clicked marriage node' + id);
                },
            }
        });
}

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