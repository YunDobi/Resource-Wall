/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM categories`;
    console.log(query);
    db.query(query)
      .then(data => {
        const categories = data.rows;
        res.json(categories);
      });
  });

  router.post('/', (req, res) => {
    // console.log('++++++',req.body);
    db.query('INSERT INTO resourcescategories (resource_id, category_id) VALUES ($1,$2)',[req.body.resourceId, req.body.topic_id])
      .then(() => {
        res.redirect(`/resources`);
      });
  });

  router.post('/new', (req, res) => {
    db.query('INSERT INTO categories (name, description, user_id) VALUES ($1,$2,$3)',
      [req.body.name, req.body.description, req.session.user_id])
      .then(() => {
        res.redirect(`/`);
      });
  });

  router.get('/:catid', (req, res) => {
    db.query(`SELECT resources.id, resources.user_id, resources.url, resources.title, resources.description,
    resourcescategories.resource_id, resourcescategories.category_id FROM resources
    INNER JOIN resourcescategories ON resources.id = resourcescategories.resource_id
    WHERE resourcescategories.category_id = ${req.params.catid};`)
      .then((response) => {
        const allResources = response.rows;

        const user_id = req.session.user_id;
        db.query(`SELECT * FROM categories WHERE user_id = ${user_id}`)
          .then((catResponse) => {
            //console.log(catResponse.rows)
            res.render('category', {
              categories: catResponse.rows,
              urls: allResources
            });
          });
      });
  });
  return router;
};
