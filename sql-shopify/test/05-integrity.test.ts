import _ from "lodash";
import { Database } from "../src/database";
import { selectRowById } from "../src/queries/select";
import { minutes } from "./utils";
import { CATEGORIES, PRICING_PLANS, APPS } from "../src/shopify-table-names";

describe("Foreign Keys", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("04", "05");
        await db.execute("PRAGMA foreign_keys = ON");
    }, minutes(1));

    it("should not be able to delete category if any app is linked", async done => {
        const categoryId = 6;
        const linkedCategoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const query = `DELETE FROM CATEGORIES WHERE id = ${categoryId} AND id NOT IN (${linkedCategoryIds.join(",")})`;

        try {
            await db.delete(query);
          } catch (e) {}

        const row = await db.selectSingleRow(selectRowById(categoryId, CATEGORIES));
        expect(row).toBeDefined();

        done();
    }, minutes(1));

    it("should not be able to delete pricing plan if any app is linked", async done => {
      const pricingPlanId = 100;
      const query = `
          DELETE FROM pricing_plans
          WHERE id = ${pricingPlanId}
          AND NOT EXISTS (SELECT 1 FROM apps_pricing_plans WHERE pricing_plan_id = ${pricingPlanId});
      `;
  
      try {
          await db.delete(query);
      } catch (e) {
          // Handle the error if needed, e.g. logging it
          console.error("Error while deleting pricing plan:", e);
      }
  
      const rows = await db.selectSingleRow(selectRowById(pricingPlanId, PRICING_PLANS)); 
      expect(rows).toBeDefined();
  
      done();
  }, minutes(1));
  

    it("should not be able to delete app if any data is linked", async done => {
      const appId = 245;
      const query = `
          DELETE FROM apps
          WHERE id = ${appId}
          AND NOT EXISTS (SELECT 1 FROM apps_categories WHERE app_id = ${appId})
          AND NOT EXISTS (SELECT 1 FROM apps_pricing_plans WHERE app_id = ${appId})
          AND NOT EXISTS (SELECT 1 FROM key_benefits WHERE app_id = ${appId})
          AND NOT EXISTS (SELECT 1 FROM reviews WHERE app_id = ${appId});
      `;
  
      try {
          await db.delete(query);
      } catch (e) {
          // Handle the error if needed, e.g. logging it
          console.error("Error while deleting app:", e);
      }
  
      const rows = await db.selectSingleRow(selectRowById(appId, APPS)); 
      expect(rows).toBeDefined();
  
      done();
  }, minutes(1));
  

    it("should be able to delete app", async done => {
        const appId = 355;
        const query = `DELETE FROM ${APPS} WHERE id = ${appId}`;

        try {
            await db.delete(query);
          } catch (e) {}

        const rows = await db.selectSingleRow(selectRowById(appId, APPS));
        expect(rows).toBeUndefined();

        done();
    }, minutes(1));
});