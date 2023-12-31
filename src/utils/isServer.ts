export const isServer = ()=>
    // Tells if we are in the server or not
    typeof window === 'undefined' // if window is undefined then we are in the server
