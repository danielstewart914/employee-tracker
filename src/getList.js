const getList = {

     managers: async ( db, includeNone, excludeId = 0 ) => {
        try {
            const [ result ] = await db.execute( 'SELECT e.id AS value, CONCAT( first_name, \' \', last_name, \' - \', r.title ) AS name FROM employee e JOIN role r ON e.role_id = r.id WHERE manager_role = true AND e.id != ?', [ excludeId ] );
            // add option for no manager
            if ( includeNone ) result.push( { name: 'None', value: null } );
            return result;
        }
        catch ( error ) {
            console.error( error );
        }
    },

    employees: async ( db ) => {
        try {
            const [ result ] = await db.execute( 'SELECT e.id AS value, CONCAT( first_name, \' \', last_name, \' - \', IFNULL( r.title, \'No Role\' ) ) AS name FROM employee e LEFT JOIN role r ON e.role_id = r.id' );
            return result;
        }
        catch ( error ) {
            console.error( error );
        }
    },  
    
    dept: async ( db ) => {
        try {
            const [ result ] = await db.execute( 'SELECT id AS value, name FROM department' );
            return result;
        }
        catch ( error ) {
            console.error( error );
        }
    },
    
    
    roles: async ( db ) => {
        try {
            const [ result ] = await db.execute( 'SELECT id AS value, title AS name FROM role' );
            return result;
        }
        catch ( error ) {
            console.error( error );
        }
    },

}

module.exports = getList;