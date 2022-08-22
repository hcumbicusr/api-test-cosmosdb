var express = require('express');
const pool = require('../dbase/connection');
const fetch = require("node-fetch");
const { urlpersona } = require('../config');
const { urldrive } = require('../config');
//Para postgres
//const poolPG = require('../dbase/Postgresconnection');
//Para Mongo
//const poolMG = require('../dbase/Mongoonnection');
//var mongo_persona = poolMG.get('persona_documento');

var router = express.Router();

router.get('/:fechainicio/:fechafin/', async function (req, res, next) {
  var fechainicio = req.params.fechainicio;
  var fechafin = req.params.fechafin;

  // Buscar las cotizaciones en ADN - MYSQL
  var [resultsADN] = await pool.query("SELECT " +
    "numero_cotizacion," +
    "case p.tipo_documento when 1 then 'DNI' when 2 then 'CARNET DE EXTRANJERIA' END AS tipo_documento, " +
    "p.numero_documento, " +
    "CONCAT('EN.',numero_cotizacion,'.',p.numero_documento,'.PDF') AS nombrearchivo, " +
    "'' AS idpersona " +
    "FROM siv_db.solicitud  s " +
    "LEFT JOIN persona p ON s.id_asegurado=p.id_persona " +
    "WHERE " +
    "s.fecha_crea>= '" + fechainicio + " 00:00:00' AND s.fecha_crea<= '" + fechafin + " 23:59:59' " + //busqueda por fecha de cotizacion
    "AND fecha_solicitud is not NULL;"); // cotizacion con solicitud finalizada

  var cotizaciones = [];
  var personas = [];

  console.log('Se encontraron ' + resultsADN.length + ' registros')
  var i=0;
  for (const elementADN of resultsADN) {
    i=i+1;
    console.log('Registro ' + i + ' de '+ resultsADN.length)
    var data = { tipo_documento: elementADN.tipo_documento, numero_documento: elementADN.numero_documento };//43307114
    const optionsp = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    };
    // Buscar ID Persona en MongoDB
    let datap = await fetch(urlpersona, optionsp);
    //console.log('urlpersona')    
    //console.log(urlpersona)
    //console.log('optionsp')
    //console.log(optionsp)
    //console.log('datap')
    //console.log(datap)
    const personasmongo = await datap.json();
    //console.log('personasmongo')
    //console.log(personasmongo)
    
    for (const element of personasmongo.data) {

      personas.push({
        tipo_documento: elementADN.tipo_documento, num_documento: elementADN.numero_documento,
        nombrearchivo: elementADN.nombrearchivo, idpersona: element.ID_PERSONA.toLowerCase()
      });
      //console.log('personas')
      //console.log(personas)
      const options = {
        method: 'GET',
        headers: {
          'app': 'CRM'
        }
      };
      // Buscar Archivos Drive para ID Persona
      let datad = await fetch(urldrive + element.ID_PERSONA.toLowerCase(), options)
      //console.log('datad')
      //console.log(datad)
      var contactid;
      const drivedata = await datad.json();
      if (drivedata.length > 0) {
        contactid = element.ID_PERSONA.toLowerCase();
      } else { contactid = "" }

    }
    //Lógica referencia ADN uploadArchivo
    var contactVal = "";
    if (contactid != "") { // si tiene archivos drive se toma el idpersona
      contactVal = contactid;
    } else {
      if (personas.length > 1) { // si not tiene archivos drive
        contactVal = personas[1].idpersona;  // si es más de 1 idpersona se toma el segundo
      } else {
        contactVal = personas[0].idpersona; // si solo hay 1 idpersona se toma el primero
      }
    }
    cotizaciones.push({
      num_solicitud: elementADN.numero_cotizacion,
      tipo_documento: elementADN.tipo_documento, num_documento: elementADN.numero_documento,
      ruta_cloud_storage: contactVal + '/' + elementADN.nombrearchivo
    });

  }
  /*
  // ejemplo consumir funcion getPersona
  async function buscapersona() {
    console.log('resultsADN');
    console.log(resultsADN);
    for (const element of resultsADN) {
      const personas = await getPersona(element.tipo_documento, element.numero_documento);
      cotizaciones.push({
        tipo_documento: element.tipo_documento, num_documento: element.numero_documento,
        nombrearchivo: element.nombrearchivo, idpersona: personas.ID_PERSONA.toLowerCase()
      });
    }
   return cotizaciones;
  }
  res.json(await buscapersona());
  */

  res.json(cotizaciones);
});

/*
// ejemplo de funcion
async function getPersona(tipodoc, numdoc) {
  //console.log('ingreso getpersona' + tipodoc + numdoc);
  var query = {
    TIPO_DOCUMENTO: tipodoc,
    NUMERO_DOCUMENTO: numdoc
  };
  var [results] = await mongo_persona.find(query);
  return results;
}



//POSTGRES
router.get('/:id', async function (req, res, next) {
  try {
    var id = req.params.id;
    console.log('ingreso PG');
    //const data =  await poolPG.query('select * from cvw_cot c where c.id = $1', [id]);
    const data = await poolPG.query('select * from cvw_cot c limit 1');
    console.log('data');
    console.log(data);
    let cotizacion = null;
    if (data.length > 0) {
      cotizacion = data[0];
    }
    //return cotizacion;
    res.json(cotizacion)
  } catch (error) {
    console.error(error);
  }
});



//MONGO
router.get('/mongodb/:num_documento', async function (req, res, next) {
  console.log('Ingreso MONGO');
  var num_documento = req.params.num_documento;
  var query = {
    TIPO_DOCUMENTO: 'DNI',
    NUMERO_DOCUMENTO: num_documento
  };
  console.log(query);
  mongo_persona.find(query)
    .then(results => {
      console.log(results);
      res.json(results);
    })
    .catch(error => console.error(error));
});
*/


module.exports = router;
