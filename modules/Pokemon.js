import pg from "pg"
import Pool from "pg-pool"
const { Client } = pg;
const pool = new Pool({ ssl: true });

//fetch all Pokemon;
const getPokemonList = async (req, res) => {

    const client = await pool.connect();
    let result;
    try {
        result = await client.query('select * from pokemon order by id  ')

    } catch (error) {
        console.error('Error get Pokémon List:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows;
}


const getPokemonTypes = async () => {
    const client = await pool.connect();
    let result;

    try {
        result = await client.query("SELECT DISTINCT jsonb_array_elements_text(type) AS type FROM pokemon order by 1")

    } catch (error) {
        console.error('Error get All Pokémon Type:', error);
        throw error;
    } finally {
        client.release()
    }

    return result.rows;
}

//filter pokemon by weight, height, atteck, defense, s_atteck, s_Defense, speed, and type, 
const filterPokemon = async (req) => {
    const client = await pool.connect();
    let result;
    try {
        const params = [
            parseFloat(req.query.minWeight) || 0, parseFloat(req.query.maxWeight) || Infinity,
            parseFloat(req.query.minHeight) || 0, parseFloat(req.query.maxHeight) || Infinity,
            parseFloat(req.query.minHp) || 0, parseFloat(req.query.maxHp) || Infinity,
            parseFloat(req.query.minAttack) || 0, parseFloat(req.query.maxAttack) || Infinity,
            parseFloat(req.query.minDefense) || 0, parseFloat(req.query.maxDefense) || Infinity,
            parseFloat(req.query.minSAttack) || 0, parseFloat(req.query.maxSAttack) || Infinity,
            parseFloat(req.query.minSpeed) || 0, parseFloat(req.query.maxSpeed) || Infinity,
          ];
          
          // Handle the 'type' parameter
          let typeFilter = req.query.type;
          if (!typeFilter || (Array.isArray(typeFilter) && typeFilter.length === 0)) {
            typeFilter = []; // Empty array to bypass type filter
          } else if (!Array.isArray(typeFilter)) {
            typeFilter = [typeFilter]; // Convert single string to array
          }
          params.push(typeFilter);

        result = await client.query("select * from pokemon where " +
           "  weight between $1 and $2 and " + 
           "  height between $3 and $4 and " + 
           "  attack between $5 and $6 and " + 
           "  defense between $7 and $8 and " + 
           "  s_attack between $9 and $10 and " + 
           "  s_defense between $11 and $12 and " + 
           "  speed between $13 and $14 and " + 
           "  ($15 = '{}'::text[] OR type ?| $15::text[]) order by id",// and (type ?| $15::jsonb or $15 == '') and ($16 = '' or generation = $16)" ,
           params
            );

            console.log('test', result.rows[0])
    } catch (error) {
        console.error('Error Filter Pokemon:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows;


}


export default {
    getPokemonList,
    getPokemonTypes,
    filterPokemon,
}