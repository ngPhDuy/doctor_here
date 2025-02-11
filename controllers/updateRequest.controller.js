const updateRequestService = require('../services/updateRequest.service');

exports.getAllNewRequest = async (req, res) => {
    try {
        const newRequest = await updateRequestService.getAllNewRequest();
        res.status(200).json(newRequest);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.getOldRequest = async (req, res) => {
    try {
        const oldRequest = await updateRequestService.getOldRequest();
        res.status(200).json(oldRequest);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.getRequestDetail = async (req, res) => {
    try {
        const requestID = req.params.requestID;
        const requestDetail = await updateRequestService.getRequestDetail(requestID);
        res.status(200).json(requestDetail);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.getRequestByDoctorID = async (req, res) => {
    try {
        const doctorID = req.params.doctorID;
        const request = await updateRequestService.getRequestByDoctorID(doctorID);
        res.status(200).json(request);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.handleRequest = async (req, res) => {
    try {
        const requestID = req.body.requestID;
        const approved = req.body.approved;
        const adminID = req.body.adminID;
        const handledRequest = await updateRequestService.handleRequest(requestID, approved, adminID);
        const message = approved ? 'Yêu cầu đã được duyệt' : 'Yêu cầu đã bị từ chối';
        res.status(200).json({ message: message, handledRequest: handledRequest });
    } catch (error) {
        res.status(500).send(error.message);
    }
}