const express = require('express');
const router = express.Router();
const pool = require('./db.js');

// 获取所有学生信息
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 获取指定 ID 的学生信息
router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 添加学生信息
router.post('/', async (req, res) => {
    const { name, age, gender, major } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO students (name, age, gender, major) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, age, gender, major]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 更新学生信息
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, major } = req.body;
    try {
        const result = await pool.query(
            'UPDATE students SET name = $1, age = $2, gender = $3, major = $4 WHERE id = $5 RETURNING *',
            [name, age, gender, major, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 删除学生信息
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM students WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;