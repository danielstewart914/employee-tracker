const { Table } = require('console-table-printer');

const createTable = ( name, array ) => {

    // get object keys for column titles
    const objectKeys = Object.keys( array[0] );

    // map object keys into array of column objects
    const columns = objectKeys.map( columnName => {

        // Split column name into words THEN capitalize first letter of each word THEN join back together for column title 
        const title = columnName.split( '_' ).map( word => word.replace( /^./, word[0].toUpperCase() ) ).join( ' ' );

        // return column object
        return {
            name: columnName,
            alignment: 'left',
            title: title
        };

    } );

    // create new Table object with name and columns
    const tableObj = new Table( 
        { 
            title: name, 
            columns: columns
        } );

    // iterate through provided array and add each element with alternating coloring for each row
    for ( let i in array ) {

        let color;

        if ( i % 2 === 0 ) color = { color: 'blue' };
        else color = { color: 'green' };

        tableObj.addRow( array[i], color );
    }

    // return formatted table
    return tableObj;

}

module.exports = createTable;