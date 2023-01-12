const express = require('express');
const pool = require('../dbase/connection');
// const fetch = require("node-fetch");
// const { urlpersona } = require('../config');
// const { urldrive } = require('../config');
//Para Mongo
const poolMG = require('../dbase/Mongoconnection');

const router = express.Router();

router.get('/:fechainicio/:fechafin/', async function (req, res, next) {
  const fechainicio = req.params.fechainicio;
  const fechafin = req.params.fechafin;
  const fechaInicioEDN = '2022-12-19';
  // Buscar las cotizaciones en ADN - MYSQL
  let query = `SELECT 
      numero_cotizacion,
      case p.tipo_documento 
      when 1 then 'DNI' when 2 then 'CARNET DE EXTRANJERIA' END AS tipo_documento, p.numero_documento, 
        CONCAT('EN_',numero_cotizacion,'_',p.numero_documento,'.PDF') AS nombrearchivo, '' AS idpersona 
    FROM siv_db.solicitud  s 
    INNER JOIN siv_db.solicitud_producto sp on s.id_solicitud = sp.id_solicitud
    LEFT JOIN persona p ON s.id_asegurado = p.id_persona 
    WHERE str_to_date(sp.fecha_cotizacion, '%d/%m/%Y') >= '${fechaInicioEDN}' AND 
        str_to_date(sp.fecha_cotizacion, '%d/%m/%Y') >= '${fechainicio} 00:00:00' AND 
        str_to_date(sp.fecha_cotizacion, '%d/%m/%Y')  <= '${fechafin} 23:59:59';`;
  console.log("Query", query);
  const [resultsADN] = await pool.query(query); // cotizacion con solicitud finalizada

  let cotizaciones = [];
  let personas = [];
  let personas_buscar = [];

  console.log('Se encontraron ' + resultsADN.length + ' registros en ADN')
  let i=0;
  for (const elementADN of resultsADN) {
    i=i+1;
    // console.log(i + '/'+ resultsADN.length+': ', elementADN.numero_cotizacion, elementADN.tipo_documento, elementADN.numero_documento);
    cotizaciones.push({
      num_solicitud: elementADN.numero_cotizacion,
      tipo_documento: elementADN.tipo_documento, 
      num_documento: elementADN.numero_documento,
      ruta_cloud_storage: elementADN.nombrearchivo
    });

    const data = { "TIPO_DOCUMENTO": elementADN.tipo_documento, "NUMERO_DOCUMENTO": elementADN.numero_documento };
    if ( personas.includes(elementADN.tipo_documento+"-"+elementADN.numero_documento) ) continue;
    personas.push(elementADN.tipo_documento+"-"+elementADN.numero_documento);
    personas_buscar.push(data);
  }
  console.log("cotizaciones total=",cotizaciones.length);

  const personasmongo = await getPersonas(personas_buscar);

  for (let cotizacion of cotizaciones) {
    const personamongo = personasmongo.find(element => element.TIPO_DOCUMENTO == cotizacion.tipo_documento && element.NUMERO_DOCUMENTO == cotizacion.num_documento);
    if (personamongo == null) continue;
    if ( personamongo.ID_PERSONA == null || personamongo.ID_PERSONA == undefined || personamongo.ID_PERSONA == "" ) continue;
    
    const ID_PERSONA = personamongo.ID_PERSONA.toLowerCase();
    // console.log(`ID_PERSONA[${cotizacion.tipo_documento}-${cotizacion.num_documento}]:`, ID_PERSONA);
    cotizacion.ruta_cloud_storage = ID_PERSONA + '/' + cotizacion.ruta_cloud_storage;
  }
  res.json(cotizaciones);
});

// Siempre retorna 1 solo objeto
async function getPersona(tipodoc, numdoc) {
  let query = {
    TIPO_DOCUMENTO: tipodoc,
    NUMERO_DOCUMENTO: numdoc
  };
  let mongo_persona = poolMG.get('persona_documento');
  let [results] = await mongo_persona.find(query);
  return results;
}

async function getPersonas(buscar) {
  let query = {$or: buscar};
  // console.log("query", query)
  let mongo_persona = poolMG.get('persona_documento');
  console.log("antes de query mongo", new Date().toTimeString());
  let results = await mongo_persona.find(query);
  console.log("después de query mongo", new Date().toTimeString());
  console.log("results total=", results.length);
  return results;
}

module.exports = router;
