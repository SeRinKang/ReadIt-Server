const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')

router.get('/:contents_idx',authUtils.isLoggedin,async (req,res) => {
    let updateReadQuery = 
    `
    UPDATE contents
    SET read_flag = true
    WHERE contents_idx = ${req.params.contents_idx}
    `

    let selectHighlightQuery = 
    `SELECT * FROM highlight
    WHERE contents_idx = ${req.params.contents_idx}
    ORDER BY highlight_date DESC
    `

    let selectHighlightResult
    let readTransaction = await db.Transaction(async(connection) => {
        let updateReadResult = await connection.query(updateReadQuery)

        if(updateReadResult.affectedRows != 1) {
           return res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
        } 
        selectHighlightResult = await connection.query(selectHighlightQuery)
    })

    if(readTransaction == undefined || readTransaction == null){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    } else {
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.READ_CONTENTS_SUCCESS,selectHighlightResult))
    }

    // let updateReadResult = await db.queryParam_None(updateReadQuery)
    // if(updateReadResult.affectedRows == 1){
    //     res.status(200).send(util.successTrue(statusCode.OK,resMessage.CONTENS_READ_SUCCESS))
    // } else if(updateReadResult.affectedRows != 1) {
    //     res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
    // } else {
    //     res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    // }
})

module.exports = router