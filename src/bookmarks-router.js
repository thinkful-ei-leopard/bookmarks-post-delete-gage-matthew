const express = require('express');
const logger = require('./logger');
const { isWebUri } = require('valid-url');
const xss = require('xss');

const BookmarksService = require('./bookmarks-service');


const bodyParser = express.json();
const bookmarksRouter = express.Router();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating)
});

bookmarksRouter
  .route('/api/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, rating, url, description='' } = req.body;
        
    if (!title || !rating || !url) {
      logger.error('Title, rating, and url are required');
      return res
        .status(400)
        .send('Invalid Data');
    }
      
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res
        .status(400)
        .send('rating must be a number between 1 and 5');
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url ${url}`);
      return res
        .status(400)
        .send('Not valid URL');
    } 

    const newBookmark = { title, url, description, rating };

    BookmarksService.insertBookmark(req.app.get('db'),newBookmark)
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created.`);
        res.status(201)
          .location(`/api/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
  });

bookmarksRouter
  .route('/api/bookmarks/:id')
  .all((req,res, next) => {
    const { id } = req.params;
    BookmarksService.getBookmarkById(req.app.get('db'), id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found`);
          return res
            .status(404)
            .send('Bookmark not found');
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(bookmark))
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    BookmarksService.deleteBookmark(req.app.get('db'), id)
      .then(rowsAffected => {
        if(rowsAffected < 1) {
          logger.info(`Bookmark with id ${id} not found`);
          res.status(404).send('Bookmark not found');
        } else {
          logger.info(`Bookmark with id ${id} deleted`);
          res.status(204).end();
        }
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const bookmarkToUpdate = { title, url, description, rating};
    
    BookmarksService.updateBookmark(
      req.app.get('db'),
      req.params.bookmark_id,
      bookmarkToUpdate
    )
      .then(numFieldsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });
  
module.exports = bookmarksRouter;