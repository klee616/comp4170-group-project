import Pokemon from '../modules/Pokemon.js'


   const homeView = async (req, res)=>{
        const pokemons = await  Pokemon.getPokemonList();
        const pokemonTypes = await Pokemon.getPokemonTypes();
        res.render('index', {pokemons:pokemons, pokemonTypes:pokemonTypes} );
    }

    const filterPokemon = async (req, res) => {

        const pokemons = await  Pokemon.filterPokemon(req);
        const pokemonTypes = await Pokemon.getPokemonTypes();
        res.render('index', {pokemons:pokemons, pokemonTypes:pokemonTypes} );
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
    const modifyPokemon = async(req, res) => {
        const pokemon = await Pokemon.getPokemonById(req);
        res.render('modify', {pokemon:pokemon})
    }

    //get information for View page
    const pokemon = async(req, res) => {
        const pokemon = await Pokemon.getPokemonById(req);
        res.render('pokemon', {pokemon:pokemon})
    }

    export default {
        homeView,
        filterPokemon,
        modifyPokemon,
        pokemon,
        updatePokemon
    }