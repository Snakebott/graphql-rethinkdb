const fs = require('fs');

let load = (filename = 'schema.graphql')=>{
    return fs.readFileSync(filename).toString();
}

module.exports = load();
