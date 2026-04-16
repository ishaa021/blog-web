const pool = require('../config/db');

exports.getAllPosts = async () => {
  const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  return result.rows;
};

exports.getPostById = async (id) => {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
};

exports.createPost = async (title, content) => {
  await pool.query('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);
};

exports.updatePost = async (id, title, content) => {
  const result = await pool.query(
    'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  return result.rows[0] || null;
};

exports.deletePost = async (id) => {
  const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
};
