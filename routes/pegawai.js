var express=require('express');
var router = express.Router();

var connection = require('../config/database.js');
router.get(`/`, (req,res,next) => {
    connection.query(`SELECT * FROM pegawai ORDER BY id_pegawai DESC`,(err, rows)=>{
        if(err){
            req.flash(err);
        }else{
            res.render(`pegawai/index`,{
                data: rows
            })
        }
    });
})

router.get(`/create`, (req,res,next) => {
    res.render(`pegawai/create`);
})

router.post(`/store`, (req,res,next) => {
    let {nama_pegawai, nip_pegawai, jabatan_pegawai} = req.body;
    let data = {nama_pegawai, nip_pegawai, jabatan_pegawai}
    try {
        connection.query(`insert into pegawai set ?`, data, (err,rows) => {
            if(err){
                console.log(err);
                res.redirect(`/pegawai`)
                return false
            }
            req.flash(`succ`, `Berhasil menambahkan data`)
            res.redirect(`/pegawai`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/pegawai`)
    }
})

router.get(`/edit/:id`, (req,res,next) => {
    id = req.params.id
    connection.query(`SELECT * FROM pegawai where id_pegawai = ${id}`,(err, rows)=>{
        if(err){
            req.flash(err);
        }else{
            rows = rows[0];
            res.render(`pegawai/edit`,{
                nama : rows.nama_pegawai,
                nip : rows.nip_pegawai,
                jabatan_pegawai : rows.jabatan_pegawai,
                id : rows.id_pegawai,
            })
        }
    });
})

router.post(`/update/:id`, (req,res,next) => {
    let id = req.params.id
    let {nama_pegawai, nip_pegawai, jabatan_pegawai} = req.body
    let data = {nama_pegawai, nip_pegawai, jabatan_pegawai}
    try {
        connection.query(`update pegawai set ? where id_pegawai = ${id}`, data, (err,rows) => {
            if(err){
                req.flash(`err`, err);
                res.redirect(`/pegawai`)
                return false
            }
            req.flash(`succ`, `Berhasil mengubah data`)
            res.redirect(`/pegawai`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/pegawai`)
    }
})

router.get(`/delete/:id`, (req,res,next) => {
    let id = req.params.id
    connection.query(`delete from pegawai where id_pegawai = ${id}`, (err, rows) => {
        if(err){
            console.log(err);
            req.flash(`err`, `query gagal`);
            res.redirect(`/pegawai`)
            return false
        }
        req.flash(`succ`, `Berhasil menghapus data`)
        res.redirect(`/pegawai`)
    })
})

module.exports = router;