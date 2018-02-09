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

    /**
     * get user by identifier
     * @param {number} id user identifier
     */
    async fetchUser(id){
        try {
            let reql = await r.table('users').filter({id: Number.parseInt(id)});
            let user = await this.select(reql);
            return (user.length)? user[0] : null; 
        } catch (error) {
            this.logger.error(`Error fetch user: ${error.message}`);
            this.logger.debug(error);
        }
    }

}

module.exports.Resolver = Resolver;
