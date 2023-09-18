import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `SELECT dir.full_name AS director, ROUND(SUM(mov.budget), 2) as total_budget 
      FROM movies mov
      JOIN movie_directors md ON mov.id = md.movie_id
      JOIN directors dir ON md.director_id = dir.id
      GROUP BY dir.full_name 
      ORDER BY total_budget DESC 
      LIMIT 3;
      
      `;
      const result = await db.selectMultipleRows(query);
      console.log("DB Result:", result);

      expect(result).toEqual([
        {
            director: "Ridley Scott",
            total_budget: 697900000
        },
        {
            director: "Christopher Nolan",
            total_budget: 510000000
        },
        {
            director: "Michael Bay",
            total_budget: 500000000
        }
    ]);
    

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `SELECT k.keyword, COUNT(mk.movie_id) AS count
      FROM keywords k
      JOIN movie_keywords mk ON k.id = mk.keyword_id
      GROUP BY k.keyword
      ORDER BY count DESC
      LIMIT 10;
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162
        },
        {
          keyword: "independent film",
          count: 115
        },
        {
          keyword: "based on novel",
          count: 85
        },
        {
          keyword: "duringcreditsstinger",
          count: 82
        },
        {
          keyword: "biography",
          count: 78
        },
        {
          keyword: "murder",
          count: 66
        },
        {
          keyword: "sex",
          count: 60
        },
        {
          keyword: "revenge",
          count: 51
        },
        {
          keyword: "sport",
          count: 50
        },
        {
          keyword: "high school",
          count: 48
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select all movies called Life and return amount of actors",
    async done => {
      const query = `SELECT m.original_title, COUNT(ma.actor_id) AS count
      FROM movies m
      JOIN movie_actors ma ON m.id = ma.movie_id
      WHERE m.original_title = 'Life'
      GROUP BY m.original_title;
      `;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `SELECT g.genre, COUNT(*) AS five_stars_count
      FROM genres g
      JOIN movie_genres mg ON g.id = mg.genre_id
      JOIN movie_ratings mr ON mg.movie_id = mr.movie_id
      WHERE mr.rating = 5
      GROUP BY g.genre
      ORDER BY five_stars_count DESC
      LIMIT 3;
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052
        },
        {
          genre: "Thriller",
          five_stars_count: 11771
        },
        {
          genre: "Crime",
          five_stars_count: 8670
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `SELECT g.genre, ROUND(AVG(mr.rating), 2) AS avg_rating
      FROM genres g
      JOIN movie_genres mg ON g.id = mg.genre_id
      JOIN movie_ratings mr ON mg.movie_id = mr.movie_id
      GROUP BY g.genre
      ORDER BY avg_rating DESC
      LIMIT 3;
      
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79
        },
        {
          genre: "Music",
          avg_rating: 3.73
        },
        {
          genre: "Documentary",
          avg_rating: 3.71
        }
      ]);

      done();
    },
    minutes(3)
  );
});
