//CSV PATH

const csvPath='volunteer_attendance_data.csv'
//

const fs = require('fs')
const csv = require('csvtojson')
//import graph custom datastructure
const Graph = require('./Graph')

async function main(path){
    const jsonArray=await csv().fromFile(path);
    
    let graph = new Graph;

    let groupedByShift = {}
    
    //Group ids by common date followed by common shift
    jsonArray.forEach((item , index ,row)=>{

        if (groupedByShift.hasOwnProperty(item['date'])){
            if (groupedByShift[item['date']].hasOwnProperty(item['shift'])){
                groupedByShift[item['date']][item['shift']].push(item['volunteerName'])
            }
            else{
                groupedByShift[item['date']][item['shift']] = []
                groupedByShift[item['date']][item['shift']].push(item['volunteerName'])
            }
        }else{
            groupedByShift[item['date']] = {}
            groupedByShift[item['date']][item['shift']] = []
            groupedByShift[item['date']][item['shift']].push(item['volunteerName'])            
        }
    });

    for(let date in groupedByShift){
       
        for (let shift in groupedByShift[date]){
            
            group = []
            for (let vid in groupedByShift[date][shift]){
                group.push(groupedByShift[date][shift][vid])
                graph.addVertex(groupedByShift[date][shift][vid])
            }
            for(let i = 0 ; i < group.length-1;++i){                
                for(let j = i+1 ; j<group.length;++j){
                    graph.addEdge(group[i] , group[j])
                }
            }

        }

    }
    //run clean graph to reduce duplicate edges to weights
    graph.cleanGraph()
    let Gedges = graph.getEdges()
    let Gweights = graph.getWeights()

    output = await getOutput(Gedges , Gweights)



    console.log("?????FINAL OUTPUT????")  
    console.log(output)
    
    
}
async function getOutput(Gedges , Gweights){
    //construct json object for output
    fs.writeFile('Output.csv', 'Node 1,Node 2,Weight\n', function (err) {
        if (err) return console.log(err);
        console.log('output saved to Output.csv');
      });
    let output= {
        "Node 1":[],
        "Node 2":[],
        "Weight ":[],
    }
    
    for(let v1 in Gedges){
        let line = ""
        if(v1 != null){            
            for(let v2 in Gedges[v1]){
                output["Node 1"].push(v1)
                output["Node 2"].push(Gedges[v1][v2])
                output["Weight "].push(Gweights[v1][v2])
                line = `${v1},${Gedges[v1][v2]},${Gweights[v1][v2]}\n`
                fs.appendFile('Output.csv', line, function (err) {
                    if (err) throw err;                    
                }); 
            }
            
        }
        
    }
    return output

}


main(csvPath)
