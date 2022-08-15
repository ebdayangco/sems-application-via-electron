const { getOnDate } = require("../../../supporters/sections/RequestSection");
const settingJSON = require('../../../supporters/storages/settings.json');
const fs = require("fs");
const addressController = require("../../controllers/AddressController");
const appUpdaterController = require("../../controllers/AppUpdaterController");
const engineerController = require("../../controllers/EngineerController");
const genexpertController = require("../../controllers/GenexpertController");
const installationtypeController = require("../../controllers/InstallationTypeController");
const modelNumberController = require("../../controllers/ModelNumberController");
const autoCompleteView = require("../../views/AutoCompleteView");
const { ipcRenderer } = require("electron");
const reportController = require("../../controllers/ReportController");
const shell = require('electron').shell;
const notificationController = require("../../controllers/NotificationController");
const jotformController = require("../../controllers/JotFormController");
const userController = require("../../controllers/UserController");

