import express from "express"
import pokemonController from "./controllers/pokemonController.js";

const app = express()
const port = process.env.PORT

const pokemon = pokemonController;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))


app.get('/', pokemon.homeView)
app.get('/filter', pokemon.filterPokemon)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})