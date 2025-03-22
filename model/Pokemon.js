import pg from "pg"
import Pool from "pg-pool"
const { Client } = pg;
const pool = new Pool({
    ssl: {
        rejectUnauthorized: false, // Consider setting to true for production with a verified certificate
    },
});

//fetch all Pokemon;
const getPokemonList = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('select * from pokemon order by id  ')
        return result.rows;
    } catch (error) {
        console.error('Error get Pokémon List:', error);
        throw error;
    } finally {
        client.release()
    }
}

// Get all pokemon types
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
        console.log(req.query.generation)
        const params = [
            parseFloat(req.query.minWeight) || 0, parseFloat(req.query.maxWeight) || Infinity,
            parseFloat(req.query.minHeight) || 0, parseFloat(req.query.maxHeight) || Infinity,
            parseFloat(req.query.minHp) || 0, parseFloat(req.query.maxHp) || Infinity,
            parseFloat(req.query.minAttack) || 0, parseFloat(req.query.maxAttack) || Infinity,
            parseFloat(req.query.minDefense) || 0, parseFloat(req.query.maxDefense) || Infinity,
            parseFloat(req.query.minSAttack) || 0, parseFloat(req.query.maxSAttack) || Infinity,
            parseFloat(req.query.minSpeed) || 0, parseFloat(req.query.maxSpeed) || Infinity,
            parseFloat(req.query.generation) || 0
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
            "  (generation = $15 or $15=0) and" +
            "  ($16 = '{}'::text[] OR type ?| $16::text[]) order by id",// and (type ?| $15::jsonb or $15 == '') and ($16 = '' or generation = $16)" ,
            params
        );

    } catch (error) {
        console.error('Error Filter Pokemon:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows;


}

// Get 4 random pokemon from database
const getRandomPokemonList = async (req, res) => {
    const client = await pool.connect();
    let result;
    try {
        const params = [
            parseFloat(req.query.generation) || 0
        ]
        result = await client.query('select * from pokemon  where (generation = $1 or $1 = 0) order by random() limit 4', params)

    } catch (error) {
        console.error('Error get Pokémon List:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows;
}
const insertPokemon = async (req, res) => {
    const client = await pool.connect();
    let result;
    try {
        result = await client.query('insert into pokemon (id, name, weight, height, hp, attack, defense, s_attack, s_defense, speed, type, evo_set, info, generation) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
            [
                req.body.id,
                req.body.name,
                req.body.weight,
                req.body.height,
                req.body.hp,
                req.body.attack,
                req.body.defense,
                req.body.s_attack,
                req.body.s_defense,
                req.body.speed,
                req.body.type,
                req.body.evo_set,
                req.body.info,
                req.body.generation
            ]
        )
    } catch (error) {
        console.error('Error get insert Pokémon:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows;
}


const updatePokemon = async (req, res) => {

    const client = await pool.connect();
    let result;
    console.log(req)
    let isScuess = false;

    try {
        result = await client.query("update pokemon set name = $1, weight = $2, height = $3, hp = $4, attack=$5, defense=$6, s_attack=$7, s_defense=$8, speed=$9, type=jsonb_strip_nulls($10::jsonb), evo_set=$11, info=$12, generation=$13,modify_datetime=now() where id = $14",
            [
                req.body.name,
                req.body.weight,
                req.body.height,
                req.body.hp,
                req.body.attack,
                req.body.defense,
                req.body.s_attack,
                req.body.s_defense,
                req.body.speed,
                req.body.type,
                req.body.evo_set,
                req.body.info,
                req.body.generation,
                req.body.id
            ]
        )
        isScuess = result.rowCount== 1
        
    } catch (error) {
        console.error('Error get modify Pokémon:', error);
        throw error;
    } finally {
        client.release()
    }
    return isScuess;
}

//return record from special pokemon
const getPokemonById = async (req, res) => {
    const client = await pool.connect();
    let result;
    try {
        result = await client.query("select * from pokemon where id = $1 ",
            [
                req.query.id
            ]
        )
    } catch (error) {
        console.error('Error get modify Pokémon:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows[0];

}


// delete pokemon
const deletePokemon = async (id) => {
    const client = await pool.connect();
    let result;
    try {
        result = await client.query("delete from pokemon where id = $1", [
            id
        ])
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error get modify Pokémon:', error);
        throw error;
    } finally {
        client.release()
    }
}

const getCurrentSeqNumber = async ( ) => {
    
    const client = await pool.connect();
    let result;
    try {
        result = await client.query("SELECT currval(pg_get_serial_sequence('pokemon', 'id')) as currval",)
        
    } catch (error) {
        console.error('Error get modify Pokémon:', error);
        throw error;
    } finally {
        client.release()
    }
    return result.rows[0].currval;
}

const getNextSeqNumber = async () => {
    const client = await pool.connect();
    let result;
    try {
        result = await client.query("select nextval('pokemon_2_id_seq')")
    } catch (error) {
        console.error('Error get modify Pokémon:', error);
        throw error;
    } finally {
        client.release()
    }
    console.log(result)
    console.log(result.rows[0].nextval)
    return result.rows[0].nextval;
}

export default {
    getPokemonList,
    getPokemonTypes,
    filterPokemon,
    getRandomPokemonList,
    insertPokemon,
    updatePokemon,
    getPokemonById,
    deletePokemon,
    getCurrentSeqNumber,
    getNextSeqNumber
}