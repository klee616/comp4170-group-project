import Pokemon from '../modules/Pokemon.js'
import Utils from '../utility/Utils.js';

const homeView = async (req, res) => {
    const pokemons = await Pokemon.getPokemonList();
    const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('index', { pokemons: pokemons, pokemonTypes: pokemonTypes, query: req });
}

const newPage = async (req, res) => {
    console.log('here')
    // const pokemons = await Pokemon.getPokemonList();
    // const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('newPage');
}
const filterPokemon = async (req, res) => {

    const pokemons = await Pokemon.filterPokemon(req);
    const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('index', { pokemons: pokemons, pokemonTypes: pokemonTypes, query: req.query });
}

//update pokemon
const updatePokemon = async (req, res) => {

    req.body = {
        ...req.body,
        type: JSON.stringify(Utils.cleanJson(req.body.type))
    }

    let result;
    let id;
    if (req.body.id == undefined) {

        req.body = {
            ...req.body,
            id: await Pokemon.getNextSeqNumber()
        }
        result = await Pokemon.insertPokemon(req);
    } else {
        result = await Pokemon.updatePokemon(req);
    }
    id = req.body.id;
    res.redirect(`/pokemon?id=${id}`);
}

//create pokemon
const insertPokemon = async (req, res) => {
    req.body = {
        ...req.body,
        type: JSON.stringify(Utils.cleanJson(req.body.type))
    }
    console.log(req)
    const result = await Pokemon.insertPokemon(req);
    res.redirect(`/pokemon?id=${result[0].id}`);
}

//get information for modify page
const modifyPokemon = async (req, res) => {
    const pokemon = await Pokemon.getPokemonById(req);
    const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('modify', { pokemon: pokemon, pokemonTypes: pokemonTypes })
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
    const id = req.params.id
    const pokemon = await Pokemon.deletePokemon(id);
    console.log(deletePokemon)
    if (pokemon) {
        res.end(JSON.stringify({ status: "Success", message: `Successful deleted the pokemon no. ${id}` }))
    } else {
        res.end(JSON.stringify({ status: "Fail", message: `Fail. The pokemon no. ${id} not found` }));
    }
    // Go back to index?
}

// Create
const createPokemon = async (req, res) => {
    const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('create', { pokemonTypes: pokemonTypes })
}

export default {
    homeView,
    newPage,
    filterPokemon,
    modifyPokemon,
    pokemon,
    insertPokemon,
    updatePokemon,
    pokemonGame,
    deletePokemon,
    createPokemon
}