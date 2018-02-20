const {Database} = require('rethinkdb-wrapper');
const r = require('rethinkdb');

/** 
 * @class Resolvers extends Database [rethinkdb-wrapper]
*/
class Resolver extends Database{

    /** 
     * @constructor
     * @param dbconf
    */
    constructor(dbconf){
        super(dbconf);
    }

    async resolvers(){
        return {
            Query: {
                user: async (_, {id})=>{
                    let reql = r.table('users').filter({id: Number.parseInt(id)});
                    try {
                        this.logger.info(`get user with id ${id}`);
                        let result = await this.select(reql);
                        this.logger.debug(result);
                        return result;
                    } catch (error) {
                        this.logger.error(`Error: ${error.message}`);
                        this.logger.debug(error);
                        return null;
                    }
                }
            }
        }
    }

}

module.exports.Resolver = Resolver;
