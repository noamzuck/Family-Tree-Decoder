var nodes = [];
var id = 1;
function start(){
    $.get(/*'http://127.0.0.1:5500/o.txt'*/document.getElementById('url').value, function(data){
    let json = {};
    let t = [];
    let temp = data.replaceAll('aka: ', '').replaceAll('+	', 'null	').replaceAll('+', '').replaceAll('.		', 'w	').replaceAll('.	', '').replaceAll('.', '').split(/\r?\n/);
    for(let key in temp){
        if(temp[key][0] != 'w'){
            temp[key] = temp[key].replaceAll('  		', '	null	')/*.replaceAll('		', '	')*/.replaceAll('  	', '	').replaceAll(/\t/g, '	');
            temp[key] = temp[key].split('	');
            let gener = temp[key][0];
            let hName = temp[key][1];
            let name = temp[key][2];
            let aka = temp[key][3];
            let dates = temp[key][4];
            let wife = null;
            if(temp[Number(key) + 1] != undefined){
                if(temp[Number(key) + 1][0] == 'w'){
                    temp[Number(key) + 1] = temp[Number(key) + 1].replaceAll('  		', '	null	')/*.replaceAll('		', '	')*/.replaceAll('  	', '	').replaceAll(/\t/g, '	');
                    temp[Number(key) + 1] = temp[Number(key) + 1].split('	');
                    wife = {};
                    wife[temp[Number(key) + 1][2]] = {};
                    wife[temp[Number(key) + 1][2]]['HebrewName'] = temp[Number(key) + 1][1];
                    wife[temp[Number(key) + 1][2]]['AKA'] = temp[Number(key) + 1][3];
                    wife[temp[Number(key) + 1][2]]['Dates'] = temp[Number(key) + 1][4];
                }
            }
            t.push({Gener: Number(gener), Name: name, HebrewName: hName, AKA: aka, Dates: dates, Wife: wife, Kids: {}});
        }
    }
    for(let key = 0; key < t.length; key++){
        if(t[Number(key) + 1] != undefined){
            if(Number(t[key].Gener) + 1 == t[Number(key) + 1].Gener){
                for(let k = 1; k < t.length; k++){
                    if(t[Number(key) + k] != undefined){
                        if(Number(t[key].Gener) + 1 == t[Number(key) + k].Gener)
                            t[key].Kids[t[Number(key) + k].Name] = t[Number(key) + k];
                        else if(Number(t[key].Gener) == t[Number(key) + k].Gener || Number(t[key].Gener) > t[Number(key) + k].Gener) break;
                    }
                }
            }
        }
    }
    json = t[0];

    //var nodes = [];
    //let id = 1;
    nodes.push({id: 1, pids: ['w1'], name: json.Name, gender: 'original'});
    rek(json, 1);
    console.log(nodes)
    
    //nodes = nodes.splice(0, 200);
});
}

function rek(path, fath){
    if(!Object.keys(path).includes('Wife')){
        Object.keys(path).forEach(res => {
            if(path[res].Wife != null) nodes.push({id: id+1, pids: ['w' + (id + 1)], mid: 'w' + (fath-1), fid: fath-1, name: res, gender: 'original', HebrewName: path[res].HebrewName, AKA: path[res].AKA, Dates: path[res].Dates});
            else nodes.push({id: id+1, mid: 'w' + (fath-1), fid: fath-1, name: res, gender: 'original', HebrewName: path[res].HebrewName, AKA: path[res].AKA, Dates: path[res].Dates});
            id++;
            rek(path[res], id);
        });
    }
    Object.keys(path).forEach(f => {
        if(f == 'Wife' && path.Wife != null) nodes.push({id: 'w' + id, pids: [id], name: Object.keys(path.Wife)[0], gender: 'add', HebrewName: path.Wife[Object.keys(path.Wife)[0]].HebrewName, AKA: path.Wife[Object.keys(path.Wife)[0]].AKA, Dates: path.Wife[Object.keys(path.Wife)[0]].Dates});
        else if(f == 'Kids') rek(path.Kids, fath+1)
    });
}

function famTree(){
    let family = new FamilyTree(document.getElementById("tree"), {
        nodeBinding: {
            field_0: "name",
            field_1: "HebrewName",
            field_2: "AKA",
            field_3: "Dates"
        },
        nodes: nodes
    });
}