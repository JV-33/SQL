export const selectCount = (table: string): string => {
  const sqlQuery = `SELECT COUNT(*) as c FROM ${table}`;
  return sqlQuery;
};


export const selectRowById = (id: number, table: string): string => {
  const sqlQuery = `SELECT * FROM ${table} WHERE id = ${id}`;
  return sqlQuery;
};

export const selectCategoryByTitle = (title: string): string => {
  const sqlQuery = `SELECT * FROM categories WHERE title = '${title}'`;
  return sqlQuery;
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  const sqlQuery = `
    SELECT 
      apps.title AS app_title, 
      categories.title AS category_title, 
      apps_categories.category_id
    FROM apps_categories
    JOIN apps ON apps_categories.app_id = apps.id
    JOIN categories ON apps_categories.category_id = categories.id
    WHERE apps_categories.app_id = ${appId};
  `;
  return sqlQuery;
};


export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  const sqlQuery = `SELECT COUNT(DISTINCT ${columnName}) AS c FROM ${tableName}`;
  return sqlQuery;
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  const sqlQuery = `SELECT * FROM reviews WHERE app_id = ${appId} AND author = '${author}'`;
  return sqlQuery;
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  const sqlQuery = `SELECT ${columnName} FROM ${tableName}`;
  return sqlQuery;
};
