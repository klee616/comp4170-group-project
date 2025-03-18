import Pokemon from '../modules/Pokemon.js'


const homeView = async (req, res) => {
    const pokemons = await Pokemon.getPokemonList();
    const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('index', { pokemons: pokemons, pokemonTypes: pokemonTypes, query: req });
}

const filterPokemon = async (req, res) => {

    const pokemons = await Pokemon.filterPokemon(req);
    const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('index', { pokemons: pokemons, pokemonTypes: pokemonTypes, query: req.query });
}

//update pokemon
const updatePokemon = async (req, res) => {
    await Pokemon.updatePokemon(req);
    res.redirect(`/pokemon?id=${req.body.id}`);
}

//create pokemon
const insertPokemon = async (req, res) => {
    await Pokemon.insertPokemon(req);
    res.redirect("/");
}

//get information for modify page
const modifyPokemon = async (req, res) => {
    const pokemon = await Pokemon.getPokemonById(req);
    res.render('modify', { pokemon: pokemon })
}

//get information for View page
const pokemon = async (req, res) => {
    const pokemon = await Pokemon.getPokemonById(req);
    res.render('pokemon', { pokemon: pokemon })
}

// Game
const pokemonGame = async (req, res) => {
    const pokemons = await Pokemon.getRandomPokemonList(req, res);
    const answerpokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    res.render('game', { pokemons: pokemons, answerpokemon: answerpokemon })
}

// Delete
const deletePokemon = async (req, res) => {
    const pokemon = await Pokemon.deletePokemon(req, res);
    console.log(deletePokemon)
    if (pokemon) {
        res.end(JSON.stringify({ status: "success", message: `Successful deleted the pokemon no. ${req.query.id}` }))
    } else {
        res.end(JSON.stringify({ status: "Fail", message: `Fail. The pokemon no. ${req.query.id} not found` }));
    }
    // Go back to index?
}

export default {
    homeView,
    filterPokemon,
    modifyPokemon,
    pokemon,
    updatePokemon,
    pokemonGame,
    deletePokemon
}