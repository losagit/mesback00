const querys = {};

querys.insert = (tabla, columns) => {
  const vals = columns.map(() => '?').join(',');
  const sql = `INSERT INTO ${tabla} (${columns.join(', ')}) VALUES (${vals})`
  return sql;
};

querys.select = (tabla, conditions = null) => {
  let sql = `SELECT * FROM ${tabla} WHERE 1=1 `;
  const vals = [];

  if(conditions){
      Object.keys(conditions).forEach(key => {
        if (conditions[key] !== undefined) {
          sql += ` AND ${key} = ?`;
          vals.push(conditions[key]);
        }
      });
  }

  return { sql, vals };
};

querys.selectJoin = (tabla1, tabla2, conditions) => {
  let sql = `SELECT * FROM ${tabla1} INNER JOIN ${tabla2} ON `;
  const vals = [];

  Object.keys(conditions).forEach(key => {
    if (conditions[key] !== undefined) {
      sql += `${tabla1}.${key} = ${tabla2}.${conditions[key]} AND `;
    }
  });

  sql = sql.slice(0, -5); // Elimina el último 'AND' redundante

  return { sql, vals };
};

querys.selectJoinMultiple = ( tables, joins, wheres) => {
  let sql = `SELECT * FROM ${tables[0]}`;
  let vals = [];

  for(let i = 1; i< tables.length ; i++){
    const condition = joins[i - 1];
    sql += ` INNER JOIN ${tables[i]} ON ${condition}`;
  }

  if(wheres && Object.keys(wheres).length > 0){
    sql += ` WHERE `;
    Object.keys(wheres).forEach( key => {
      if(wheres[key] !== undefined) {
        sql += `${key} = ? AND `;
        vals.push(wheres[key]);
      }
    });
    sql = sql.slice(0,-5);
  }

  return { sql, vals }

};

querys.selectkardex = `SELECT 
    producto,
    fecha,
    cantidad_ingreso,
    costo_ingreso,
    total_ingreso,
    cantidad_gasto,
    costo_gasto, 
    total_gasto,    
    @total_acum := @total_acum + COALESCE(total_ingreso, 0) - COALESCE(total_gasto, 0) AS total_acumulado
FROM (
    SELECT
        dt_ingreso.producto,
        ti.fecha,
        dt_ingreso.cantidad AS cantidad_ingreso,
        dt_ingreso.precio_unitario AS costo_ingreso,
        dt_ingreso.subtotal AS total_ingreso,
        NULL AS cantidad_gasto,
        NULL AS costo_gasto,
        NULL AS total_gasto
    FROM
        detalle_ingresos dt_ingreso
    JOIN
        ingresos ti ON dt_ingreso.ingresos_id = ti.id

    UNION ALL

    SELECT
        dt_gasto.producto,
        tg.fecha,
        NULL AS cantidad_ingreso,
        NULL AS costo_ingreso,
        NULL AS total_ingreso,
        dt_gasto.cantidad AS cantidad_gasto,
        dt_gasto.precio_unitario AS costo_gasto,
        dt_gasto.subtotal AS total_gasto
    FROM
        detalle_gastos dt_gasto
    JOIN
        gastos tg ON dt_gasto.gastos_id = tg.id
) AS subquery
CROSS JOIN (SELECT @cantidad_acum := 0, @total_acum := 0) AS vars
ORDER BY fecha;`

module.exports = querys;

