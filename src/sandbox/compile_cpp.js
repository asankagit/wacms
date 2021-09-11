//@Todo read AST and identify compiler flags

const make = (files=[]) => { 
    const fileStr = files.reduce((acc, i ) => acc + i, "" )
    const instruction = "emcc -Iinclude __file__name -s SIDE_MODULE=1 -s WASM=1"
    const regex = /__file_name/i;
    return instruction.replace(regex, fileStr)
}

export default {
    make
}