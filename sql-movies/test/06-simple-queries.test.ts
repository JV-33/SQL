import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Simple Queries", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("05", "06");
  }, minutes(3));

  it(
    "should select total budget and revenue from movies, by using adjusted financial data",
    async done => {
      const query = `
      SELECT 
          ROUND(SUM(budget_adjusted), 2) as total_budget, 
          ROUND(SUM(revenue_adjusted), 2) as total_revenue 
      FROM movies;
  `;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        total_budget: 53668223285.94,
        total_revenue: 148342748033.4
      });

      done();
    },
    minutes(3)
  );


   it(
    "should select count from movies where budget was more than 100000000 and release date after 2009",
    async done => {
      const query = `
        SELECT
            COUNT(*) AS count
        FROM movies
        WHERE budget > 100000000 AND release_date > '2009-12-31';
      `;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(71);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three movies order by budget where release data is after 2009",
    async done => {
      const query = `
        SELECT
            original_title,
            budget,
            revenue
        FROM movies
        WHERE release_date > '2009-12-31'
        ORDER BY budget DESC
        LIMIT 3;
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: "The Warrior's Way",
          budget: 425000000.0,
          revenue: 11087569.0
        },
        {
          original_title: "Avengers: Age of Ultron",
          budget: 280000000,
          revenue: 1405035767
        },
        {
          original_title: "Tangled",
          budget: 260000000,
          revenue: 591794936
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies where homepage is secure (starts with https)",
    async done => {
      const query = `
        SELECT
            COUNT(*) AS count
        FROM movies
        WHERE homepage LIKE 'https%';
      `;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(42);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies released every year",
    async done => {
      const query = `
          SELECT
              COUNT(*) AS count,
              strftime('%Y', release_date) AS year
          FROM movies
          GROUP BY year
          ORDER BY year DESC;
    `;
  
      const result = await db.selectMultipleRows(query);

      expect(result.length).toBe(8);
      expect(result.slice(0, 3)).toEqual([
        {
          count: 627,
          year: "2015"
        },
        {
          count: 696,
          year: "2014"
        },
        {
          count: 487,
          year: "2010"
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three users which left most ratings",
    async done => {
      const query = `
        SELECT
            user_id,
            COUNT(*) AS count
        FROM movie_ratings
        GROUP BY user_id
        ORDER BY count DESC
        LIMIT 3;
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          user_id: 8659,
          count: 48
        },
        {
          user_id: 45811,
          count: 45
        },
        {
          user_id: 179792,
          count: 40
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of ratings left each month",
    async done => {
      const query = `
      SELECT
      COUNT(*) AS count,
      strftime('%m', time_created) AS month
  FROM movie_ratings
  GROUP BY month
  ORDER BY count DESC
  LIMIT 3;
  
  `;
  
  
      const result = await db.selectMultipleRows(query);
      console.log(result);

      expect(result).toEqual([
        {
          count: 16521,
          month: "11"
        },
        {
          count: 16479,
          month: "12"
        },
        {
          count: 15175,
          month: "10"
        },
      ]);

      done();
    },
    minutes(3)
  );
});