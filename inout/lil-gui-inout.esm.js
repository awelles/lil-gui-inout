/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.1.0
 * @author Aaron Welles
 * @license MIT
 */

import { GUI } from '../lil-gui/lil-gui.esm.js';

// TODO: implement 'three.js+datgui'-like intermediate object for when no inFiunction

/**
 * Base filter class
 */
class Filter {
    constructor ( object, property, inFilter, outFilter ) {
        this._object = object;
        this._property = property;
        this._inFilter = inFilter;
        this._outFilter = outFilter;

        Object.defineProperty( this, property, {
            get: () => this._inFilter( this._object[ this._property ] ),
            set: ( value ) => {
                this._object[ this._property ] = this._outFilter( value );
            }
        } );
    }
}

/**
 * Returns a object with add/addColor methods that can be called the same as gui's
 * @param {*} inFilter 
 * @param {*} outFilter 
 * @param {*} gui 
 * @returns 
 */
function useFilter ( inFilter, outFilter, gui ) {
    
    if ( undefined === gui && typeof this === 'object' ) {
        gui = this;
    }
    
    return {
        add: function( object, property, ...rest ) {
            const filter = new Filter( object, property, inFilter, outFilter );
            return gui.add( filter, property, ...rest );
        },
        addColor: function( object, property, ...rest ) {
            const filter = new Filter( object, property, inFilter, outFilter );
            return gui.addColor( filter, property, ...rest );
        }
    }
}

export default Filter;
export { Filter, useFilter };
