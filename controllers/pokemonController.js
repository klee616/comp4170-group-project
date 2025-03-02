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

    export default {
        homeView,
        filterPokemon
    }