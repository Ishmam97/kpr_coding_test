class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];
    this.weights = [];
    this.numberOfEdges = 0;
  }

  addVertex(vertex) {
    if (!this.vertices.includes(vertex)) {
      this.vertices.push(vertex);
      this.edges[vertex] = [];
    }
  }

  removeVertex(vertex) {
    const index = this.vertices.indexOf(vertex);

    if (index >= 0) {
      this.vertices.splice(index, 1);
    }

    // If this vertex has an edge
    while (this.edges[vertex].length) {
      // Get last vertex in edge array (will loop until they are empty)
      const adjacentVertex = this.edges[vertex].pop();

      this.removeEdge(adjacentVertex, vertex);
    }
  }

  addEdge(vertex1, vertex2) {
    this.edges[vertex1].push(vertex2);
    this.edges[vertex2].push(vertex1);
    this.numberOfEdges++;
  }

  removeEdge(vertex1, vertex2) {
    const index1 = this.edges[vertex1]
      ? this.edges[vertex1].indexOf(vertex2)
      : -1;
    const index2 = this.edges[vertex2]
      ? this.edges[vertex2].indexOf(vertex1)
      : -1;

    if (index1 >= 0) {
      // Remove vertex2 from the vertex1 array
      this.edges[vertex1].splice(index1, 1);
      this.numberOfEdges--;
    }

    if (index2 >= 0) {
      // Remove vertex1 from the vertex2 array
      this.edges[vertex2].splice(index2, 1);
    }
  }

  size() {
    return this.vertices.length;
  }

  relations() {
    return this.numberOfEdges;
  }

  print() {
    console.log(
      this.vertices
        .map((vertex) => {
          return `${vertex} => ${this.edges[vertex].join(", ")}`.trim();
        }, this)
        .join(" | ")
    );
  }
  cleanGraph() {
    var a = [],
    b = []
    for(let node in this.edges){
        let out = this.cleanAndCalcWeight(this.edges[node])
        this.edges[node]= out[0]
        this.weights[node] = out[1]
    }
  }
  cleanAndCalcWeight(arr) {
    var a = [],
      b = [],
      prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }

    return [a, b];
  }
  getEdges(){

    return this.edges;
  }
  getWeights(){

    return this.weights;
  }
}

module.exports = Graph;
