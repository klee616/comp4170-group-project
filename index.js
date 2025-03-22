import express from "express"
import pokemonController from "./controllers/pokemonController.js";
import { fileURLToPath } from 'url';
import path from 'path';

const app = express()
const port = process.env.PORT || 3000


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pokemon = pokemonController;

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))


//Index, list all pokemon
app.get('/', pokemon.homeView)
app.get('/testingNew',pokemon.newPage)
//Filter pokemon
app.get('/filter', pokemon.filterPokemon)
//Modify Pokemon, do not support alter pokemon type 
app.get('/modify', pokemon.modifyPokemon)
//View Pokemon
app.get('/pokemon', pokemon.pokemon)
//create or modify pokemon, and it will redirect to /pokemon page
app.post('/updatePokemon', pokemon.updatePokemon)
// Min Game, only support generation filter.
app.get('/game', pokemon.pokemonGame)
//Deleted pokemon
app.delete('/api/pokemon/:id', pokemon.deletePokemon)
//Create new pokemon
app.get('/createPokemon', pokemon.createPokemon)

app.all('*', (req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})