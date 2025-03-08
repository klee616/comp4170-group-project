import express from "express"
import pokemonController from "./controllers/pokemonController.js";

const app = express()
const port = process.env.PORT

const pokemon = pokemonController;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

//Index, list all pokemon
app.get('/', pokemon.homeView)
//Filter pokemon
app.get('/filter', pokemon.filterPokemon)
//Modify Pokemon, do not support alter pokemon type (has bugs, will fix later)
app.get('/modify', pokemon.modifyPokemon)
//View Pokemon
app.get('/pokemon', pokemon.pokemon)
//Updata pokemon, and it will redirect to /pokemon page
app.post('/updatePokemon', pokemon.updatePokemon)
// Min Game, only support generation filter.
app.get('/game', pokemon.pokemonGame)


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})