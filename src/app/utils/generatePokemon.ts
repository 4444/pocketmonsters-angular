
const generatePokemon = (id:number, level:number):Pokemon => {

    // Retrieve from API here?
    return {
        id: id,
        uid: generateUID(),
        level: level,
        stats: [0, 0, 0, 0, 0],
        ivs: [0,0,0,0,0],
        exp: 0,
        types: [Type.BUG],
        hpCurrent: 0,
        nickname: id.toString()
    };
}