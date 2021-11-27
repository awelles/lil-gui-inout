/**
 * @version 0.1.0
 * @author Aaron Welles
 * @license MIT
 */

import { GUI } from '../lil-gui/lil-gui.esm.js';

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
 * Returns a object with add/addColor methods that can be called the same as GUI's
 * @param {function} inFilter 
 * @param {function} outFilter 
 * @param {GUI} gui 
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

// GUI.prototype.addColorHEXRRGGBBAA = addColorHEXRRGGBBAA_alpha;
// gui.addColorHEXRRGGBBAA(config, "color");
function addColorHEXRRGGBBAA( obj, param, ...rest ) {
    return this.useFilter( 
        x=>obj[param].slice(0,-2),
        x=> x + obj[param].slice( -2 ) 
    ).addColor( obj, param, ...rest );
}

// GUI.prototype.addColorHEXRRGGBBAA_alpha = addColorHEXRRGGBB_alpha;
// gui.addColorHEXRRGGBBAA_alpha(config, "color");
function addColorHEXRRGGBBAA_alpha( obj, param, ...rest ) {
    return this.useFilter( 
        x=>parseInt(obj[param].slice( -2 ),16),
        x=>obj[param].slice(0,-2) + x.toString(16).padStart(2,"0")                
    ).add( obj, param, ...rest );
}

export default Filter;
export { Filter, useFilter, addColorHEXRRGGBBAA, addColorHEXRRGGBBAA_alpha };
