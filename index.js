import express from 'express';
import { v4 as uuid } from 'uuid';
import cors from 'cors';
import { create } from 'express-handlebars';
import {getPaises,getPaisesPib,addPais,deletePais} from './consultas.js';

let PORT = process.env.PORT || 3001

const app = express();
const router = express.Router();

//CONNFIGURACIONES Y MIDDLEWARES
const hbs = create({partialsDir: ["views/partials"]})

//RUTAS


//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/", router)

app.listen(PORT, () => console.log("servidor en http://localhost:"+PORT))




// ruta de la vista
app.get("/", (req, res) => {    
    res.render("home")
})

app.get("/paises", (req, res) => {        
	getPaises().then(paises => {		
		res.render("paises", {
			paises
		})
	}).catch(error => {
		res.redirect("home", {
			error
		})
	})
})

app.get("/paises/creciendo", (req, res) => {        
	getPaisesPib('creciendo').then(paises => {
		// console.log(paises);
		res.render("paises_pib", {
			paises
		})
	}).catch(error => {
		res.redirect("home", {
			error
		})
	})
})

app.get("/paises/decreciendo", (req, res) => {        
	getPaisesPib('decreciendo').then(paises => {
		console.log(paises);
		res.render("paises_pib", {
			paises
		})
	}).catch(error => {
		res.redirect("home", {
			error
		})
	})
})

app.get("/add_pais", (req, res) => {        	
	res.render("add_pais")
})

app.get("/paises/pib/:pib", (req, res) => {        
	let { pib } = req.params;
	getPaisesPib('pib',pib).then(paises => {
		res.render("paises", {
			paises
		})
	}).catch(error => {
		res.redirect("home", {
			error
		})
	})
})

//RUTA RECIBE DATOS DE PAISES
app.post("/add/pais", async (req, res) => {
	let { nombre, pib_2019, pib_2020 } = req.body;	
	addPais(nombre, pib_2019, pib_2020).then(response => {
			
		res.json({code:200,message: response})
	}).catch(error => {
		console.log(error);
		res.status(500).json({code:500,error})
	})
});


app.delete("/delete/pais/:nombre", async (req, res) => {
	let nombre = req.params.nombre;
	deletePais(nombre).then(response => {
		res.json({code:200,message: response})
	}).catch(err => {
		console.log('Error Index: ',err);
		res.status(500).json({code:500,err})
	})
})



