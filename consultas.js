import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  host:'localhost',
  database: 'paises',
  user: 'postgres',
  password: '123456',
  port: 5432,
  max: 5,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 1000
})

export const getPaises = () => {
  return new Promise(async (res,rej) => {
    try {
      let paises = await pool.query("SELECT * FROM paises_pib");      
      return res(paises.rows);
    } catch (err) {
      console.log('Error: ',err);
      return rej("Error al buscar los paises ");
    }
  })
}

export const getPaisesPib = (type,pib=null) => {
  return new Promise(async (res,rej) => {
    try {
      let query = '';
      switch (type) {
        case 'creciendo':
          query = "SELECT nombre,pib_2019,pib_2020,pib_2020-pib_2019 AS diference from paises_pib WHERE pib_2020-pib_2019>0 ORDER by diference DESC;";
          break;
        case 'decreciendo':
          query = "SELECT nombre,pib_2019,pib_2020,pib_2019-pib_2020 AS diference FROM paises_pib WHERE pib_2020<pib_2019 ORDER by diference ASC;"
          break;        
        case 'pib':
          query = "SELECT nombre,pib_2019,pib_2020 FROM paises_pib WHERE pib_2020>=" + pib;          
          break;
        default:
          return rej('Elija un metodo correcto (creciendo ó decreciendo)');
          break;
      }
      let paises = await pool.query(query);      
      return res(paises.rows);
    } catch (err) {
      console.log('Error: ',err);
      return rej("Error al buscar los paises ");
    }
  })
}

export const addPais = (nombre, pib_2019, pib_2020) => {
  console.log('Nombre: ',nombre);
  console.log('pib_2019: ',pib_2019);
  console.log('pib_2020: ',pib_2020);
  return new Promise( async (res, rej) => {
    try {
      await pool.query("INSERT INTO paises_pib (nombre, pib_2019, pib_2020) VALUES ($1,$2,$3)", [nombre, pib_2019, pib_2020])
      res("Pais agregado correctamente");
    } catch (error) {
      console.log(error);
      rej("no se logro agregar el pais");
    }
  })
}

export const deletePais = (nombre) => {
  return new Promise( async (res, rej) => {
    try {
      let pais = await pool.query("SELECT * FROM paises_pib WHERE nombre = $1", [nombre]);
      if (pais.rows.length == 0) throw new Error("No existe registrado el pais");
      await pool.query("DELETE FROM paises_pib WHERE nombre = $1", [nombre]);
      res("Pais eliminado con exito");
    } catch (error) {
      console.log(error);
      rej("Error al eliminar el pais");
    }
  })
}