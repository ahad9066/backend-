
const { AwsS3, Email } = (require('../shared/libraries'));
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const orderModel = require('../models/orders.model')
const mongoose = require('mongoose');
const connection = mongoose.connection;
class ResultsService {
    constructor() {
        this.model = orderModel;
    }

    async uploadFile(payload) {
        try {
            console.log('payload', payload)
            const awsResponse = await AwsS3.uploadFile(payload.fileBuffer, payload.folderName, payload.fileName);
            await this.removeLocalFile(payload.templatePath);
            return awsResponse;
        }
        catch (err) {
            console.log("aws error", err)
            throw (err)
        }
    }

    async removeLocalFile(file) {
        const res = await unlinkFile(file)
        return res;
    }



    async downloadFile(fileKey) {
        try {
            const result = await this.model.find({ invoiceFileKey: fileKey })
            if (!result) {
                throw ({ StatusCode: 404, message: `Result with ID ${result_id} does not exist` })
            }
            return AwsS3.getFileStream(fileKey);
        }
        catch (err) {
            throw (err)
        }
    }
    // async sendEmail(template, resultId) {
    //     const result = await this.model.findById(resultId);
    //     if (!result) {
    //         throw ({ StatusCode: 404, message: `Result with ID ${resultId} does not exist` })
    //     }
    //     const collection = await connection.db.collection("patients");
    //     const patient = await collection.findOne({ _id: mongoose.Types.ObjectId(result.patientId) })
    //     const attachment = await AwsS3.getFileForEmail(result.file_key);
    //     return Email.sendTemplate(
    //         patient.email,
    //         template, { result_type: Department[result.result_type], first_name: patient.firstName }, { attachments: [attachment] }
    //     )
    //         .catch(e => {
    //             throw { statusCode: 500, message: `Error while sending '${template}' email` };
    //         });

    // }

}

module.exports = ResultsService;
