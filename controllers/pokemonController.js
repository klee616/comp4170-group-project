import Pokemon from '../model/Pokemon.js'
import Utils from '../utility/Utils.js';


// Generic error handler
const handleError = (res, error, message = "Internal Server Error") => {
    console.error(message, error);
    res.status(500).send(message);
};

const homeView = async (req, res) => {
    try {
        const pokemons = await Pokemon.getPokemonList();
        const pokemonTypes = await Pokemon.getPokemonTypes();
        res.render('index', { pokemons: pokemons, pokemonTypes: pokemonTypes, query: req });
    } catch (error) {
        handleError(res, error, "Failed to load home view");
    }
}

const newPage = async (req, res) => {
    console.log('here')
    // const pokemons = await Pokemon.getPokemonList();
    // const pokemonTypes = await Pokemon.getPokemonTypes();
    res.render('newPage');
}
const filterPokemon = async (req, res) => {
    try {
        const pokemons = await Pokemon.filterPokemon(req);
        const pokemonTypes = await Pokemon.getPokemonTypes();
        res.render('index', { pokemons: pokemons, pokemonTypes: pokemonTypes, query: req.query });
    } catch (error) {
        handleError(res, error, "Failed to get Pokémon data");
    }
}

//update pokemon
const updatePokemon = async (req, res) => {
    try {
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
    } catch (error) {
        handleError(res, error, "Failed to update Pokémon");
    }
}

//create pokemon
const insertPokemon = async (req, res) => {
    try {
        req.body = {
            ...req.body,
            type: JSON.stringify(Utils.cleanJson(req.body.type))
        }
        console.log(req)
        const result = await Pokemon.insertPokemon(req);
        res.redirect(`/pokemon?id=${result[0].id}`);
    } catch (error) {
        handleError(res, error, "Failed to insert Pokémon");
    }
}

//get information for modify page
const modifyPokemon = async (req, res) => {
    try {
        const pokemon = await Pokemon.getPokemonById(req);
        const pokemonTypes = await Pokemon.getPokemonTypes();
        res.render('modify', { pokemon: pokemon, pokemonTypes: pokemonTypes })
    } catch (error) {
        handleError(res, error, "Failed to get Pokémon data for modify.");
    }
}

//get information for View page
const pokemon = async (req, res) => {
    try {
        const pokemon = await Pokemon.getPokemonById(req);
        res.render('pokemon', { pokemon: pokemon })
    } catch (error) {
        handleError(res, error, "Failed to get Pokémon data.");
    }
}

// Game
const pokemonGame = async (req, res) => {
    try {
        const pokemons = await Pokemon.getRandomPokemonList(req, res);
        const answerpokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
        res.render('game', { pokemons: pokemons, answerpokemon: answerpokemon })
    } catch (error) {
        handleError(res, error, "Failed to load Pokémon game.");
    }
}

// Delete
const deletePokemon = async (req, res) => {
    try {
        const id = req.params.id
        const pokemon = await Pokemon.deletePokemon(id);
        console.log(pokemon)
        if (pokemon) {
            res.json({ status: "Success", message: `Successful deleted the pokemon no. ${id}` })
        } else {
            res.json({ status: "Fail", message: `Fail. The pokemon no. ${id} not found` });
        }
    } catch (error) {
        handleError(res, error, "Failed to delete Pokémon.");
    }
}

// Create
const createPokemon = async (req, res) => {
    try {
        const pokemonTypes = await Pokemon.getPokemonTypes();
        res.render('create', { pokemonTypes: pokemonTypes })
    } catch (error) {
        handleError(res, error, "Failed to load home view.");
    }
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