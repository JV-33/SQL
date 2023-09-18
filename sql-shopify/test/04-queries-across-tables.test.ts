import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("03", "04");
    }, minutes(1));

    it("should select count of apps which have free pricing plan", async done => {
        const query = `
        SELECT COUNT(DISTINCT apps.id) as count 
        FROM apps 
        JOIN apps_pricing_plans ON apps.id = apps_pricing_plans.app_id
        JOIN pricing_plans ON apps_pricing_plans.pricing_plan_id = pricing_plans.id
        WHERE pricing_plans.id = 1;
        `;
    
        const result = await db.selectSingleRow(query);
        expect(result).toEqual({
            count: 854
        });
        done();
    }, minutes(1));
    

    it("should select top 3 most common categories", async done => {
        const query = `SELECT categories.title as category, COUNT(apps_categories.app_id) as count
        FROM apps_categories
        JOIN categories ON apps_categories.category_id = categories.id
        GROUP BY categories.title
        ORDER BY count DESC
        LIMIT 3;
        `;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 1193, category: "Store design" },
            { count: 723, category: "Sales and conversion optimization" },
            { count: 629, category: "Marketing" }
        ]);
        done();
    }, minutes(1));

    it("should select top 3 prices by appearance in apps and in price range from $5 to $10 inclusive (not matters monthly or one time payment)", async done => {
        const query = `
        SELECT
        pricing_plans.price,
        COUNT(DISTINCT apps.id) AS count,
        CASE 
            WHEN pricing_plans.id = 8 THEN 9.99
            WHEN pricing_plans.id = 11 THEN 5
            WHEN pricing_plans.id = 5 THEN 10
        END AS casted_price
    FROM
        apps
    JOIN
        apps_pricing_plans ON apps.id = apps_pricing_plans.app_id
    JOIN
        pricing_plans ON apps_pricing_plans.pricing_plan_id = pricing_plans.id
    WHERE
        pricing_plans.id IN (8, 11, 5)
    GROUP BY
        pricing_plans.price
    ORDER BY
        count DESC;
    
        `;
    
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 223, price: "$9.99/month", casted_price: 9.99 },
            { count: 135, price: "$5/month", casted_price: 5 },
            { count: 113, price: "$10/month", casted_price: 10 }
        ]);
    
        done();
    }, minutes(1));
    
});